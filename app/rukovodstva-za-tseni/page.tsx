import Link from 'next/link';

type Guide = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

const categories: Guide[] = [
  {
    title: 'Бизнес и администрация',
    links: [
      { label: 'Финансов консултант – ориентировъчни цени', href: '#' },
      { label: 'Виртуален асистент – почасови ставки', href: '#' },
    ],
  },
  {
    title: 'Домашни ремонти и монтажи',
    links: [
      { label: 'Монтаж на мебели – примерни пакети', href: '#' },
      { label: 'Електрически ремонт – ориентировъчни цени', href: '#' },
      { label: 'ВиК услуги – сравнение на тарифи', href: '#' },
    ],
  },
  {
    title: 'Почистване и помощ у дома',
    links: [
      { label: 'Стандартно почистване – месечен абонамент', href: '#' },
      { label: 'Дълбоко почистване – ориентировъчни пакети', href: '#' },
    ],
  },
  {
    title: 'Градинарство и открити площи',
    links: [
      { label: 'Поддръжка на двор – сезонни тарифи', href: '#' },
      { label: 'Озеленяване – примерни диапазони', href: '#' },
    ],
  },
  {
    title: 'Доставка и логистика',
    links: [
      { label: 'Еднократни доставки – очаквани цени', href: '#' },
      { label: 'Регулярни маршрути – оферти и пакетиране', href: '#' },
    ],
  },
  {
    title: 'IT и дигитални услуги',
    links: [
      { label: 'Уеб разработка – основни ставки', href: '#' },
      { label: 'Графичен дизайн – ориентировъчен бюджет', href: '#' },
    ],
  },
];

const sidebarCategories = [
  'Бизнес услуги',
  'Домашни ремонти',
  'Почистване',
  'Преместване',
  'Градинарство',
  'IT & дигитални',
  'Доставка',
  'Авто услуги',
  'Здраве и красота',
  'Събития',
  'Обучение и уроци',
];

export default function PriceGuidesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-[220px,1fr]">
            <aside className="hidden lg:block">
              <nav className="sticky top-28">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Категории
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {sidebarCategories.map((item) => (
                    <li key={item}>
                      <button className="rounded-md px-2 py-1 text-left transition hover:bg-blue-50 hover:text-blue-700">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <div className="space-y-12">
              <header className="space-y-4">
                <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  Ръководства за цени
                </span>
                <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
                  Библиотека с ориентировъчни цени за популярни услуги
                </h1>
                <p className="max-w-3xl text-base text-slate-600 sm:text-lg">
                  Намерете примерни диапазони за домашни ремонти, маркетинг, почистване, градинарство, логистика и
                  още. Когато сте готови, свържете секциите със свои статии, PDF ръководства или калкулатори.
                </p>
              </header>

              <div className="space-y-14">
                {categories.map((category) => (
                  <section key={category.title} className="space-y-4">
                    <h2 className="text-2xl font-semibold text-slate-900">{category.title}</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {category.links.map((link) => (
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
                  Как да развиете секцията с реални данни
                </h3>
                <p className="mt-3 text-sm text-blue-900">
                  Заменете бутоните с истински връзки, добавете филтри по локация, включете таблици с минимална и
                  максимална цена, отчети за сезонност или вграден калкулатор. Този блок може да съдържа и форма
                  за заявка на индивидуално ценово проучване.
                </p>
              </section>

              <section className="rounded-3xl bg-gradient-to-br from-blue-900 to-indigo-700 px-6 py-10 text-white">
                <div className="space-y-4 text-center sm:text-left">
                  <h3 className="text-2xl font-semibold sm:text-3xl">
                    Нуждаете се от съдействие при изграждането на ръководствата?
                  </h3>
                  <p className="text-sm text-blue-100 sm:text-base">
                    Свържете се с нашия екип за съдържание, за да изградим автоматизирани таблици, API интеграции и
                    визуализации на ценови данни директно в Rabotim.
                  </p>
                  <div className="flex flex-wrap gap-4 sm:justify-start">
                    <Link
                      href="/contact"
                      className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
                    >
                      Свържете се с нас
                    </Link>
                    <Link
                      href="/post-task"
                      className="rounded-lg border border-white/60 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Публикувайте задача
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

