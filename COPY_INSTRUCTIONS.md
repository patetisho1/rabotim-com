# ИНСТРУКЦИИ ЗА КОПИРАНЕ НА ПРОЕКТА

## 📋 КАК ДА КОПИРАШ ПРОЕКТА НА НОВИЯ КОМПЮТЪР

### 1. **Копиране на файловете:**
```
1. Отиди в папката: C:\Users\TihomirTodorov\Desktop\Cursor AI\rabotim-com
2. Избери всички файлове и папки (Ctrl+A)
3. Копирай (Ctrl+C)
4. На новия компютър: Постави (Ctrl+V) в желаната папка
```

### 2. **Алтернативно - USB флашка:**
```
1. Копирай цялата папка rabotim-com на USB флашка
2. На новия компютър: Копирай от USB флашката
```

### 3. **Алтернативно - OneDrive/Google Drive:**
```
1. Копирай папката rabotim-com в OneDrive/Google Drive
2. На новия компютър: Свали от cloud storage
```

## 🚀 НАСТРОЙКА НА НОВИЯ КОМПЮТЪР

### 1. **Отвори проекта в Cursor:**
```
1. Отвори Cursor
2. File → Open Folder
3. Избери папката rabotim-com
```

### 2. **Отвори Terminal:**
```
1. Натисни Ctrl+`
2. Или View → Terminal
```

### 3. **Инсталирай dependencies:**
```powershell
npm install
```

### 4. **Създай .env.local файл:**
```powershell
# Създай .env.local файл с твоите Supabase credentials
echo "NEXT_PUBLIC_SUPABASE_URL=your-url" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key" >> .env.local
```

### 5. **Прочети гайда:**
```powershell
.\read-local-guide.ps1
```

### 6. **Стартирай проекта:**
```powershell
npm run dev
```

## 📁 ВАЖНИ ФАЙЛОВЕ ЗА КОПИРАНЕ

### ✅ **Задължителни:**
- `package.json` - dependencies
- `package-lock.json` - lock file
- `app/` - цялата папка
- `components/` - цялата папка
- `hooks/` - цялата папка
- `lib/` - цялата папка
- `supabase/` - цялата папка
- `types/` - цялата папка
- `next.config.js` - конфигурация
- `tailwind.config.js` - стилове
- `tsconfig.json` - TypeScript настройки

### ✅ **Опционални:**
- `node_modules/` - може да се инсталира отново
- `.env.local` - ще се създаде нов
- `.git/` - ще се настрои нов

## 🔧 НАСТРОЙКИ НА CURSOR

### 1. **Extensions:**
```
- TypeScript Importer
- Prettier
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
```

### 2. **Settings:**
```json
{
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.formatOnSave": true,
  "files.autoSave": "afterDelay",
  "terminal.integrated.defaultProfile.windows": "PowerShell"
}
```

## 🚨 ПРОВЕРКА НА НАСТРОЙКАТА

### 1. **Проверка на Node.js:**
```powershell
node --version
# Трябва да покаже версия 18+
```

### 2. **Проверка на npm:**
```powershell
npm --version
# Трябва да покаже версия 9+
```

### 3. **Проверка на Git:**
```powershell
git --version
# Трябва да покаже версия 2.30+
```

### 4. **Тестване на проекта:**
```powershell
npm run dev
# Трябва да стартира на http://localhost:3000
```

## 📞 ЗА ПОДДРЪЖКА

### Ако има проблеми:
1. Провери дали всички файлове са копирани
2. Провери дали Node.js е инсталиран
3. Провери дали .env.local е създаден
4. Провери дали npm install е изпълнен

### Полезни команди:
```powershell
# Проверка на файловете
Get-ChildItem

# Проверка на dependencies
npm list

# Проверка на Git статус
git status

# Проверка на environment variables
Get-Content .env.local
```

---

**Важно:** След копирането, винаги изпълни `npm install` за да инсталираш всички dependencies!
