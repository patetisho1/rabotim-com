
// Демо данни за тестване
if (typeof window !== 'undefined') {
  // Потребители
  localStorage.setItem('users', JSON.stringify([
  {
    "id": 1,
    "name": "Иван Петров",
    "email": "ivan.petrov@example.com",
    "rating": 4.8,
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    "verified": true,
    "joinDate": "2023-01-15",
    "completedTasks": 45,
    "totalEarnings": 2500
  },
  {
    "id": 2,
    "name": "Мария Георгиева",
    "email": "maria.georgieva@example.com",
    "rating": 4.6,
    "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    "verified": true,
    "joinDate": "2023-03-20",
    "completedTasks": 32,
    "totalEarnings": 1800
  },
  {
    "id": 3,
    "name": "Петър Димитров",
    "email": "petar.dimitrov@example.com",
    "rating": 4.4,
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    "verified": false,
    "joinDate": "2023-05-10",
    "completedTasks": 18,
    "totalEarnings": 950
  }
]))
  
  // Задачи
  localStorage.setItem('tasks', JSON.stringify([
  {
    "id": 1,
    "title": "Почистване на апартамент",
    "description": "Търся надежден човек за почистване на 3-стаен апартамент. Трябва да се направи генерално почистване.",
    "category": "Почистване",
    "price": 80,
    "priceType": "fixed",
    "location": "София, Център",
    "deadline": "2024-01-15",
    "urgent": false,
    "remote": false,
    "offers": 5,
    "views": 23,
    "createdAt": "2024-01-10",
    "userId": 1,
    "status": "active",
    "postedByEmail": "ivan.petrov@example.com",
    "image": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop"
  },
  {
    "id": 2,
    "title": "Ремонт на компютър",
    "description": "Компютърът ми не се включва. Трябва диагностика и ремонт.",
    "category": "IT и технологии",
    "price": 50,
    "priceType": "hourly",
    "location": "Пловдив",
    "deadline": "2024-01-20",
    "urgent": true,
    "remote": true,
    "offers": 3,
    "views": 15,
    "createdAt": "2024-01-12",
    "userId": 2,
    "status": "active",
    "postedByEmail": "maria.georgieva@example.com",
    "image": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop"
  },
  {
    "id": 3,
    "title": "Градинарски работи",
    "description": "Търся градинар за поддръжка на градина - косане на трева, подрязване на дървета.",
    "category": "Градинарство",
    "price": 120,
    "priceType": "fixed",
    "location": "Варна",
    "deadline": "2024-01-25",
    "urgent": false,
    "remote": false,
    "offers": 7,
    "views": 31,
    "createdAt": "2024-01-08",
    "userId": 3,
    "status": "active",
    "postedByEmail": "petar.dimitrov@example.com",
    "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop"
  }
]))
  
  // Съобщения
  localStorage.setItem('messages', JSON.stringify([
  {
    "id": 1,
    "conversationId": "conv_1",
    "senderId": 1,
    "receiverId": 2,
    "message": "Здравейте! Интересувам се от задачата за почистване.",
    "timestamp": "2024-01-10T10:30:00Z",
    "isRead": false
  },
  {
    "id": 2,
    "conversationId": "conv_1",
    "senderId": 2,
    "receiverId": 1,
    "message": "Здравейте! Кога бихте искали да се извърши почистването?",
    "timestamp": "2024-01-10T11:15:00Z",
    "isRead": true
  }
]))
  
  // Известия
  localStorage.setItem('notifications', JSON.stringify([
  {
    "id": 1,
    "userId": 1,
    "title": "Ново съобщение",
    "message": "Получихте ново съобщение за задача \"Почистване на апартамент\"",
    "type": "message",
    "isRead": false,
    "createdAt": "2024-01-10T10:30:00Z"
  },
  {
    "id": 2,
    "userId": 1,
    "title": "Нова оферта",
    "message": "Получихте нова оферта за задача \"Ремонт на компютър\"",
    "type": "offer",
    "isRead": true,
    "createdAt": "2024-01-09T14:20:00Z"
  }
]))
  
  // Рейтинги
  localStorage.setItem('ratings', JSON.stringify([
  {
    "id": 1,
    "userId": 1,
    "ratedBy": 2,
    "rating": 5,
    "comment": "Отлично изпълнение! Препоръчвам.",
    "taskId": 1,
    "createdAt": "2024-01-05T16:45:00Z"
  },
  {
    "id": 2,
    "userId": 2,
    "ratedBy": 1,
    "rating": 4,
    "comment": "Добро качество на работа.",
    "taskId": 2,
    "createdAt": "2024-01-03T12:30:00Z"
  }
]))
  
  // Любими (празен масив)
  localStorage.setItem('favorites', JSON.stringify([]))
  
  // Запазени задачи (празен масив)
  localStorage.setItem('savedTasks', JSON.stringify([]))
  
  // Boost-нати задачи (празен масив)
  localStorage.setItem('boostedTasks', JSON.stringify([]))
  
  console.log('✅ Демо данните са заредени успешно!')
}
