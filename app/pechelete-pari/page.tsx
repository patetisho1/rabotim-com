import Link from 'next/link';

const earningSteps = [
  {
    title: 'Регистрирайте профил',
    description:
      'Създайте професионален профил, добавете уменията си и настройте предпочитаните категории задачи.',
    hint: 'Добавете препоръки, сертификати и портфолио – тук може да поставите линкове или форма.',
  },
  {
    title: 'Кандидатствайте и печелете',
    description:
      'Разглеждайте нови задачи, изпращайте предложения с цена и срокове, и разговаряйте с клиентите си директно.',
    hint: 'Тази секция може да се разшири с инсайти за успешни предложения или автоматични съвети.',
  },
  {
    title: 'Изпълнете задачата и вземете плащане',
    description:
      'След успешното изпълнение на задачата клиентът потвърждава и плащането се освобождава през Rabotim.',
    hint: 'Тук може да добавите подробности за Stripe плащания, гаранции и защита на средствата.',
  },
];

const earningHighlights = [
  {
    title: 'Достъп до нови клиенти',
    description:
      'Rabotim ви свързва с бизнеси и индивидуални клиенти в цяла България, които активно търсят специалисти.',
  },
  {
    title: 'Прозрачни условия',
    description:
      'Ясни цени, лесно проследяване на плащания и защита чрез рейтинговата система и прегледи.',
  },
  {
    title: 'Гъвкав график',
    description: 'Вие решавате кога и как да работите – идеално за фрийлансъри и втори доход.',
  },
];

export default function EarnMoneyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-medium uppercase tracking-wide text-white/90">
                Печелете пари
              </span>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                Превърнете уменията си в устойчив доход чрез Rabotim.
              </h1>
              <p className="text-lg text-white/90 sm:text-xl">
                Създайте профил, покажете експертизата си и кандидатствайте по задачи, които отговарят
                на вашите умения и график. Тази страница е стартова рамка – добавете собственото си
                съдържание, истории на успеха и линкове към ресурси.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  Създайте профил
                </Link>
                <Link
                  href="/tasks"
                  className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Вижте наличните задачи
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {earningHighlights.map((highlight) => (
                <div key={highlight.title} className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
                  <h2 className="text-xl font-semibold">{highlight.title}</h2>
                  <p className="mt-2 text-sm text-white/85">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              Как да започнете да печелите с Rabotim
            </h2>
            <p className="text-base text-slate-600 sm:text-lg">
              Използвайте секциите по-долу като чернова – можете да добавите видеа, чеклисти и ръководства
              за нови професионалисти. Поставете линкове към вътрешни ресурси, FAQ и политики.
            </p>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Идеи какво да включите:</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>• Видеоурок или инфографика за процеса на кандидатстване.</li>
                <li>• Съвети за печеливши оферти и комуникация с клиенти.</li>
                <li>• Информация за защита на плащанията и как работи рейтинговата система.</li>
                <li>• Линкове към обучителни ресурси, програми за обучение и общност.</li>
              </ul>
            </div>
          </div>

        <div className="space-y-6">
            {earningSteps.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-600">
                  {index + 1}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                <p className="mt-3 text-xs text-slate-500">{step.hint}</p>
              </div>
            ))}

            <div className="rounded-xl border border-dashed border-rose-300 bg-rose-50/70 p-6 text-sm text-rose-900">
              Тази секция може да се замени с таблица на тарифите, програма за лоялност или бутон към
              вашата обучителна академия.
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-b from-rose-600 to-rose-500 px-6 py-12 text-center text-white shadow-lg">
          <h2 className="text-2xl font-semibold sm:text-3xl">Първата ви задача е само на няколко клика</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
            Когато сте готови, допълнете страницата със своите истории и ресурси. Междувременно насочете
            професионалистите към регистрация и им дайте увереност да започнат.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
            >
              Регистрирайте се днес
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Научете как работи
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

