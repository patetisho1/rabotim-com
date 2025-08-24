'use client'

import { Wrench, Sparkles, Heart, Truck, Move, TreePine, Package, MoreHorizontal, Dog } from 'lucide-react'

const categories = [
  {
    id: 'repair',
    name: 'Ремонт',
    icon: Wrench,
    color: 'bg-blue-100 text-blue-600',
    description: 'Домашен и офис ремонт'
  },
  {
    id: 'cleaning',
    name: 'Почистване',
    icon: Sparkles,
    color: 'bg-green-100 text-green-600',
    description: 'Домашно и офис почистване'
  },
  {
    id: 'care',
    name: 'Грижа',
    icon: Heart,
    color: 'bg-pink-100 text-pink-600',
    description: 'Грижа за деца и възрастни'
  },
  {
    id: 'delivery',
    name: 'Доставка',
    icon: Truck,
    color: 'bg-orange-100 text-orange-600',
    description: 'Доставка на пратки'
  },
  {
    id: 'moving',
    name: 'Преместване',
    icon: Move,
    color: 'bg-purple-100 text-purple-600',
    description: 'Помощ при преместване'
  },
  {
    id: 'garden',
    name: 'Градинарство',
    icon: TreePine,
    color: 'bg-emerald-100 text-emerald-600',
    description: 'Градински услуги'
  },
  {
    id: 'dog-care',
    name: 'Разходка/грижа за куче',
    icon: Dog,
    color: 'bg-yellow-100 text-yellow-600',
    description: 'Разходка и грижа за домашни любимци'
  },
  {
    id: 'packaging',
    name: 'Опаковане',
    icon: Package,
    color: 'bg-amber-100 text-amber-600',
    description: 'Помощ при опаковане'
  },
  {
    id: 'other',
    name: 'Друго',
    icon: MoreHorizontal,
    color: 'bg-gray-100 text-gray-600',
    description: 'Други услуги'
  }
]

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
      {categories.map((category) => {
        const IconComponent = category.icon
        return (
          <button
            key={category.id}
            className="card hover:shadow-md transition-all duration-200 text-center group p-3 md:p-4 hover:scale-105"
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-200`}>
              <IconComponent size={20} className="md:w-6 md:h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
              {category.name}
            </h3>
            <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
              {category.description}
            </p>
          </button>
        )
      })}
    </div>
  )
} 