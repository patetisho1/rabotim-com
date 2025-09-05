const { execSync } = require('child_process');
const https = require('https');

// GitHub API функция за създаване на Pull Request
function createPullRequest() {
  const prData = {
    title: "🚀 Sync staging to production - Ready for deployment",
    head: "staging",
    base: "main",
    body: `## 📋 Описание

Този Pull Request синхронизира staging средата с production.

## ✅ Завършени функционалности:
- **Публикуване на задачи** - 5-стъпков процес с валидация
- **Подаване на оферти** - Пълнофункционална форма
- **Система за съобщения** - Real-time чат
- **Админ панел** - Аналитика и статистики
- **Платежна система** - Stripe интеграция

## 🔧 Поправки:
- Поправена синтактична грешка в page.tsx
- Поправена TypeScript грешка в submit-offer

## 🧪 Тестване:
- [x] Всички функционалности тествани в staging
- [x] Build работи без грешки
- [x] TypeScript проверки преминават

## 🚀 Готов за production deployment!`
  };

  console.log('📋 Pull Request данни:');
  console.log('Заглавие:', prData.title);
  console.log('От клон:', prData.head);
  console.log('Към клон:', prData.base);
  console.log('\n🔗 Линк за създаване на Pull Request:');
  console.log(`https://github.com/patetisho1/rabotim-com/compare/main...staging`);
  console.log('\n📝 Копирайте и поставете описанието:');
  console.log(prData.body);
}

// Изпълняваме функцията
createPullRequest();
