import Link from 'next/link';

const businessHighlights = [
  {
    title: 'Възложете задачи с увереност',
    description:
      'Достигнете до проверени професионалисти за всичко – от еднократни поръчки до дългосрочни партньорства.',
    badge: 'Отбор от професионалисти',
  },
  {
    title: 'Ускорете работния процес',
    description:
      'Публикувайте задания, управлявайте кандидатури и финализирайте плащания в една платформа.',
    badge: 'Цялостно управление',
  },
  {
    title: 'Изградете доверие с клиенти',
    description:
      'Споделяйте рейтингите на своя екип и показвайте история с успешно изпълнени задачи.',
    badge: 'Доказани резултати',
  },
];

const businessUseCases = [
  {
    title: 'Малки компании и стартъпи',
    description:
      'Създайте гъвкав “on-demand” екип за маркетинг, административни и оперативни дейности.',
  },
  {
    title: 'Агенции и студиа',
    description:
      'Намерете специалисти за пикова натовареност, специфични умения или регионално покритие.',
  },
  {
    title: 'Физически обекти и франчайз',
    description:
      'Поддръжка, ремонти, инсталации и локални кампании могат да се организират в няколко клика.',
  },
];

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium uppercase tracking-wide text-blue-100">
                Rabotim за бизнес
              </span>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                Създайте своя екип от експерти според нуждите на бизнеса.
              </h1>
              <p className="text-lg text-blue-50 sm:text-xl">
                Организации от всякакъв размер използват Rabotim, за да намират и управляват надеждни
                професионалисти, да следят задачите си и да завършват проектите си навреме.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/post-task"
                  className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
                >
                  Публикувайте бизнес задача
                </Link>
                <Link
                  href="/contact"
                  className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Свържете се с екипа ни
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {businessHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur"
                >
                  <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-wide text-blue-100">
                    {item.badge}
                  </span>
                  <h2 className="mt-3 text-xl font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm text-blue-100">{item.description}</p>
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
              Как Rabotim помага на вашия бизнес
            </h2>
            <p className="text-base text-slate-600 sm:text-lg">
              Тази страница е стартова рамка за вашето съдържание. Добавете кейсове, процеси, цени,
              екип и всичко останало, което би вдъхновило клиентите ви да използват Rabotim.
            </p>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-900">Какво можете да включите:</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>• Стъпки за бизнес клиенти – от регистрация до проследяване на изпълнението.</li>
                <li>• Кейсове от реални партньорства и постигнати резултати.</li>
                <li>• Предимства от вградените плащания и системата за рейтинг.</li>
                <li>• Информация за екипна поддръжка, SLA и интеграции.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            {businessUseCases.map((useCase) => (
              <div key={useCase.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-blue-900">{useCase.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{useCase.description}</p>
              </div>
            ))}
            <div className="rounded-xl border border-dashed border-blue-300 bg-blue-50/70 p-6 text-sm text-blue-900">
              Това поле може да замени с формуляр за запитване, често задавани въпроси или друга ключова
              секция, когато сте готови.
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-b from-blue-900 to-blue-700 px-6 py-12 text-center text-white shadow-lg">
          <h2 className="text-2xl font-semibold sm:text-3xl">Готови ли сте да изведете бизнеса си на следващо ниво?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-blue-100 sm:text-base">
            Попълнете страницата с вашето съдържание или се свържете с нас, за да създадем индивидуално
            решение. Rabotim е вашият партньор за надеждни специалисти, бърза логистика и прозрачност.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/post-task"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
            >
              Старт с бизнес задача
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Заявете среща
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

