# Rabotim.com - Roadmap & Tasks

## 🎯 Core Концепция

### Основни принципи
1. ✅ Всеки може да публикува обяви (фирми и частни лица)
2. ✅ Всеки може да кандидатства (фирми и частни лица)
3. ✅ Обявите са безплатни (с платени опции: VIP, TOP, Спешно)
4. ⚠️ **Rabotim.com НЕ е посредник** - не взема комисионна
5. ⚠️ **Без оферти с цени** - само кандидатстване + кратък коментар (до 50 символа)
6. ✅ Работодателят избира кандидат → обявата се затваря
7. ✅ След завършване → двустранна верификация и рейтинг
8. ✅ Review system с mutual consent (7 дни автоматично одобрение)

### Бизнес модел
- **Приходи от:**
  - Премиум профили (професионалисти и фирми)
  - Платени промоции на обяви (VIP, TOP, Спешно)
  - Banner ads (счетоводители, други услуги)
- **НЕ:** Комисионни от транзакции

---

## 🎯 ЕТАП 1: MVP & Core Functionality (Безплатна платформа)

**Цел:** Да заработи платформата с базови функции и да се популяризира

### 1.1 Основни профили (Безплатни)
- [ ] User registration & login
- [ ] Basic профил с информация:
  - [ ] Име, снимка, локация
  - [ ] Кратко описание
  - [ ] Телефон (скрит до кандидатстване)
  - [ ] Email (скрит)
- [ ] Публикуване на обяви (неограничено)
- [ ] Кандидатстване за обяви
- [ ] Система за рейтинг и отзиви
- [ ] История на обяви и кандидатури

### 1.2 Борд с обяви
- [ ] Публикуване на задачи/обяви
- [ ] Преглед на обяви с филтри:
  - [ ] Категория
  - [ ] Локация (град, квартал)
  - [ ] Ценови диапазон
  - [ ] Спешност
- [ ] Детайлна страница на обява
- [ ] Система за кандидатстване
- [ ] Получаване на оферти от кандидати

### 1.3 Рейтинг & Отзиви система
- [ ] 5-звезден рейтинг
- [ ] Текстови отзиви
- [ ] Отзиви и за работодатели, и за изпълнители
- [ ] Верификация на отзиви (само след завършена работа)
- [ ] Показване на среден рейтинг в профила
- [ ] Top rated badges

### 1.4 UI/UX & Mobile Design

#### Мобилна версия - Секция обяви
- [ ] Мобилни обяви в 2-колонна структура (като в image)
- [ ] Всеки ad блок да съдържа:
  - [ ] Изображение на услугата (top portion)
  - [ ] Заглавие/описание
  - [ ] Цена в лв (bold)
  - [ ] Локация (град)
  - [ ] Дата/час на публикуване
  - [ ] Heart icon за любими
- [ ] Layout да запълва цялата ширина на телефона
- [ ] Лесно скролиране и познат интерфейс
- [ ] Responsive design за всички размери екрани

### 1.5 Homepage ревюта секция
- [ ] Секция "Какво казват нашите потребители"
- [ ] Carousel/Grid с real testimonials
- [ ] Снимки на потребители
- [ ] Истории за успех:
  - "За няколко часа изкарах 150 лв"
  - "Намерих перфектния човек за почистване за 10 минути"
- [ ] CTA бутони "Публикувай обява" / "Започни да печелиш"

### 1.5 Популяризация & Marketing

#### SEO оптимизация
- [ ] Meta tags (title, description) за всяка страница
- [ ] Open Graph tags за social sharing
- [ ] Sitemap.xml генериране
- [ ] Robots.txt оптимизация
- [ ] Structured data (Schema.org)
- [ ] Alt tags на всички изображения
- [ ] URL structure оптимизация
- [ ] Page speed optimization
- [ ] Mobile-first design
- [ ] Internal linking strategy
- [ ] Blog за SEO content

#### Интеграция със социални мрежи
- [ ] Facebook login (вече готово)
- [ ] Google login
- [ ] Share бутони на обяви:
  - [ ] Facebook share
  - [ ] LinkedIn share
  - [ ] Twitter/X share
  - [ ] Viber share
  - [ ] WhatsApp share
  - [ ] Copy link
