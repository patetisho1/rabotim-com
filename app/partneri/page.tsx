import Link from 'next/link';

const partnerBenefits = [
  {
    title: 'Фирмен профил и продукти',
    description:
      'Създайте фирмен акаунт с витрина за продуктите и услугите си. Добавете описания, цени, наличности и галерии, видими за целия Rabotim пазар.',
  },
  {
    title: 'Отстъпки и промо кодове',
    description:
      'Предлагайте специални условия за нашите потребители – работници и бизнес клиенти. Управлявайте кампании и следете ефективността им.',
  },
  {
    title: 'Афилиейт и комисионни',
    description:
      'Свържете афилиейт линкове и дефинирайте процент от продажбите. Rabotim автоматично проследява генерирания оборот и комисионните.',
  },
  {
    title: 'Банери и рекламен инвентар',
    description:
      'Резервирайте банер позиции по тематични страници – задачи, категории, профили. Покажете сезонни оферти или нови продукти на точната аудитория.',
  },
];

const partnerTiers = [
  {
    name: 'Marketplace Partner',
    description: 'Базов профил с витрина и листинг на до 20 продукта. Подходящ за специализирани магазини и локални бизнеси.',
    perks: ['Фирмен профил', 'Каталог продукти', 'Стандартни афилиейт линкове'],
  },
  {
    name: 'Premium Partner',
    description:
      'Разширени възможности за кампании, допълнителни банер позиции и приоритетни промоции в каталога на Rabotim.',
    perks: ['Неограничени продукти', 'Динамични промо кодове', 'Банери на тематични страници', 'Месечни отчети'],
  },
  {
    name: 'Enterprise & Franchise',
    description:
      'За национални вериги и франчайз организации. Интеграция чрез API, индивидуални условия и акаунт мениджър.',
    perks: ['API интеграция', 'Сегментирани банери', 'Персонализирани landing страници', 'Договорени комисионни'],
  },
];

const sampleProducts = [
  {
    brand: 'FixMaster Tools',
    product: 'Набор инструменти за монтаж',
    discount: '10% за Rabotim Taskers',
  },
  {
    brand: 'CleanPro Supplies',
    product: 'Професионални препарати за почистване',
    discount: 'Афилиейт линк с 5% комисионна',
  },
  {
    brand: 'Greener Garden',
    product: 'Комплект за озеленяване и поддръжка',
    discount: 'Промо пакет -15% за първа поръчка',
  },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="space-y-8">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
              Партньорска програма
            </span>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Свържете своя бизнес с Rabotim и достигнете до активна общност от професионалисти и клиенти.
            </h1>
            <p className="max-w-3xl text-lg text-blue-50 sm:text-xl">
              Партньорите получават фирмени профили, управление на продукти, банер позиции и афилиейт механизми.
              Страницата е подготвена като шаблон – добавете реалното съдържание, условия и контактна форма, когато сте готови.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
              >
                Заявете партньорство
              </Link>
              <Link
                href="/companies"
                className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Разгледайте фирмени профили
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-6 py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {partnerBenefits.map((benefit) => (
            <div key={benefit.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-blue-900">{benefit.title}</h2>
              <p className="mt-3 text-sm text-slate-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-blue-200 bg-blue-50/60 p-6 md:p-10">
          <h3 className="text-xl font-semibold text-blue-900 sm:text-2xl">Симулация на партньорска витрина</h3>
          <p className="mt-3 max-w-3xl text-sm text-blue-900">
            Покажете как ще изглеждат фирмените продукти и оферти. Тук можете да вградите реални листинги с рейтинги,
            наличности и бутони за закупуване или заявка. Всеки продукт може да носи отделен афилиейт линк.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {sampleProducts.map((item) => (
              <div key={item.brand} className="rounded-2xl bg-white p-5 shadow">
                <p className="text-xs uppercase tracking-wide text-slate-500">{item.brand}</p>
                <h4 className="mt-2 text-base font-semibold text-blue-900">{item.product}</h4>
                <p className="mt-3 text-sm text-blue-700">{item.discount}</p>
                <button className="mt-4 w-full rounded-lg border border-blue-200 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50">
                  Преглед на продукта
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl space-y-10 px-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-blue-900 sm:text-3xl">Партньорски нива</h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Опишете конкретните планове, ценообразуване и условия. Секцията може да се замени с таблица или калкулатор за ROI.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {partnerTiers.map((tier) => (
              <div key={tier.name} className="flex flex-col rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-blue-900">{tier.name}</h3>
                <p className="mt-3 text-sm text-slate-600">{tier.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {tier.perks.map((perk) => (
                    <li key={perk}>• {perk}</li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link
                    href="/contact"
                    className="inline-flex w-full justify-center rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                  >
                    Запитване
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 py-16 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 lg:flex-row lg:items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold sm:text-3xl">Рекламни банери & афилиейт интеграция</h2>
            <p className="text-sm text-white/85 sm:text-base">
              Предлагаме банери на ключови страници (начало, задачи, профили) и персонализирани афилиейт линкове.
              Можете да зададете комисионни, да проследявате генерирани продажби и да получавате ежемесечни отчети.
            </p>
            <p className="text-sm text-white/85 sm:text-base">
              Добавете тук реални спецификации: размери на банерите, CPM/CPC/CPS модели, както и API документация за афилиейт партньори.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
              >
                Свържете се с екипа ни
              </Link>
              <Link
                href="/premium"
                className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Вижте премиум възможности
              </Link>
            </div>
          </div>

          <div className="grid flex-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/80">Банери</h3>
              <p className="mt-3 text-sm text-white/85">
                Резервирайте позиции по категории, задачи и тематични кампании. Опишете тук какви размери и формати поддържате.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/80">Афилиейт</h3>
              <p className="mt-3 text-sm text-white/85">
                Задайте проценти на комисионни, следете линковете и интегрирайте webhook или API за потвърждение на продажби.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/80">Отчети</h3>
              <p className="mt-3 text-sm text-white/85">
                Демонстрирайте табла с KPI – показвайте CTR, конверсии и средна комисионна. Тук може да вградите графики и PDF отчети.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/80">Поддръжка</h3>
              <p className="mt-3 text-sm text-white/85">
                Представете екипа си за партньори, SLA условия и как се случва онбордингът. Включете контакти и линк към база знания.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

