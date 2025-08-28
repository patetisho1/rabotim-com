"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const PHRASES = [
  "да разходи кучето",
  "да боядиса оградата", 
  "да смени крушките",
  "да прекопае градината",
  "да почисти апартамента",
  "да сглоби мебели",
  "да достави пратка",
  "да направи ремонт",
  "да ми направи сайт",
  "да ми напише CV",
  "да бъркаме бетон",
  "да разтоварим тир",
  "да бере грозде",
  "да сервира на сватба",
  "да води презентация",
  "да преведе документ",
  "да направи масаж",
  "да обучи детето",
  "да организира парти",
  "да направи фотографии",
  "да ремонтира кола",
  "да посади дървета",
  "да направи торта"
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PHRASES.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative mx-auto w-full max-w-[640px] px-4 pt-5 pb-6 sm:px-6"
      aria-label="Основна секция – намери изпълнител"
    >
      {/* Top bar (logo will be elsewhere; тук само място за навигация, ако трябва) */}
      <div className="flex items-center justify-between mb-2">
        <div aria-hidden className="h-6" />
        <nav className="sr-only" aria-label="Главна навигация" />
      </div>

      {/* Card-like hero */}
      <div className="rounded-3xl bg-white shadow-[0_6px_30px_rgba(0,0,0,.06)] ring-1 ring-black/5 overflow-hidden">
        {/* Content */}
        <div className="p-5 sm:p-6">
          <h1 className="text-3xl leading-tight font-extrabold text-ink-900 sm:text-4xl">
            Търся някой…
          </h1>

          {/* Rotating phrase */}
          <p
            key={index}
            className="rotate-phrase mt-2 text-[20px] sm:text-[22px] text-slate-700"
            aria-live="polite"
          >
            {PHRASES[index]}
          </p>

          {/* Subcopy */}
          <p className="mt-3 text-slate-600">
            Намери точния човек за всяка задача.
          </p>

          {/* CTAs */}
          <div className="mt-5 flex flex-col gap-3">
            <Link
              href="/post-task"
              className="focus-ring inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-white text-base font-semibold shadow-sm hover:bg-brand-600 active:bg-brand-700 transition"
              aria-label="Публикувай задача безплатно"
            >
              Публикувай задача безплатно
              <span aria-hidden className="ml-2">→</span>
            </Link>

            <Link
              href="/become-tasker"
              className="focus-ring inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-brand-700 bg-white hover:bg-slate-50 active:bg-slate-100 transition"
              aria-label="Стани изпълнител"
            >
              Стани изпълнител
            </Link>
          </div>
        </div>

        {/* Illustration */}
        <div className="relative w-full h-48 sm:h-56 bg-slate-50">
          <Image
            src="/hero-people.svg"
            alt="Хора, които изпълняват различни задачи"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 640px"
            className="object-contain p-4"
          />
        </div>
      </div>

      {/* Optional: secondary text under card */}
      <div className="mt-3 text-center text-sm text-slate-500">
        Бързо, лесно и сигурно – започни сега.
      </div>
    </section>
  );
}
