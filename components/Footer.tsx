'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Download, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-white">
      {/* Top Section - Link Columns */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Discover */}
          <div>
            <h3 className="font-bold text-lg mb-4">Открийте</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/how-it-works" className="hover:text-blue-200 transition-colors">Как работи</Link></li>
              <li><Link href="/post-task" className="hover:text-blue-200 transition-colors">Rabotim за бизнес</Link></li>
              <li><Link href="/register" className="hover:text-blue-200 transition-colors">Печелете пари</Link></li>
              <li><Link href="/tasks" className="hover:text-blue-200 transition-colors">Калкулатор за странични доходи</Link></li>
              <li><Link href="/tasks" className="hover:text-blue-200 transition-colors">Търсете задачи</Link></li>
              <li><Link href="/categories" className="hover:text-blue-200 transition-colors">Ръководства за цени</Link></li>
              <li><Link href="/categories" className="hover:text-blue-200 transition-colors">Ръководства за услуги</Link></li>
              <li><Link href="/how-it-works" className="hover:text-blue-200 transition-colors">Сравнителни ръководства</Link></li>
              <li><Link href="/register" className="hover:text-blue-200 transition-colors">Студентски отстъпки</Link></li>
              <li><Link href="/how-it-works" className="hover:text-blue-200 transition-colors">Партньори</Link></li>
              <li><Link href="/how-it-works" className="hover:text-blue-200 transition-colors">ЧЗВ за нови потребители</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-4">Компания</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-blue-200 transition-colors">За нас</Link></li>
              <li><Link href="/careers" className="hover:text-blue-200 transition-colors">Кариери</Link></li>
              <li><Link href="/contact" className="hover:text-blue-200 transition-colors">Медийни запитвания</Link></li>
              <li><Link href="/contact" className="hover:text-blue-200 transition-colors">Обществени правила</Link></li>
              <li><Link href="/contact" className="hover:text-blue-200 transition-colors">Принципи на работниците</Link></li>
              <li><Link href="/contact" className="hover:text-blue-200 transition-colors">Общи условия</Link></li>
              <li><Link href="/contact" className="hover:text-blue-200 transition-colors">Блог</Link></li>
              <li><Link href="/contact" className="hover:text-blue-200 transition-colors">Свържете се с нас</Link></li>
              <li><Link href="/contact" className="hover:text-blue-200 transition-colors">Политика за поверителност</Link></li>
              <li><Link href="/contact" className="hover:text-blue-200 transition-colors">Инвеститори</Link></li>
            </ul>
          </div>

          {/* Existing Members */}
          <div>
            <h3 className="font-bold text-lg mb-4">Съществуващи членове</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/post-task" className="hover:text-blue-200 transition-colors">Публикувайте задача</Link></li>
              <li><Link href="/tasks" className="hover:text-blue-200 transition-colors">Разглеждайте задачи</Link></li>
              <li><Link href="/login" className="hover:text-blue-200 transition-colors">Вход</Link></li>
              <li><Link href="/how-it-works" className="hover:text-blue-200 transition-colors">Център за поддръжка</Link></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4">Популярни категории</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categories" className="hover:text-blue-200 transition-colors">Услуги за майстори</Link></li>
              <li><Link href="/categories" className="hover:text-blue-200 transition-colors">Почистващи услуги</Link></li>
              <li><Link href="/categories" className="hover:text-blue-200 transition-colors">Доставни услуги</Link></li>
              <li><Link href="/categories" className="hover:text-blue-200 transition-colors">Преместване</Link></li>
              <li><Link href="/categories" className="hover:text-blue-200 transition-colors">Градински услуги</Link></li>
              <li><Link href="/categories" className="hover:text-blue-200 transition-colors">Авто електрици</Link></li>
              <li><Link href="/categories" className="hover:text-blue-200 transition-colors">Сглобяване</Link></li>
              <li><Link href="/categories" className="hover:text-blue-200 transition-colors">Всички услуги</Link></li>
            </ul>
          </div>

          {/* Popular Locations */}
          <div>
            <h3 className="font-bold text-lg mb-4">Популярни локации</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tasks" className="hover:text-blue-200 transition-colors">София</Link></li>
              <li><Link href="/tasks" className="hover:text-blue-200 transition-colors">Пловдив</Link></li>
              <li><Link href="/tasks" className="hover:text-blue-200 transition-colors">Варна</Link></li>
              <li><Link href="/tasks" className="hover:text-blue-200 transition-colors">Бургас</Link></li>
              <li><Link href="/tasks" className="hover:text-blue-200 transition-colors">Стара Загора</Link></li>
              <li><Link href="/tasks" className="hover:text-blue-200 transition-colors">Плевен</Link></li>
              <li><Link href="/tasks" className="hover:text-blue-200 transition-colors">Велико Търново</Link></li>
              <li><Link href="/tasks" className="hover:text-blue-200 transition-colors">Видин</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section - Partnership, Copyright, Apps, Social */}
      <div className="border-t border-blue-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            
            {/* Partnership Box */}
            <div className="bg-white text-blue-900 rounded-lg border border-white p-4 flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="font-bold text-lg">VISA</div>
                  <div className="text-xs">MASTERCARD</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">CASH</div>
                  <div className="text-xs">APP</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">GOOGLE</div>
                  <div className="text-xs">PAY</div>
                </div>
              </div>
              <div className="w-px h-12 bg-blue-900"></div>
              <div className="text-center">
                <div className="font-bold text-xl">Rabotim</div>
                <div className="text-xs bg-blue-900 text-white px-2 py-1 rounded mt-1">ОФИЦИАЛЕН ПАРТНЬОР</div>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-blue-200 text-sm">
                Rabotim Limited 2024-{currentYear}©, Всички права запазени
              </p>
            </div>

            {/* Country and Apps */}
            <div className="flex flex-col items-center lg:items-end space-y-4">
              <div className="flex items-center space-x-2 text-blue-200">
                <Globe className="w-4 h-4" />
                <span className="text-sm">България</span>
              </div>
              
              <div className="flex space-x-3">
                <button className="bg-white text-blue-900 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-50 transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">App Store</span>
                </button>
                <button className="bg-white text-blue-900 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-50 transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Google Play</span>
                </button>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-blue-200 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-white hover:text-blue-200 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-white hover:text-blue-200 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-white hover:text-blue-200 transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
