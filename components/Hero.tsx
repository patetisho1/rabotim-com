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
      {/* Main content with light blue background */}
      <div className="bg-blue-100 rounded-3xl p-6 sm:p-8">
        {/* Large white title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
          Търся някой…
        </h1>

        {/* List of tasks in white text */}
        <div className="text-white text-lg sm:text-xl mb-6">
          <p className="mb-2">да боядиса стая</p>
          <p className="mb-2">да пренесе кашон</p>
          <p className="mb-2">да изчисти къща</p>
        </div>

        {/* Subtitle */}
        <p className="text-white text-lg sm:text-xl mb-8">
          Намери точния човек за всяка задача.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-4 mb-8">
          <Link
            href="/post-task"
            className="focus-ring inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-4 text-white text-lg font-semibold shadow-sm hover:bg-blue-700 active:bg-blue-800 transition"
            aria-label="Публикувай задача безплатно"
          >
            Публикувай задача безплатно
            <span aria-hidden className="ml-2">→</span>
          </Link>

          <Link
            href="/become-tasker"
            className="focus-ring inline-flex items-center justify-center rounded-full border-2 border-blue-600 px-6 py-4 text-blue-600 bg-white hover:bg-gray-50 active:bg-gray-100 transition"
            aria-label="Стани изпълнител"
          >
            Стани изпълнител
          </Link>
        </div>

        {/* Illustration */}
        <div className="relative w-full h-48 sm:h-56 bg-gray-100 rounded-2xl overflow-hidden">
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
    </section>
  );
}
