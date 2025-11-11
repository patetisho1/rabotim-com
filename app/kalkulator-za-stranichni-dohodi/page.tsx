 'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const stats = [
  { label: 'Средна ставка', value: '35 лв./ч.', description: 'за популярни услуги като монтаж, почистване и куриерски задачи.' },
  { label: 'Средно месечен доход', value: '1 250 лв.', description: 'при 3-4 задачи седмично с flex график.' },
  { label: 'Топ градове', value: 'София · Пловдив · Варна', description: 'най-голямо търсене и разнообразие от задачи.' },
];

const categories = [
  {
    name: 'Услуги на майстори',
    earning: 'до 2 400 лв./месец',
    description: 'Монтажи, дребни ремонти и поддръжка. Идеално за техничари с опит и инструменти.',
  },
  {
    name: 'Почистване и помощ в дома',
    earning: 'до 1 800 лв./месец',
    description: 'Редовни заявки за почистване, пране, организиране и помощ при преместване.',
  },
  {
    name: 'Доставка и логистика',
    earning: 'до 2 050 лв./месец',
    description: 'Бързи куриерски услуги, доставки на храна и документи, помощ при покупки.',
  },
];

const skillRates: Record<
  string,
  {
    label: string;
    hourly: number;
    complexity: 'начално' | 'средно' | 'високо';
  }
> = {
  Почистване: { label: 'Почистване', hourly: 15, complexity: 'начално' },
  'Монтаж и ремонт': { label: 'Монтаж и ремонт', hourly: 32, complexity: 'високо' },
  Доставка: { label: 'Доставка', hourly: 18, complexity: 'начално' },
  Градинарство: { label: 'Градинарство', hourly: 22, complexity: 'средно' },
  'IT & дигитални услуги': { label: 'IT & дигитални услуги', hourly: 38, complexity: 'високо' },
};

const locationMultipliers: Record<string, number> = {
  София: 1.15,
  Пловдив: 1.05,
  Варна: 1.08,
  Бургас: 1.03,
  Дистанционно: 1.1,
};

type CalculatorResult = {
  hourly: number;
  weekly: number;
  monthly: number;
  annual: number;
  complexity: string;
  hoursPerWeek: number;
};

const bgCurrency = (value: number) =>
  new Intl.NumberFormat('bg-BG', { style: 'currency', currency: 'BGN', maximumFractionDigits: 0 }).format(value);

