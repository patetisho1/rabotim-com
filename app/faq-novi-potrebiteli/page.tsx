import Link from 'next/link';

const faqs = [
  {
    question: 'Как работи Rabotim и как да започна?',
    answer:
      'Създайте профил, завършете верификацията и добавете уменията си. Работниците могат да кандидатстват по задачи, а възложителите – да публикуват заявки. Тази страница е чернова: заменете текста със стъпките и линкове към реални ръководства и видеа.',
  },
  {
    question: 'Нужно ли е да плащам, за да използвам платформата?',
    answer:
      'Регистрацията е безплатна. Премиум функции и промо опции са по избор. Включете реалните си планове, когато са готови, и обяснете как работят комисионните/таксите.',
  },
  {
    question: 'Как се гарантира безопасността на плащанията?',
    answer:
      'Плащанията минават през интегрирана Stripe инфраструктура. Следете статуса им в профила си. Добавете реалните политики за защита, правила за спорове и линкове към условията.',
  },
  {
    question: 'Какви проверки минават Tasker-ите?',
    answer:
      'Описано е примерна процедура: верификация на телефон, документ, оценка от предишни задачи. Подменете със собствените си KYC изисквания и SLA, когато са финализирани.',
  },
  {
    question: 'Мога ли да управлявам фирмен акаунт?',
    answer:
      'Да, Rabotim предлага фирмени профили с каталози, промо кампании и достъп до партньорската програма. Поставете линкове към страниците „Партньори“ и „Rabotim за бизнес“.',
  },
];

const quickLinks = [
  { label: 'Първи стъпки', href: '/how-it-works' },
  { label: 'Публикувайте задача', href: '/post-task' },
  { label: 'Регистрирайте се като Tasker', href: '/register' },
  { label: 'Rabotim за бизнес', href: '/rabotim-za-biznes' },
  { label: 'Партньорска програма', href: '/partneri' },
  { label: 'Ценови ръководства', href: '/rukovodstva-za-tseni' },
];

const helpTopics = [
  {
    title: 'Акаунт и сигурност',
    description:
      'Опишете процесите за верификация, възстановяване на достъп, двуфакторна автентикация и защита на личните данни.',
  },
  {
    title: 'Плащания и такси',
    description:
      'Добавете информация за депозити, освобождаване на плащания, комисионни и срокове. Можете да включите FAQ за Stripe и фактуриране.',
  },
  {
    title: 'Публикуване на задачи',
    description:
      'Разяснете как се описва задача, как се избират кандидати и как работят срокове, файлове и статуси. Помислете за видеа или GIF инструкции.',
  },
  {
    title: 'Кандидатстване и рейтинги',
    description:
      'Опишете как Tasker-ите изпращат оферти, как се оценяват и как да поддържат висок рейтинг. Добавете линк към секцията с ревюта.',
  },
];

export default function NewUserFAQPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-[0.95fr,1.05fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                Често задавани въпроси
              </span>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                ЧЗВ за нови потребители на Rabotim
              </h1>
              <p className="text-base text-slate-600 sm:text-lg">
                Страницата служи като основа за центъра за поддръжка. Заменете примерните отговори със свои политики,
                добавете линкове към база знания, видеа и чат поддръжка.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-lg bg-blue-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Свържете се с поддръжката
                </Link>
                <Link
                  href="/social"
                  className="rounded-lg border border-blue-200 px-5 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50"
                >
                  Вижте общността
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-blue-900">Бързи линкове</h2>
              <p className="mt-2 text-sm text-blue-700">
                Използвайте секцията за най-често търсените ресурси. Можете да замените бутоните с live search или чат бот.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-900"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-6 py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {faqs.map((item) => (
            <div key={item.question} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-900">{item.question}</h3>
              <p className="mt-3 text-sm text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-blue-900 sm:text-2xl">Тематики за разширяване</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-600">
            Добавете реални статии, видео уроци и стъпка по стъпка ръководства. Секцията може да се превърне в интерактивно
            дърво: когато потребител избере тема, показвате конкретни статии от базата знания.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {helpTopics.map((topic) => (
              <div key={topic.title} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-blue-900">{topic.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-blue-900 to-blue-600 px-6 py-12 text-center text-white shadow-lg">
          <h2 className="text-2xl font-semibold sm:text-3xl">Не откривате това, което търсите?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-blue-100 sm:text-base">
            Включете чат на живо, тикет система или телефонна линия. Този блок може да съдържа и графици за уебинари за нови потребители.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
            >
              Изпратете запитване
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Как работи Rabotim
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

