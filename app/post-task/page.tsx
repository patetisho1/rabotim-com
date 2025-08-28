'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  X, 
  Upload, 
  MapPin, 
  Calendar, 
  DollarSign,
  FileText,
  Image,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface TaskFormData {
  title: '',
  description: '',
  category: '',
  location: '',
  price: '',
  priceType: 'fixed' | 'hourly',
  deadline: '',
  urgent: false,
  photos: File[],
  conditions: ''
}

const categories = [
  'Електрически услуги',
  'Водопроводни услуги',
  'Почистване',
  'Градинарство',
  'Преместване',
  'Ремонт',
  'Доставка',
  'Сглобяване',
  'Авто услуги',
  'IT услуги',
  'Обучение',
  'Друго'
]

const steps = [
  { id: 1, title: 'Категория и детайли', description: 'Изберете категория и опишете задачата' },
  { id: 2, title: 'Бюджет и срок', description: 'Задайте бюджет и срок за изпълнение' },
  { id: 3, title: 'Локация', description: 'Укажете къде трябва да се изпълни задачата' },
  { id: 4, title: 'Снимки и условия', description: 'Добавете снимки и специални условия' },
  { id: 5, title: 'Преглед', description: 'Прегледайте и публикувайте задачата' }
]

export default function PostTaskPage() {
  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-ink-900 mb-4">
          Публикуване на задача
        </h1>
        <p className="text-slate-600 mb-8">
          Тук ще бъде формата за публикуване на нова задача.
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