- [ ] Social media links в профили
- [ ] Auto-post на обяви в Facebook groups (опционално)
- [ ] Instagram integration (за визуални услуги)

#### Видео & Визуално съдържание
- [ ] Разяснително видео "Как работи Rabotim" (60-90 сек)
- [ ] Hero carousel на homepage с:
  - [ ] Welcome видео
  - [ ] Success stories
  - [ ] Platform benefits
- [ ] Tutorial видеа за:
  - [ ] Как да публикуваш обява
  - [ ] Как да кандидатстваш
  - [ ] Как работи review системата
- [ ] Video testimonials от потребители
- [ ] YouTube канал с tips & tricks

#### Други Marketing
- [ ] Referral program
- [ ] Email marketing кампании
- [ ] Blog със съвети
- [ ] Newsletter subscription
- [ ] Affiliate програма

---

## 💰 ЕТАП 2: Монетизация - Професионални профили

**Цел:** Въвеждане на платени услуги за професионалисти

### 2.1 Професионални профили - Структура

#### Basic (Безплатен)
- Всичко от Етап 1
- Ръчно кандидатстване
- Скрити контакти (до кандидатстване)
- НЕ се показва в каталога

#### Premium Professional (19 лв/месец)
- [ ] Листване в каталог `/professionals`
- [ ] Видими пълни контакти (телефон, email)
- [ ] WhatsApp, Viber, Calendar бутони
- [ ] До 3 категории услуги
- [ ] "Premium" badge
- [ ] Featured в search results
- [ ] 3 VIP обяви на месец included
- [ ] Auto-match нотификации за нови обяви

#### Premium+ Professional (39 лв/месец)
- Всичко от Premium +
- [ ] До 5 категории
- [ ] Автоматично кандидатстване по критерии
- [ ] 5 VIP + 2 TOP обяви на месец
- [ ] Priority support
- [ ] Analytics dashboard
- [ ] Portfolio секция (неограничени снимки)

### 2.2 Каталог на Професионалисти `/professionals`
- [ ] Grid view с Professional cards
- [ ] Филтри:
  - [ ] Категория (до 3 категории на профил)
  - [ ] Локация (град, квартал, radius)
  - [ ] Рейтинг (⭐ 4+, 4.5+, 5)
  - [ ] Цена (hourly rate range)
  - [ ] "Налични сега"
- [ ] Sorting:
  - [ ] По рейтинг (default)
  - [ ] По близост
  - [ ] По брой работи
  - [ ] Най-нови
- [ ] Featured section (топ 6 платени)
- [ ] "Свържи се директно" функция

### 2.3 Категории система (до 3 за Premium)
- [ ] База данни за професионални категории
- [ ] Избор на 3 категории при upgrade
- [ ] Смяна на категории безплатно
- [ ] +10 лв/месец за всяка следваща категория
- [ ] Показване в multiple категории увеличава visibility

### 2.4 Auto-Apply & Smart Matching
- [ ] Settings за auto-apply критерии:
  - [ ] Категории
  - [ ] Локации (radius)
  - [ ] Ценови диапазон
  - [ ] Keywords
- [ ] Автоматично кандидатстване при match
- [ ] Notification при auto-apply
- [ ] Email digest с подходящи обяви

### 2.5 Платени обяви (À la carte)
- [ ] **VIP обява** (5 лв) - жълт фон, горе в списъка
- [ ] **TOP обява** (10 лв) - на върха 7 дни
- [ ] **Спешна** (3 лв) - червен badge, filter "спешни"
- [ ] Комбо пакети (VIP+TOP+Спешна = 15 лв)

### 2.6 Плащания & Абонаменти
- [ ] Stripe integration
- [ ] ePay.bg integration (за България)
- [ ] PayPal
- [ ] Месечни абонаменти с auto-renewal
- [ ] Годишни планове (-20% отстъпка)
- [ ] Invoice generation
- [ ] Subscription management dashboard
- [ ] Downgrade/upgrade options

