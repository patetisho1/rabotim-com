#!/usr/bin/env ts-node
/**
 * Script to analyze Playwright test results and provide actionable insights
 * Usage: npm run test:analyze
 */

import fs from 'fs';
import path from 'path';

interface TestFailure {
  title: string;
  file: string;
  error: string;
  screenshot?: string;
  trace?: string;
}

interface TestResults {
  passed: number;
  failed: number;
  skipped: number;
  failures: TestFailure[];
}

function readPlaywrightResults(): TestResults {
  const resultsPath = path.join(process.cwd(), 'test-results');
  const htmlReportPath = path.join(process.cwd(), 'playwright-report');
  
  const results: TestResults = {
    passed: 0,
    failed: 0,
    skipped: 0,
    failures: []
  };

  // Read from JSON results if available
  const jsonResultsPath = path.join(process.cwd(), 'test-results.json');
  if (fs.existsSync(jsonResultsPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(jsonResultsPath, 'utf-8'));
      results.passed = data.stats?.passed || 0;
      results.failed = data.stats?.failed || 0;
      results.skipped = data.stats?.skipped || 0;
      
      if (data.results) {
        data.results.forEach((test: any) => {
          if (test.status === 'failed') {
            results.failures.push({
              title: test.title || 'Unknown test',
              file: test.file || 'Unknown file',
              error: test.error?.message || 'Unknown error',
              screenshot: test.attachments?.find((a: any) => a.name === 'screenshot')?.path,
              trace: test.attachments?.find((a: any) => a.name === 'trace')?.path
            });
          }
        });
      }
    } catch (error) {
      console.error('Error reading test results:', error);
    }
  }

  // Try to read from HTML report index
  if (fs.existsSync(htmlReportPath)) {
    try {
      const indexHtml = fs.readFileSync(path.join(htmlReportPath, 'index.html'), 'utf-8');
      // Extract failure count from HTML
      const failureMatch = indexHtml.match(/<span[^>]*>(\d+) failed<\/span>/i);
      if (failureMatch) {
        results.failed = parseInt(failureMatch[1], 10);
      }
    } catch (error) {
      // HTML report might not exist yet
    }
  }

  return results;
}

function analyzeFailure(failure: TestFailure): string[] {
  const suggestions: string[] = [];
  
  // Analyze error patterns
  if (failure.error.includes('timeout') || failure.error.includes('Timeout')) {
    suggestions.push('⚠️  TIMEOUT: Елементът не се зарежда достатъчно бързо');
    suggestions.push('   → Увеличи timeout или провери дали елементът наистина се рендира');
    suggestions.push('   → Провери дали има network errors или бавни заявки');
  }
  
  if (failure.error.includes('not visible') || failure.error.includes('not found')) {
    suggestions.push('⚠️  ELEMENT NOT FOUND: Елементът не е видим или не съществува');
    suggestions.push('   → Провери селектора на елемента');
    suggestions.push('   → Провери дали елементът е скрит (CSS display:none, visibility:hidden)');
    suggestions.push('   → Провери дали има conditional rendering');
  }
  
  if (failure.error.includes('not visible') || failure.error.includes('hidden')) {
    suggestions.push('⚠️  ELEMENT HIDDEN: Елементът е скрит');
    suggestions.push('   → Използвай { force: true } за кликване на скрити елементи');
    suggestions.push('   → Провери z-index или overlay елементи');
  }
  
  if (failure.error.includes('navigation') || failure.error.includes('url')) {
    suggestions.push('⚠️  NAVIGATION ERROR: Проблем с навигация');
    suggestions.push('   → Провери дали URL е правилен');
    suggestions.push('   → Провери дали има redirects');
    suggestions.push('   → Увеличи timeout за навигация');
  }
  
  if (failure.error.includes('authentication') || failure.error.includes('login')) {
    suggestions.push('⚠️  AUTH ERROR: Проблем с автентикация');
    suggestions.push('   → Провери дали тестовият акаунт съществува');
    suggestions.push('   → Провери credentials в environment variables');
    suggestions.push('   → Провери дали session е валиден');
  }
  
  if (failure.error.includes('network') || failure.error.includes('fetch')) {
    suggestions.push('⚠️  NETWORK ERROR: Проблем с мрежата или API');
    suggestions.push('   → Провери дали API endpoint е достъпен');
    suggestions.push('   → Провери дали има CORS проблеми');
    suggestions.push('   → Провери дали има rate limiting');
  }

  // Check test file patterns
  if (failure.file.includes('auth')) {
    suggestions.push('📝 AUTH TEST: Провери authentication flow');
  }
  
  if (failure.file.includes('task')) {
    suggestions.push('📝 TASK TEST: Провери task creation/management');
  }
  
  if (failure.file.includes('notification')) {
    suggestions.push('📝 NOTIFICATION TEST: Провери notification system');
  }

  return suggestions;
}

function generateReport(results: TestResults): string {
  let report = '\n';
  report += '═══════════════════════════════════════════════════════════\n';
  report += '          📊 PLAYWRIGHT TEST RESULTS ANALYSIS 📊          \n';
  report += '═══════════════════════════════════════════════════════════\n\n';
  
  report += `✅ Passed: ${results.passed}\n`;
  report += `❌ Failed: ${results.failed}\n`;
  report += `⏭️  Skipped: ${results.skipped}\n\n`;
  
  if (results.failed === 0) {
    report += '🎉 Всички тестове минаха успешно!\n';
    return report;
  }
  
  report += '═══════════════════════════════════════════════════════════\n';
  report += '                    🔍 FAILURE ANALYSIS                     \n';
  report += '═══════════════════════════════════════════════════════════\n\n';
  
  results.failures.forEach((failure, index) => {
    report += `\n${index + 1}. ❌ ${failure.title}\n`;
    report += `   📁 File: ${failure.file}\n`;
    report += `   ⚠️  Error: ${failure.error}\n\n`;
    
    const suggestions = analyzeFailure(failure);
    if (suggestions.length > 0) {
      report += '   💡 Suggestions:\n';
      suggestions.forEach(suggestion => {
        report += `      ${suggestion}\n`;
      });
    }
    
    if (failure.screenshot) {
      report += `   📸 Screenshot: ${failure.screenshot}\n`;
    }
    
    report += '\n';
  });
  
  report += '═══════════════════════════════════════════════════════════\n';
  report += '💡 Следващи стъпки:\n';
  report += '   1. Провери скрийншотите и trace файловете\n';
  report += '   2. Прегледай предложенията за всеки тест\n';
  report += '   3. Кажи на AI: "тестовете се провалиха, провери ги"\n';
  report += '   4. AI ще анализира и предложи поправки\n';
  report += '═══════════════════════════════════════════════════════════\n\n';
  
  return report;
}

function main() {
  console.log('🔍 Analyzing test results...\n');
  
  const results = readPlaywrightResults();
  const report = generateReport(results);
  
  console.log(report);
  
  // Save report to file
  const reportPath = path.join(process.cwd(), 'test-analysis-report.txt');
  fs.writeFileSync(reportPath, report);
  console.log(`📄 Report saved to: ${reportPath}\n`);
  
  // Exit with error code if tests failed
  if (results.failed > 0) {
    process.exit(1);
  }
  
  process.exit(0);
}

if (require.main === module) {
  main();
}

