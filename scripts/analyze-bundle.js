#!/usr/bin/env node

/**
 * Bundle Analyzer Script
 * Анализира размера на bundle-а и предлага оптимизации
 */

const fs = require('fs');
const path = require('path');

// Цветове за конзолата
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function analyzeComponents() {
  const componentsDir = path.join(__dirname, '../components');
  const components = fs.readdirSync(componentsDir);
  
  log('\n📊 Анализ на компонентите:', 'cyan');
  log('='.repeat(50), 'cyan');
  
  const componentSizes = [];
  
  components.forEach(component => {
    if (component.endsWith('.tsx') || component.endsWith('.ts')) {
      const filePath = path.join(componentsDir, component);
      const stats = fs.statSync(filePath);
      const size = stats.size;
      const sizeKB = (size / 1024).toFixed(2);
      
      componentSizes.push({
        name: component,
        size: size,
        sizeKB: sizeKB
      });
    }
  });
  
  // Сортиране по размер
  componentSizes.sort((a, b) => b.size - a.size);
  
  log('\n🔍 Най-големите компоненти:', 'yellow');
  componentSizes.slice(0, 10).forEach((comp, index) => {
    const size = parseFloat(comp.sizeKB);
    const color = size > 10 ? 'red' : size > 5 ? 'yellow' : 'green';
    log(`${index + 1}. ${comp.name} - ${comp.sizeKB} KB`, color);
  });
  
  return componentSizes;
}

function analyzeHooks() {
  const hooksDir = path.join(__dirname, '../hooks');
  const hooks = fs.readdirSync(hooksDir);
  
  log('\n🎣 Анализ на hooks:', 'cyan');
  log('='.repeat(50), 'cyan');
  
  const hookSizes = [];
  
  hooks.forEach(hook => {
    if (hook.endsWith('.ts') || hook.endsWith('.tsx')) {
      const filePath = path.join(hooksDir, hook);
      const stats = fs.statSync(filePath);
      const size = stats.size;
      const sizeKB = (size / 1024).toFixed(2);
      
      hookSizes.push({
        name: hook,
        size: size,
        sizeKB: sizeKB
      });
    }
  });
  
  hookSizes.sort((a, b) => b.size - a.size);
  
  log('\n🔍 Най-големите hooks:', 'yellow');
  hookSizes.slice(0, 5).forEach((hook, index) => {
    const size = parseFloat(hook.sizeKB);
    const color = size > 5 ? 'red' : size > 2 ? 'yellow' : 'green';
    log(`${index + 1}. ${hook.name} - ${hook.sizeKB} KB`, color);
  });
  
  return hookSizes;
}

function analyzePages() {
  const appDir = path.join(__dirname, '../app');
  
  log('\n📄 Анализ на страниците:', 'cyan');
  log('='.repeat(50), 'cyan');
  
  const pageSizes = [];
  
  function scanDirectory(dir, prefix = '') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        scanDirectory(itemPath, `${prefix}${item}/`);
      } else if (item === 'page.tsx' || item === 'page.ts') {
        const size = stats.size;
        const sizeKB = (size / 1024).toFixed(2);
        
        pageSizes.push({
          name: `${prefix}${item}`,
          size: size,
          sizeKB: sizeKB
        });
      }
    });
  }
  
  scanDirectory(appDir);
  
  pageSizes.sort((a, b) => b.size - a.size);
  
  log('\n🔍 Най-големите страници:', 'yellow');
  pageSizes.slice(0, 10).forEach((page, index) => {
    const size = parseFloat(page.sizeKB);
    const color = size > 20 ? 'red' : size > 10 ? 'yellow' : 'green';
    log(`${index + 1}. ${page.name} - ${page.sizeKB} KB`, color);
  });
  
  return pageSizes;
}

function generateOptimizationSuggestions(components, hooks, pages) {
  log('\n💡 Предложения за оптимизация:', 'magenta');
  log('='.repeat(50), 'magenta');
  
  // Анализ на големите компоненти
  const largeComponents = components.filter(comp => parseFloat(comp.sizeKB) > 10);
  if (largeComponents.length > 0) {
    log('\n🔧 Големи компоненти за lazy loading:', 'yellow');
    largeComponents.forEach(comp => {
      log(`- ${comp.name} (${comp.sizeKB} KB)`, 'red');
    });
  }
  
  // Анализ на големите hooks
  const largeHooks = hooks.filter(hook => parseFloat(hook.sizeKB) > 5);
  if (largeHooks.length > 0) {
    log('\n🎣 Големи hooks за оптимизация:', 'yellow');
    largeHooks.forEach(hook => {
      log(`- ${hook.name} (${hook.sizeKB} KB)`, 'red');
    });
  }
  
  // Анализ на големите страници
  const largePages = pages.filter(page => parseFloat(page.sizeKB) > 20);
  if (largePages.length > 0) {
    log('\n📄 Големи страници за оптимизация:', 'yellow');
    largePages.forEach(page => {
      log(`- ${page.name} (${page.sizeKB} KB)`, 'red');
    });
  }
  
  // Общи предложения
  log('\n🚀 Общи предложения:', 'green');
  log('1. Използвайте dynamic imports за тежки компоненти', 'green');
  log('2. Оптимизирайте изображенията (WebP, AVIF)', 'green');
  log('3. Използвайте React.memo за компоненти', 'green');
  log('4. Разделете големи компоненти на по-малки', 'green');
  log('5. Използвайте useMemo и useCallback за оптимизация', 'green');
  log('6. Настройте code splitting в Next.js', 'green');
}

function main() {
  log('🚀 Bundle Analyzer за Rabotim.com', 'bright');
  log('='.repeat(50), 'bright');
  
  try {
    const components = analyzeComponents();
    const hooks = analyzeHooks();
    const pages = analyzePages();
    
    generateOptimizationSuggestions(components, hooks, pages);
    
    log('\n✅ Анализът завърши успешно!', 'green');
    
  } catch (error) {
    log(`❌ Грешка при анализа: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  analyzeComponents,
  analyzeHooks,
  analyzePages,
  generateOptimizationSuggestions
};

