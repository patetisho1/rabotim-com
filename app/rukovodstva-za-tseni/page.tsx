import Link from 'next/link';

const priceGuides = [
  {
    title: 'Домашни ремонти и монтажи',
    description:
      'Средни цени и времеви рамки за услуги като монтаж на мебели, електрически и водопроводни ремонти.',
  },
  {
    title: 'Почистване и домашна помощ',
    description:
      'Проучете почасови ставки и пакетни услуги за стандартно почистване, дълбоко почистване и специализирани задачи.',
  },
  {
    title: 'Доставка, куриерство и логистика',
    description:
      'Открийте ориентировъчни тарифи за еднократни доставки, регулярни маршрути и услуги на дълги разстояния.',
  },
  {
    title: 'Градинарство и поддръжка на двор',
    description:
      'Как се формират цените за косене, оформяне на зелени площи, озеленяване и сезонни дейности.',
  },
];

const checklistItems = [
  'Препоръчани диапазони за цена по категория – добавете реални стойности, когато са налични.',
  'Фактори, които влияят върху цената: трудност, материали, местоположение, спешност.',
  'Съвети към клиентите: как да сравнят оферти и калкулират бюджета си.',
  'Съвети към специалистите: как да позиционират услугите си и да обосноват стойността.',
  'Линкове към полезни инструменти – калкулатори, шаблони за оферти, статии.',
];

const resourceSections = [
  {
    heading: 'Как да поддържате актуални цени',
    body: 'Предложете методика за събиране на данни – анкети, анализ на успешни задачи, история на плащанията. Добавете инструкции за ежегодно обновяване.',
  },
  {
    heading: 'Регионални разлики',
    body: 'Създайте таблици по градове или области. Можете да добавите филтри и карти, когато интеграцията с реални данни е готова.',
  },
  {
    heading: 'Оптимизация на оферти',
    body: 'Включете примери за пакетни цени, добавена стойност (материали, гаранция, follow-up посещения) и техники за upsell.',
  },
];

export default function PriceGuidesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium uppercase tracking-wide text-blue-100">
                Ръководства за цени
              </span>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                Създайте своя библиотека с ценови ръководства и съвети за клиенти и изпълнители.
              </h1>
              <p className="text-lg text-blue-50 sm:text-xl">
                Използвайте тази страница като шаблон: добавете реални диапазони, инфографики, pdf файлове и
                всички ресурси, които помагат на потребителите да вземат информирани решения.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/tasks"
                  className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
                >
                  Разгледайте задачи
                </Link>
                <Link
                  href="/contact"
                  className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Свържете се за партньорство
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {priceGuides.map((guide) => (
                <div key={guide.title} className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
                  <h2 className="text-xl font-semibold text-white">{guide.title}</h2>
                  <p className="mt-2 text-sm text-blue-100">{guide.description}</p>
                  <div className="mt-4 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-xs text-blue-100">
                    Тук можете да добавите кратък pdf, таблица или връзка към детайлно ръководство.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-blue-900 sm:text-3xl">
              Структура за вашите ръководства
            </h2>
            <p className="text-base text-slate-600 sm:text-lg">
              Поддържайте страницата динамична – когато съберете реални данни, заменете примерните описания със
              статистика, графики и автоматични препоръки.
            </p>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-900">Чеклист за съдържание:</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {checklistItems.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            {resourceSections.map((resource) => (
              <div key={resource.heading} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-blue-900">{resource.heading}</h3>
                <p className="mt-2 text-sm text-slate-600">{resource.body}</p>
              </div>
            ))}
            <div className="rounded-xl border border-dashed border-blue-300 bg-blue-50/70 p-6 text-sm text-blue-900">
              Този блок може да се замени с интерактивна таблица, филтри по локация или формуляр за изтегляне на
              пълни ръководства, когато са готови.
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-b from-blue-900 to-blue-700 px-6 py-12 text-center text-white shadow-lg">
          <h2 className="text-2xl font-semibold sm:text-3xl">Готови ли сте да споделите своите ценови прозрения?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-blue-100 sm:text-base">
            Попълнете страницата с вашите ресурси или ни потърсете за консултация как да изградим автоматизирани
            ръководства за ценообразуване директно в Rabotim.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/post-task"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
            >
              Публикувайте задача
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Заявете демонстрация
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

