import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Email templates
export const emailTemplates = {
  welcomeUser: (name: string) => ({
    subject: 'Добре дошли в Rabotim.com! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">Добре дошли в Rabotim.com!</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Здравейте, ${name}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Благодарим ви, че се присъединихте към най-голямата платформа за почасова работа в България.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Какво можете да правите:</h3>
            <ul style="color: #666;">
              <li>Публикувайте задачи и намерете изпълнители</li>
              <li>Кандидатствайте за интересни проекти</li>
              <li>Оценявайте и получавайте отзиви</li>
              <li>Общувайте директно с клиенти</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/tasks" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Разгледай задачите
            </a>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">Rabotim.com - Свързваме хората за по-добър свят</p>
        </div>
      </div>
    `
  }),

  newTaskNotification: (recipientName: string, taskTitle: string, taskCategory: string, taskLocation: string) => ({
    subject: `Нова задача в ${taskCategory}: ${taskTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #4CAF50; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 20px;">🆕 Нова задача за вас!</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Здравейте, ${recipientName}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Има нова задача, която може да ви заинтересува:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50;">
            <h3 style="color: #333; margin-top: 0;">${taskTitle}</h3>
            <p style="color: #666; margin: 5px 0;"><strong>Категория:</strong> ${taskCategory}</p>
            <p style="color: #666; margin: 5px 0;"><strong>Локация:</strong> ${taskLocation}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/tasks" 
               style="background: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Виж задачата
            </a>
          </div>
        </div>
      </div>
    `
  }),

  taskApplicationReceived: (taskOwner: string, applicantName: string, taskTitle: string) => ({
    subject: `Нов кандидат за "${taskTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2196F3; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 20px;">👤 Нов кандидат!</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Здравейте, ${taskOwner}!</h2>
          <p style="color: #666; line-height: 1.6;">
            <strong>${applicantName}</strong> кандидатства за вашата задача:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #2196F3;">
            <h3 style="color: #333; margin-top: 0;">${taskTitle}</h3>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/messages" 
               style="background: #2196F3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Прегледай кандидатурата
            </a>
          </div>
        </div>
      </div>
    `
  }),

  taskCompleted: (clientName: string, freelancerName: string, taskTitle: string) => ({
    subject: `Задачата "${taskTitle}" е завършена`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #FF9800; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 20px;">✅ Задача завършена!</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Здравейте, ${clientName}!</h2>
          <p style="color: #666; line-height: 1.6;">
            <strong>${freelancerName}</strong> завърши вашата задача:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #FF9800;">
            <h3 style="color: #333; margin-top: 0;">${taskTitle}</h3>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Моля, оценете работата на изпълнителя, за да помогнете на другите потребители.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/ratings" 
               style="background: #FF9800; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Оценете работата
            </a>
          </div>
        </div>
      </div>
    `
  }),

  newRatingReceived: (recipientName: string, ratingGiver: string, rating: number, taskTitle: string) => ({
    subject: `Получихте ${rating}⭐ рейтинг`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #FFC107; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 20px;">⭐ Нов рейтинг!</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Здравейте, ${recipientName}!</h2>
          <p style="color: #666; line-height: 1.6;">
            <strong>${ratingGiver}</strong> ви остави ${rating}⭐ рейтинг за задачата:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #FFC107;">
            <h3 style="color: #333; margin-top: 0;">${taskTitle}</h3>
            <div style="font-size: 24px; color: #FFC107; text-align: center;">
              ${'⭐'.repeat(rating)}
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile" 
               style="background: #FFC107; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Вижте профила си
            </a>
          </div>
        </div>
      </div>
    `
  }),

  passwordReset: (name: string, resetUrl: string) => ({
    subject: 'Възстановяване на парола - Rabotim.com',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f44336; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 20px;">🔐 Възстановяване на парола</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Здравейте, ${name}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Получихме заявка за възстановяване на вашата парола.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #f44336; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Възстанови паролата
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Ако не сте заявили възстановяване на парола, моля игнорирайте този email.
            Линкът е валиден 24 часа.
          </p>
        </div>
      </div>
    `
  })
}

// Email service functions
export const emailService = {
  async sendWelcomeEmail(to: string, name: string) {
    try {
      const template = emailTemplates.welcomeUser(name)
      
      const { data, error } = await resend.emails.send({
        from: 'Rabotim.com <noreply@rabotim.com>',
        to: [to],
        subject: template.subject,
        html: template.html,
      })

      if (error) {
        console.error('Error sending welcome email:', error)
        return { success: false, error }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error sending welcome email:', error)
      return { success: false, error }
    }
  },

  async sendNewTaskNotification(to: string, recipientName: string, taskTitle: string, taskCategory: string, taskLocation: string) {
    try {
      const template = emailTemplates.newTaskNotification(recipientName, taskTitle, taskCategory, taskLocation)
      
      const { data, error } = await resend.emails.send({
        from: 'Rabotim.com <notifications@rabotim.com>',
        to: [to],
        subject: template.subject,
        html: template.html,
      })

      if (error) {
        console.error('Error sending task notification:', error)
        return { success: false, error }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error sending task notification:', error)
      return { success: false, error }
    }
  },

  async sendTaskApplicationNotification(to: string, taskOwner: string, applicantName: string, taskTitle: string) {
    try {
      const template = emailTemplates.taskApplicationReceived(taskOwner, applicantName, taskTitle)
      
      const { data, error } = await resend.emails.send({
        from: 'Rabotim.com <notifications@rabotim.com>',
        to: [to],
        subject: template.subject,
        html: template.html,
      })

      if (error) {
        console.error('Error sending application notification:', error)
        return { success: false, error }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error sending application notification:', error)
      return { success: false, error }
    }
  },

  async sendTaskCompletionNotification(to: string, clientName: string, freelancerName: string, taskTitle: string) {
    try {
      const template = emailTemplates.taskCompleted(clientName, freelancerName, taskTitle)
      
      const { data, error } = await resend.emails.send({
        from: 'Rabotim.com <notifications@rabotim.com>',
        to: [to],
        subject: template.subject,
        html: template.html,
      })

      if (error) {
        console.error('Error sending completion notification:', error)
        return { success: false, error }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error sending completion notification:', error)
      return { success: false, error }
    }
  },

  async sendNewRatingNotification(to: string, recipientName: string, ratingGiver: string, rating: number, taskTitle: string) {
    try {
      const template = emailTemplates.newRatingReceived(recipientName, ratingGiver, rating, taskTitle)
      
      const { data, error } = await resend.emails.send({
        from: 'Rabotim.com <notifications@rabotim.com>',
        to: [to],
        subject: template.subject,
        html: template.html,
      })

      if (error) {
        console.error('Error sending rating notification:', error)
        return { success: false, error }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error sending rating notification:', error)
      return { success: false, error }
    }
  },

  async sendPasswordResetEmail(to: string, name: string, resetUrl: string) {
    try {
      const template = emailTemplates.passwordReset(name, resetUrl)
      
      const { data, error } = await resend.emails.send({
        from: 'Rabotim.com <security@rabotim.com>',
        to: [to],
        subject: template.subject,
        html: template.html,
      })

      if (error) {
        console.error('Error sending password reset email:', error)
        return { success: false, error }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error sending password reset email:', error)
      return { success: false, error }
    }
  },

  // Bulk email for newsletter/marketing
  async sendBulkEmail(recipients: string[], subject: string, htmlContent: string) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'Rabotim.com <newsletter@rabotim.com>',
        to: recipients,
        subject: subject,
        html: htmlContent,
      })

      if (error) {
        console.error('Error sending bulk email:', error)
        return { success: false, error }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Error sending bulk email:', error)
      return { success: false, error }
    }
  }
}
