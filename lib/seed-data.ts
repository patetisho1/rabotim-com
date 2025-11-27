// Seed data for MVP demo
// These tasks will be inserted into the database

export const seedTasks = [
  // Почистване
  {
    title: 'Почистване на 3-стаен апартамент в Лозенец',
    description: 'Търся надежден човек за основно почистване на 3-стаен апартамент (90 кв.м). Включва: прахосмукане, миене на подове, почистване на баня и кухня, избърсване на прах. Апартаментът е след ремонт, има много прах.',
    category: 'Почистване',
    location: 'София',
    price: 120,
    price_type: 'fixed',
    urgent: false,
    status: 'active'
  },
  {
    title: 'Спешно почистване след парти',
    description: 'Имах рожден ден вчера и апартаментът е в ужасно състояние. Трябва бързо почистване днес или утре. 2-стаен апартамент, около 60 кв.м. Основно събиране на отпадъци, миене на чаши и почистване на кухня.',
    category: 'Почистване',
    location: 'Пловдив',
    price: 80,
    price_type: 'fixed',
    urgent: true,
    status: 'active'
  },
  {
    title: 'Редовно почистване на офис - 2 пъти седмично',
    description: 'Търсим почистващ за малък офис (50 кв.м) в центъра на Варна. Почистване 2 пъти седмично - понеделник и четвъртък след 18:00. Дългосрочна работа за подходящия кандидат.',
    category: 'Почистване',
    location: 'Варна',
    price: 25,
    price_type: 'hourly',
    urgent: false,
    status: 'active'
  },

  // Ремонт
  {
    title: 'Смяна на брава на входна врата',
    description: 'Трябва да се смени брава на входна врата на апартамент. Бравата заключва трудно и искам да я сменя с нова, по-сигурна. Имам вече закупена брава, нужен е само монтаж.',
    category: 'Ремонт',
    location: 'София',
    price: 50,
    price_type: 'fixed',
    urgent: false,
    status: 'active'
  },
  {
    title: 'Ремонт на течаща тоалетна касета',
    description: 'Казанчето на тоалетната тече постоянно. Пробвах да оправя сам, но без успех. Нужен е специалист да провери и оправи проблема. Може да се наложи смяна на механизма.',
    category: 'Ремонт',
    location: 'Бургас',
    price: 60,
    price_type: 'fixed',
    urgent: true,
    status: 'active'
  },
  {
    title: 'Боядисване на стая 15 кв.м',
    description: 'Търся бояджия за боядисване на една стая с латекс. Стаята е около 15 кв.м, височина 2.60м. Цвят бял. Материалите се осигуряват от мен. Мебелите ще бъдат изнесени.',
    category: 'Ремонт',
    location: 'София',
    price: 150,
    price_type: 'fixed',
    urgent: false,
    status: 'active'
  },
  {
    title: 'Монтаж на климатик',
    description: 'Имам закупен климатик (9000 BTU), нужен е професионален монтаж. Апартаментът е на 3-ти етаж. Блокът позволява монтаж на външно тяло. Искам качествен монтаж с гаранция.',
    category: 'Ремонт',
    location: 'Пловдив',
    price: 200,
    price_type: 'fixed',
    urgent: false,
    status: 'active'
  },

  // Доставка
  {
    title: 'Пренасяне на диван от Икеа до дома',
    description: 'Купих диван от ИКЕА Младост и трябва да се транспортира до кв. Дружба. Диванът е в 3 кашона, общо около 80 кг. Трябва бус или комби и помощ за качване на 4-ти етаж (има асансьор).',
    category: 'Доставка',
    location: 'София',
    price: 70,
    price_type: 'fixed',
    urgent: false,
    status: 'active'
  },
  {
    title: 'Преместване на малък апартамент',
    description: 'Местя се от едностаен апартамент. Имам: легло, гардероб, бюро, 10 кашона. Разстояние около 5 км в рамките на Пловдив. Трябва бус и 2-ма работника.',
    category: 'Доставка',
    location: 'Пловдив',
    price: 250,
    price_type: 'fixed',
    urgent: false,
    status: 'active'
  },
  {
    title: 'Спешна доставка на документи',
    description: 'Трябва да се вземат документи от офис в Младост и да се занесат до нотариус в центъра на София. Документите са готови, само трябва да се транспортират. Час на получаване е гъвкав.',
    category: 'Доставка',
    location: 'София',
    price: 30,
    price_type: 'fixed',
    urgent: true,
    status: 'active'
  },

  // Градинарство
  {
    title: 'Косене на трева в двор 300 кв.м',
    description: 'Търся градинар за редовно косене на трева в двора на къща. Дворът е около 300 кв.м, предимно трева с няколко дървета. Косачка има, но може и с ваша.',
    category: 'Градинарство',
    location: 'София',
    price: 80,
    price_type: 'fixed',
    urgent: false,
    status: 'active'
  },
  {
    title: 'Подрязване на жив плет',
    description: 'Имам жив плет от туи, около 30 метра дължина и 2 метра височина. Трябва подрязване и оформяне. Отпадъците трябва да се почистят след това.',
    category: 'Градинарство',
    location: 'Варна',
    price: 150,
    price_type: 'fixed',
    urgent: false,
    status: 'active'
  },

  // Обучение
  {
    title: 'Уроци по математика за 7 клас',
    description: 'Търся учител за частни уроци по математика за дъщеря ми (7 клас). Има трудности с алгебра и геометрия. Желателно 2 пъти седмично по 1 час. Може онлайн или на място в София.',
    category: 'Обучение',
    location: 'София',
    price: 30,
    price_type: 'hourly',
    urgent: false,
    status: 'active'
  },
  {
    title: 'Уроци по английски език - начинаещ',
    description: 'Искам да започна да уча английски от нулата. Търся търпелив преподавател за индивидуални уроци. Целта е да мога да общувам в чужбина за туризъм. 2-3 урока седмично.',
    category: 'Обучение',
    location: 'Пловдив',
    price: 25,
    price_type: 'hourly',
    urgent: false,
    status: 'active'
  },
  {
    title: 'Помощ с Excel и Word за офис работа',
    description: 'Започвам нова работа и трябва да подобря уменията си с Excel и Word. Търся някой да ми покаже основните функции - таблици, формули, форматиране. 3-4 часа обучение общо.',
    category: 'Обучение',
    location: 'Бургас',
    price: 20,
    price_type: 'hourly',
    urgent: true,
    status: 'active'
  },

  // IT услуги
  {
    title: 'Ремонт на бавен компютър',
    description: 'Компютърът ми е много бавен, зарежда се вечно. Не знам дали е хардуерен проблем или софтуерен. Нужна е диагностика и оптимизация или почистване от вируси.',
    category: 'IT услуги',
    location: 'София',
    price: 50,
    price_type: 'fixed',
    urgent: false,
    status: 'active'
  },
  {
    title: 'Настройка на домашна WiFi мрежа',
    description: 'Имам рутер и 2 екстендъра, но интернетът е нестабилен в някои стаи. Трябва оптимизация на настройките и правилно позициониране на устройствата. Апартамент 100 кв.м.',
    category: 'IT услуги',
    location: 'Варна',
    price: 40,
    price_type: 'fixed',
    urgent: false,
    status: 'active'
  },
  {
    title: 'Изработка на прост уеб сайт',
    description: 'Търся уеб разработчик за малък сайт за бизнеса ми (фризьорски салон). Трябва: начална страница, за нас, услуги, контакти, галерия. Нищо сложно, но да изглежда модерно.',
    category: 'IT услуги',
    location: 'Пловдив',
    price: 500,
    price_type: 'fixed',
    urgent: false,
    status: 'active'
  },

  // Други
  {
    title: 'Сглобяване на мебели от ИКЕА',
    description: 'Купих гардероб PAX и легло MALM от ИКЕА. Нямам време да ги сглобявам сам. Търся някой с опит да ги сглоби. Инструментите са налични.',
    category: 'Сглобяване',
    location: 'София',
    price: 100,
    price_type: 'fixed',
    urgent: false,
    status: 'active'
  },
  {
    title: 'Гледане на куче за уикенда',
    description: 'Заминавам за уикенда и търся надежден човек да гледа кучето ми (лабрадор, 3 години). Нужно е хранене 2 пъти дневно и разходки. Може да бъде при вас или при мен вкъщи.',
    category: 'Грижа',
    location: 'София',
    price: 80,
    price_type: 'fixed',
    urgent: true,
    status: 'active'
  },
  {
    title: 'Шиене на завеси по поръчка',
    description: 'Имам плат и търся шивачка да ми ушие завеси за хол (2 прозореца, всеки 2м ширина). Искам прости, права линия, без много сложни украси. Материалът е готов.',
    category: 'Друго',
    location: 'Пловдив',
    price: 60,
    price_type: 'fixed',
    urgent: false,
    status: 'active'
  }
]

