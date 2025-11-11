import Link from 'next/link';

const supportTopics = [
  { label: 'Разбиране на Rabotim', href: '/faq-novi-potrebiteli' },
  { label: 'Управление на акаунт', href: '#' },
  { label: 'Плащания и възстановявания', href: '#' },
  { label: 'Управление на задачи', href: '#' },
  { label: 'Съвети за клиенти', href: '#' },
  { label: 'Доверие и безопасност', href: '#' },
  { label: 'Ръководства и политики', href: '/rukovodstva-za-tseni' },
];

const recentArticles = [
  {
    title: 'Проверка на акаунт',
    subtitle: 'Как да потвърдите самоличността си',
    createdAt: 'преди 8 часа',
  },
  {
    title: 'Партньорства',
    subtitle: 'Instagram Giveaway – Условия (пример)',
    createdAt: 'преди 3 дни',
  },
  {
    title: 'Подаръчни карти',
    subtitle: 'Има ли лимит за закупуване?',
    createdAt: 'преди 1 седмица',
  },
  {
    title: 'Плащания',
    subtitle: 'Как работи защитата на плащанията',
    createdAt: 'преди 2 седмици',
  },
];

export default function SupportCenterPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-700 text-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="space-y-8 text-center">
            <h1 className="text-3xl font-semibold sm:text-4xl">Център за поддръжка на Rabotim</h1>
            <p className="mx-auto max-w-3xl text-sm text-blue-100 sm:text-base">
              Тази страница е шаблон, вдъхновен от Airtasker Help. Заменете примерните категории и статии с реалните
              ресурси от вашата база знания или help desk, когато бъдат готови.
            </p>
            <div className="mx-auto flex max-w-2xl items-center rounded-full border border-white/30 bg-white/10 p-2 shadow-lg backdrop-blur">
              <input
                type="text"
                placeholder="Задайте въпрос или ключова дума..."
                className="flex-1 rounded-full bg-transparent px-4 py-2 text-sm text-white placeholder:text-blue-100 focus:outline-none"
              />
              <button className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-800 transition hover:bg-blue-50">
                Търсене
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {supportTopics.map((topic) => (
            <Link
              key={topic.label}
              href={topic.href}
              className="rounded-xl border border-blue-200 px-5 py-4 text-center text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50"
            >
              {topic.label}
            </Link>
          ))}
          <Link
            href="#"
            className="sm:col-span-2 rounded-xl border border-blue-200 px-5 py-4 text-center text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50"
          >
            Насоки и документация
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Последни актуализации</h2>
          <p className="mt-2 text-sm text-slate-600">
            Свържете тази секция с help desk API, за да показвате последните статии, промени в политики и пускания на нови функции.
          </p>
          <div className="mt-6 space-y-4">
            {recentArticles.map((article) => (
              <div
                key={article.title}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-blue-300 hover:bg-blue-50"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-blue-800">{article.title}</h3>
                    <p className="text-xs text-slate-600">{article.subtitle}</p>
                  </div>
                  <span className="text-xs font-medium text-slate-500">{article.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="#" className="text-sm font-semibold text-blue-700 transition hover:text-blue-900">
              Вижте още статии
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Имате нужда от допълнителна помощ?</h2>
          <p className="mt-2 text-sm text-slate-600">
            Добавете контактна форма, чат на живо или телефон. Може да интегрирате бутон за заявка на поддръжка, връзка към
            Discord/Slack общност или график за уебинари.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
            <Link
              href="/contact"
              className="rounded-lg bg-blue-900 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-blue-800"
            >
              Свържете се с нас
            </Link>
            <Link
              href="/faq-novi-potrebiteli"
              className="rounded-lg border border-blue-200 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-blue-700 transition hover:border-blue-400 hover:bg-blue-50"
            >
              ЧЗВ за нови потребители
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

