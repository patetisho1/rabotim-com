export default function BecomeTaskerPage() {
  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-ink-900 mb-4">
          Стани изпълнител
        </h1>
        <p className="text-slate-600 mb-8">
          Тук ще бъде информацията за регистрация като изпълнител.
        </p>
        <a 
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-3 text-white text-base font-semibold shadow-sm hover:bg-brand-600 transition"
        >
          ← Назад към началната страница
        </a>
      </div>
    </div>
  )
}