export const seedUsers = [
  {
    full_name: 'Иван Петров',
    email: 'ivan.demo@rabotim.com',
    avatar_url: 'https://ui-avatars.com/api/?name=Ivan+Petrov&background=3b82f6&color=ffffff&size=100',
    rating: 4.8,
    total_reviews: 12,
    is_verified: true
  },
  {
    full_name: 'Мария Георгиева',
    email: 'maria.demo@rabotim.com',
    avatar_url: 'https://ui-avatars.com/api/?name=Maria+Georgieva&background=ec4899&color=ffffff&size=100',
    rating: 4.6,
    total_reviews: 8,
    is_verified: true
  },
  {
    full_name: 'Георги Димитров',
    email: 'georgi.demo@rabotim.com',
    avatar_url: 'https://ui-avatars.com/api/?name=Georgi+Dimitrov&background=10b981&color=ffffff&size=100',
    rating: 4.9,
    total_reviews: 23,
    is_verified: true
  },
  {
    full_name: 'Елена Стоянова',
    email: 'elena.demo@rabotim.com',
    avatar_url: 'https://ui-avatars.com/api/?name=Elena+Stoyanova&background=f59e0b&color=ffffff&size=100',
    rating: 4.7,
    total_reviews: 15,
    is_verified: false
  },
  {
    full_name: 'Петър Николов',
    email: 'petar.demo@rabotim.com',
    avatar_url: 'https://ui-avatars.com/api/?name=Petar+Nikolov&background=8b5cf6&color=ffffff&size=100',
    rating: 4.5,
    total_reviews: 6,
    is_verified: true
  }
]