export default function SideHustleCalculatorPage() {
  const [selectedSkill, setSelectedSkill] = useState<keyof typeof skillRates>('Почистване');
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(10);
  const [selectedLocation, setSelectedLocation] = useState<keyof typeof locationMultipliers>('София');
  const [result, setResult] = useState<CalculatorResult | null>(null);

  const skillOptions = useMemo(() => Object.keys(skillRates) as Array<keyof typeof skillRates>, []);
  const locationOptions = useMemo(() => Object.keys(locationMultipliers) as Array<keyof typeof locationMultipliers>, []);

  const handleCalculate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const base = skillRates[selectedSkill];
    const locationMultiplier = locationMultipliers[selectedLocation] ?? 1;
    const safeHours = Number.isFinite(hoursPerWeek) && hoursPerWeek > 0 ? hoursPerWeek : 1;

    const hourly = Math.min(Math.max(base.hourly * locationMultiplier, 10), 40);
    const weekly = hourly * safeHours;
    const monthly = weekly * 4.3;
    const annual = monthly * 12;

    setResult({
      hourly,
      weekly,
      monthly,
      annual,
      complexity: base.complexity,
      hoursPerWeek: safeHours,
    });
  };

  const resultSummary = useMemo(() => {
    if (!result) return '';

    const target = result.hoursPerWeek >= 20 ? 'допълнителен, но стабилен доход' : 'гъвкав доход за свободни уикенди';
    return `При ${result.hoursPerWeek} часа седмично можете да постигнете ${bgCurrency(result.monthly)} на месец – идеално за ${target}.`;
  }, [result]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium uppercase tracking-wide text-blue-100">
              Калкулатор за странични доходи
            </span>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Открийте колко можете да печелите с Rabotim, според вашите умения и време.
            </h1>
            <p className="text-lg text-blue-50 sm:text-xl">
              Страницата показва примерна структура по която можете да допълвате реални данни. Използвайте
              нашия калкулатор, за да планирате втори доход или гъвкав график според целите си.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
              >
                Създайте профил
              </Link>
              <Link
                href="/tasks"
                className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Разгледайте налични задачи
              </Link>
            </div>
          </div>

          <div className="flex-1">
            <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-xl">
              <h2 className="text-xl font-semibold text-blue-900">Колко бихте могли да спечелите?</h2>
              <p className="mt-2 text-sm text-slate-600">
                Попълнете полетата и заменете placeholder данните с реалните ви стойности, когато сте готови.
              </p>
              <form className="mt-6 space-y-4" onSubmit={handleCalculate}>
                <div>
                  <label className="text-sm font-medium text-slate-700">Изберете умение</label>
                  <select
                    value={selectedSkill}
                    onChange={(event) => setSelectedSkill(event.target.value as keyof typeof skillRates)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none"
                  >
                    {skillOptions.map((skill) => (
                      <option key={skill} value={skill}>
                        {skillRates[skill].label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Колко часа седмично?</label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={hoursPerWeek}
                    onChange={(event) => setHoursPerWeek(Number(event.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Предпочитана локация</label>
                  <select
                    value={selectedLocation}
                    onChange={(event) => setSelectedLocation(event.target.value as keyof typeof locationMultipliers)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none"
                  >
                    {locationOptions.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Изчислете потенциален доход
                </button>
              </form>

              {result ? (
                <div className="mt-6 space-y-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-blue-900">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                        Прогнозни приходи
                      </h3>
                      <p className="mt-1 text-xs text-blue-600">
                        Сложност на задачите: {skillRates[selectedSkill].complexity}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white px-4 py-2 text-center shadow-sm">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Почасово</p>
                      <p className="text-lg font-semibold text-blue-800">{bgCurrency(result.hourly)}</p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-white/80 p-3 text-center shadow-sm">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Седмично</p>
                      <p className="text-lg font-semibold text-blue-800">{bgCurrency(result.weekly)}</p>
                    </div>
                    <div className="rounded-lg bg-white/80 p-3 text-center shadow-sm">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Месечно</p>
                      <p className="text-lg font-semibold text-blue-800">{bgCurrency(result.monthly)}</p>
                    </div>
                    <div className="rounded-lg bg-white/80 p-3 text-center shadow-sm">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Годишно</p>
                      <p className="text-lg font-semibold text-blue-800">{bgCurrency(result.annual)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-blue-900">{resultSummary}</p>
                  <p className="text-xs text-blue-600">
                    *Тези стойности са демонстративни и ще бъдат актуализирани с реални данни при пускането на официалния калкулатор.
                  </p>
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-dashed border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-900">
                  Тук може да визуализирате резултатите от калкулацията – диаграма, обобщение по седмица или предложения за популярни задачи.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-blue-900 sm:text-3xl">Какво показва калкулаторът?</h2>
            <p className="text-base text-slate-600 sm:text-lg">
              Комбинация от реални тарифи, успешни задачи и динамика на търсенето. Използвайте описанието
              като база и постепенно заменете текста с конкретни данни, когато сте готови.
            </p>
            <ul className="space-y-4 text-sm text-slate-600">
              <li>• Прогнозен почасов доход според уменията и натоварването.</li>
              <li>• Очаквано време за достигане на конкретна финансова цел.</li>
              <li>• Популярни категории и сезонни върхове на търсене.</li>
              <li>• Възможности за комбиниране на задачи и оптимизиране на графика.</li>
            </ul>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-900">Как да развиете съдържанието:</h3>
              <p className="mt-2 text-sm text-slate-600">
                Добавете реални case studies, примерни сметки и сравнения по региони. Можете да вградите
                интерактивна визуализация или да свържете API, когато данните са готови.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-900">{stat.label}</h3>
                <p className="mt-2 text-3xl font-bold text-blue-700">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-600">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl space-y-10 px-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-blue-900 sm:text-3xl">
              Категории с висок потенциал за допълнителен доход
            </h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Използвайте тези секции, за да добавите реални истории на Taskers, снимки и конкретни съвети.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category.name} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">{category.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">{category.description}</p>
                </div>
                <div className="mt-6 rounded-2xl bg-white px-4 py-3 text-center shadow">
                  <span className="text-xs uppercase tracking-wide text-slate-500">Потенциален доход</span>
                  <p className="text-lg font-semibold text-blue-700">{category.earning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-b from-slate-900 to-blue-900 px-6 py-12 text-center shadow-xl">
          <h2 className="text-2xl font-semibold sm:text-3xl">Готови ли сте да изчислите своя потенциал?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-blue-100 sm:text-base">
            Свържете се с нас, ако желаете индивидуална консултация или достъп до интерактивен калкулатор с
            реални данни. Междувременно използвайте тази страница като рамка за маркетингово съдържание.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
            >
              Стартирайте профил
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

