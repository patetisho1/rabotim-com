#!/usr/bin/env node

/**
 * Email Setup Script for Supabase
 * This script helps configure email settings for Supabase Auth
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Supabase Email Configuration Helper');
console.log('=====================================\n');

console.log('📋 Следвайте тези стъпки в Supabase Dashboard:\n');

console.log('1️⃣  Отидете на: https://supabase.com/dashboard');
console.log('2️⃣  Влезте в акаунта си и изберете проекта');
console.log('3️⃣  В лявото меню кликнете на "Authentication"');
console.log('4️⃣  Кликнете на "Settings" (или "Настройки")\n');

console.log('📧 В секцията "Email" направете следните настройки:\n');

console.log('✅ Enable email provider - включете (зелен toggle)');
console.log('✅ Enable email confirmations - включете');
console.log('✅ Secure email change - включете');
console.log('❌ Secure password change - можете да оставите изключено');
console.log('❌ Prevent use of leaked passwords - можете да оставите изключено\n');

console.log('🌐 URL Configuration:');
console.log('Site URL: https://rabotim-com-staging.vercel.app');
console.log('Redirect URLs:');
console.log('  - https://rabotim-com-staging.vercel.app/auth/callback');
console.log('  - http://localhost:3000/auth/callback\n');

console.log('📝 Email Templates:');
console.log('1. Кликнете на "Email Templates" в лявото меню');
console.log('2. Намерете "Confirm signup" template');
console.log('3. Настройте Subject и Body (HTML)\n');

console.log('💾 Запазете всички настройки с "Save" бутона\n');

console.log('🧪 За тестване:');
console.log('1. Регистрирайте нов акаунт на staging средата');
console.log('2. Проверете email пощата за потвърдителен имейл');
console.log('3. Натиснете линка в имейла за активиране\n');

console.log('🚨 Ако не получавате имейли:');
console.log('1. Проверете Spam папката');
console.log('2. Уверете се, че email настройките са запазени');
console.log('3. Опитайте с различен email адрес\n');

console.log('⚡ Бързо решение за тестване:');
console.log('Ако искате да тествате без email потвърждение:');
console.log('1. В Authentication Settings изключете "Enable email confirmations"');
console.log('2. Запазете настройките');
console.log('3. Сега регистрацията ще работи без email потвърждение\n');

rl.question('Натиснете Enter когато сте готови да продължите...', () => {
  console.log('\n✅ Готово! Сега можете да тествате функционалностите.');
  console.log('📱 Staging URL: https://rabotim-com-staging.vercel.app');
  rl.close();
});
