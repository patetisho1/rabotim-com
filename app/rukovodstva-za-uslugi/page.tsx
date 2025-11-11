import Link from 'next/link';

type GuideSection = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

const sidebarTopics = [
  'Подготовка на обявата',
  'Комуникация с клиенти',
  'Управление на график',
  'Оферти и ценообразуване',
  'Безопасност и гаранции',
  'Професионално развитие',
  'Инструменти и ресурси',
];

const guideSections: GuideSection[] = [
  {
    title: 'Публикуване на качествена обява',
    links: [
      { label: 'Структура на ефективно описание', href: '#' },
      { label: 'Как да добавите медиa и примери', href: '#' },
      { label: 'Контролен списък преди публикуване', href: '#' },
    ],
  },
  {
    title: 'Комуникация и управление на очакванията',
    links: [
      { label: 'Съвети за първи контакт с клиента', href: '#' },
      { label: 'Как да задавате допълнителни въпроси', href: '#' },
      { label: 'Шаблони за отговори и потвърждения', href: '#' },
    ],
  },
  {
    title: 'Превръщане на услуги в пакети',
    links: [
      { label: 'Създаване на пакетни предложения', href: '#' },
      { label: 'Управление на допълнителни услуги (upsell)', href: '#' },
      { label: 'Примерни шаблони за пакетни таблици', href: '#' },
    ],
  },
  {
    title: 'Гарантирано качество и безопасност',
    links: [
      { label: 'Политики за гаранция и повторни посещения', href: '#' },
      { label: 'Съвети за безопасност при посещения на адрес', href: '#' },
      { label: 'Как да събирате обратна връзка и ревюта', href: '#' },
    ],
  },
  {
    title: 'Развитие на професионалния профил',
    links: [
      { label: 'Оптимизиране на профила и портфолиото', href: '#' },
      { label: 'Участие в партньорски програми и отстъпки', href: '/partneri' },
      { label: 'Обучения и сертификации', href: '#' },
    ],
  },
];

const proTips = [
  {
    heading: 'Структура на обявата',
    body: 'Започнете с ясна стойност за клиента, изброете конкретни дейности, уточнете времеви рамки и необходими материали. Можете да добавите примерни шаблони или PDF с чеклист.',
  },
  {
    heading: 'Най-чести грешки',
    body: 'Липса на конкретика, пропуск на условия и отговорности, неясни цени. Създайте раздел с „избягвайте това“ и подгответе препоръчани практики.',
  },
  {
    heading: 'Инструменти и приложения',
    body: 'Предложете CRM, календар, софтуер за фактуриране или управление на екип. Можете да включите афилиейт линкове или партньорски промо кодове.',
  },
];

export default function ServiceGuidesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-[220px,1fr]">
            <aside className="hidden lg:block">
              <nav className="sticky top-28">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Теми
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {sidebarTopics.map((topic) => (
                    <li key={topic}>
                      <button className="w-full rounded-md px-2 py-1 text-left transition hover:bg-blue-50 hover:text-blue-700">
                        {topic}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <div className="space-y-12">
              <header className="space-y-4">
                <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  Ръководства за услуги
                </span>
                <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
                  Библиотека с ресурси за професионалисти в Rabotim
                </h1>
                <p className="max-w-3xl text-base text-slate-600 sm:text-lg">
                  Страница-шаблон по модела на Airtasker. Добавете собствени статии, видеа и PDF материали, които
                  помагат на Tasker-ите да представят услугите си, да комуникират с клиенти и да развиват бизнеса си.
                </p>
              </header>

              <div className="space-y-14">
                {guideSections.map((section) => (
                  <section key={section.title} className="space-y-4">
                    <h2 className="text-2xl font-semibold text-slate-900">{section.title}</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {section.links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-900"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <section className="rounded-2xl border border-dashed border-blue-300 bg-blue-50/70 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-blue-900">
                  Създайте централизирана база знания
                </h3>
                <p className="mt-3 text-sm text-blue-900">
                  Заменете тази секция с live search, интеграция към help desk или CMS. Можете да добавите филтри по
                  категория, резюме на най-популярните статии и CTA към уебинари за нови Tasker-и.
                </p>
              </section>

              <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">Професионални съвети</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {proTips.map((tip) => (
                    <div key={tip.heading} className="rounded-xl bg-slate-50 p-5">
                      <h4 className="text-base font-semibold text-blue-900">{tip.heading}</h4>
                      <p className="mt-2 text-sm text-slate-600">{tip.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl bg-gradient-to-br from-blue-900 to-indigo-700 px-6 py-10 text-white">
                <div className="space-y-4 text-center sm:text-left">
                  <h3 className="text-2xl font-semibold sm:text-3xl">Готови ли сте да развиете услугата си?</h3>
                  <p className="text-sm text-blue-100 sm:text-base">
                    Добавете линкове към обучения, програми за сертификация и партньорски оферти. Този блок може да съдържа
                    форма за заявка на индивидуална консултация или бонуси за нови Tasker-и.
                  </p>
                  <div className="flex flex-wrap gap-4 sm:justify-start">
                    <Link
                      href="/pechelete-pari"
                      className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
                    >
                      Вижте как да печелите
                    </Link>
                    <Link
                      href="/support-center"
                      className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Център за поддръжка
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