---

## 🏢 ЕТАП 3: Корпоративни профили и фирми

**Цел:** Масово навлизане на фирми, jobs.bg модел

### 3.1 Фирмени профили - Базов (Безплатен)

**Цел:** Привличане на 1000+ фирми безплатно

- [ ] Отделен регистрационен flow за фирми
- [ ] Company profile:
  - [ ] Лого
  - [ ] Фирмено име
  - [ ] Описание
  - [ ] Локация/и (multiple офиси)
  - [ ] Индустрия
  - [ ] Размер (брой служители)
  - [ ] Website link
- [ ] **До 3 активни обяви едновременно**
- [ ] Получаване на кандидатури
- [ ] Рейтинг като работодател
- [ ] НЕ се показва в специален каталог (само обявите им)

### 3.2 Фирмени профили - Pro Plan (49 лв/месец)
- Всичко от Basic +
- [ ] **Неограничени обяви**
- [ ] Резервационен календар
- [ ] Разширен профил:
  - [ ] Галерия със снимки
  - [ ] Видеа
  - [ ] Социални мрежи
  - [ ] Team members
- [ ] "Бизнес" badge
- [ ] Приоритетно показване
- [ ] CRM light - история на кандидати
- [ ] Отчети за активност
- [ ] Google Calendar sync
- [ ] 5 VIP обяви included

### 3.3 Фирмени профили - Premium Plan (99 лв/месец)
- Всичко от Pro +
- [ ] Автоматично кандидатстване (търсене на таланти)
- [ ] Team management (множество акаунти)
- [ ] VIP/TOP/Спешно етикети - 10 на месец
- [ ] Разширени analytics:
  - [ ] Conversion rates
  - [ ] Конкуренция по региони
  - [ ] Demographics на кандидати
- [ ] Издаване на оферти/договори
- [ ] Automatic invoicing
- [ ] Dedicated account manager
- [ ] Custom branding на профила:
  - [ ] Custom background
  - [ ] Color scheme
  - [ ] Custom page layout

### 3.4 Каталог на фирми `/companies`
- [ ] Grid с company cards
- [ ] Филтри:
  - [ ] Индустрия
  - [ ] Локация
  - [ ] Размер
  - [ ] Рейтинг
- [ ] Company detail page
- [ ] Активни обяви на фирмата
- [ ] Отзиви за фирмата като работодател
- [ ] "Последвай фирмата" функция

### 3.5 Outreach към фирми (Marketing)
- [ ] Scrape 1000+ фирми от jobs.bg
- [ ] Email templates за outreach
- [ ] Free trial offer (3 месеца безплатно Pro)
- [ ] Partnership програма
- [ ] Bulk import на обяви
- [ ] Onboarding помощ

---

## 🔒 Сигурност & Privacy

### Security
- [ ] Криптиране на пароли (bcrypt/argon2)
- [ ] HTTPS навсякъде
- [ ] Rate limiting на API endpoints
- [ ] CSRF protection
- [ ] XSS protection
- [ ] SQL injection prevention
- [ ] 2FA опция (optional)
- [ ] Session management
- [ ] Secure password reset flow

### Privacy & GDPR
- [ ] Privacy policy страница
- [ ] Terms of service
- [ ] Cookie consent banner
- [ ] Data export функция (GDPR)
- [ ] Account deletion опция
- [ ] Email preferences management

---

## 🔍 SEO & Marketing

### SEO Optimization
- [ ] Meta tags оптимизация (title, description)
- [ ] Open Graph tags за social sharing
- [ ] Structured data (Schema.org markup)
- [ ] XML sitemap генериране
- [ ] Robots.txt конфигурация
- [ ] Canonical URLs
- [ ] Image alt tags
- [ ] Page speed optimization
- [ ] Mobile-first responsive design
- [ ] Internal linking strategy
- [ ] URL structure optimization
- [ ] 404 страница с suggestions
- [ ] Breadcrumbs navigation

### Content Marketing
- [ ] Blog система
- [ ] SEO-friendly URL slugs
- [ ] Category landing pages
- [ ] Location-based pages (София, Пловдив, и т.н.)
- [ ] FAQ страница
- [ ] "Как работи" guides
- [ ] Success stories страница

### Analytics & Tracking
- [ ] Google Analytics integration
- [ ] Google Search Console setup
- [ ] Conversion tracking
- [ ] A/B testing setup
- [ ] Heatmaps (Hotjar/Clarity)
- [ ] Event tracking (button clicks, form submissions)

---

## 🔧 Технически задачи

### Database Schema Updates
- [ ] `user_role` enum: `client`, `professional`, `company`
- [ ] `subscription_type` enum: `free`, `premium_professional`, `premium_plus`, `pro_company`, `premium_company`
- [ ] `subscription_expires_at` datetime
- [ ] `professional_categories` (many-to-many) - до 3/5 категории
- [ ] `auto_apply_settings` JSON
- [ ] `company_info` table (separate from profiles)
- [ ] `featured_listings` table (платени промоции)
- [ ] `payment_history` table

### API Routes
- [ ] `/api/professionals` - List professionals
- [ ] `/api/companies` - List companies
- [ ] `/api/subscriptions` - Manage subscriptions
- [ ] `/api/payments` - Handle payments
- [ ] `/api/auto-apply` - Auto-apply logic
- [ ] `/api/analytics` - Stats for premium users

### UI Components
- [ ] ProfessionalCard component
- [ ] CompanyCard component
- [ ] SubscriptionModal component
- [ ] PricingTable component
- [ ] UpgradePrompts component
- [ ] PaymentForm component
- [ ] AnalyticsDashboard component

---

## 📊 Pricing Summary

### За Професионалисти
| Plan | Цена | Features |
|------|------|----------|
| **Free** | 0 лв | Basic профил, ръчно кандидатстване, скрити контакти |
| **Premium** | 19 лв/мес | Каталог, видими контакти, 3 категории, 3 VIP обяви |
| **Premium+** | 39 лв/мес | 5 категории, auto-apply, 5 VIP + 2 TOP обяви, analytics |

### За Фирми
| Plan | Цена | Features |
|------|------|----------|
| **Basic** | 0 лв | До 3 обяви, базов профил |
| **Pro** | 49 лв/мес | Неограничени обяви, календар, CRM, 5 VIP обяви |
| **Premium** | 99 лв/мес | Auto-hiring, team, analytics, custom branding, 10 промоции |

### À la carte услуги
- **VIP обява**: 5 лв (жълт фон, по-високо)
- **TOP обява**: 10 лв (на върха 7 дни)
- **Спешна**: 3 лв (червен badge)
- **Допълнителна категория**: +10 лв/месец

---

## 🎨 UX/UI Upgrade Tasks

### Homepage
- [ ] Hero секция с testimonials carousel
- [ ] Trust indicators (брой обяви, потребители, успешни работи)
- [ ] Featured professionals preview
- [ ] CTA за "Стани професионалист"

### Upgrade Prompts (Ненатрапчиви)
- [ ] Максимум веднъж на 24 часа
- [ ] "X" бутон за затваряне
- [ ] Ясна стойност: "3x повече оферти като премиум"
- [ ] A/B testing на съобщения

### Тригъри за промптове
1. След гледане на премиум профил
2. След 24 часа без оферти на обява
3. След X посещения без контакт
4. При първи login
5. След 5 успешни работи (time to upgrade!)

---

## ✅ Завършени задачи

- ✅ Initial setup
- ✅ TypeScript errors fixed
- ✅ Supabase fallback implementation
- ✅ Successful staging deployment
- ✅ Facebook OAuth documentation

---

## 📝 Бележки

### Ключови метрики за следене
- Брой регистрирани потребители
- Conversion rate Free → Premium
- Average time to first job
- Retention rate (месечна)
- Churn rate на абонаменти
- Revenue per user (ARPU)

### Приоритети
1. **Етап 1** → Launch ASAP, gather users
2. **Етап 2** → Start monetization след 500+ active users
3. **Етап 3** → Scale with companies след 2000+ users

