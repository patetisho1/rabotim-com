'use client'

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'JobPosting' | 'LocalBusiness' | 'Person' | 'FAQPage' | 'BreadcrumbList'
  data: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Pre-made structured data for common pages
export function OrganizationStructuredData() {
  return (
    <StructuredData
      type="Organization"
      data={{
        name: 'Rabotim.com',
        url: 'https://rabotim.com',
        logo: 'https://rabotim.com/logo.png',
        description: 'Водещата платформа за намиране на почасова работа и професионални изпълнители в България. Повече от 10,000 завършени задачи.',
        foundingDate: '2024',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+359-XX-XXX-XXXX',
          contactType: 'Customer Service',
          availableLanguage: ['bg', 'en'],
          areaServed: 'BG',
          hoursAvailable: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00'
          }
        },
        sameAs: [
          'https://facebook.com/rabotim',
          'https://instagram.com/rabotim',
          'https://linkedin.com/company/rabotim',
          'https://twitter.com/rabotim_bg'
        ],
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'BG',
          addressLocality: 'София'
        },
        knowsAbout: [
          'Почасова работа',
          'Фрийланс услуги',
          'Ремонт',
          'Почистване',
          'Доставка',
          'Обучение',
          'Градинарство',
          'IT услуги'
        ],
        serviceArea: {
          '@type': 'Country',
          name: 'Bulgaria'
        }
      }}
    />
  )
}

export function WebSiteStructuredData() {
  return (
    <StructuredData
      type="WebSite"
      data={{
        name: 'Rabotim.com',
        url: 'https://rabotim.com',
        description: 'Платформа за намиране на почасова работа и изпълнители в България. Повече от 10,000 завършени задачи.',
        inLanguage: 'bg',
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://rabotim.com/tasks?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          },
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://rabotim.com/tasks?location={location_string}'
            },
            'query-input': 'required name=location_string'
          }
        ],
        publisher: {
          '@type': 'Organization',
          name: 'Rabotim.com',
          logo: 'https://rabotim.com/logo.png'
        }
      }}
    />
  )
}

export function JobPostingStructuredData({ task }: { task: any }) {
  return (
    <StructuredData
      type="JobPosting"
      data={{
        title: task.title,
        description: task.description,
        datePosted: task.created_at,
        validThrough: task.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        employmentType: task.price_type === 'hourly' ? 'PART_TIME' : 'CONTRACTOR',
        hiringOrganization: {
          '@type': 'Organization',
          name: 'Rabotim.com',
          url: 'https://rabotim.com'
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: task.location,
            addressCountry: 'BG'
          }
        },
        baseSalary: {
          '@type': 'MonetaryAmount',
          currency: 'BGN',
          value: {
            '@type': 'QuantitativeValue',
            value: task.price,
            unitText: task.price_type === 'hourly' ? 'HOUR' : 'TOTAL'
          }
        },
        workHours: task.price_type === 'hourly' ? 'Part-time' : 'Project-based',
        skills: task.skills || [],
        responsibilities: task.description,
        qualifications: task.requirements || [],
        benefits: ['Гъвкаво работно време', 'Конкурентни цени', 'Бързо изплащане'],
        applicationInstructions: 'Кандидатствайте директно чрез платформата Rabotim.com',
        industry: task.category || 'Services',
        jobBenefits: 'Гъвкаво работно време и конкурентни цени'
      }}
    />
  )
}

export function LocalBusinessStructuredData() {
  return (
    <StructuredData
      type="LocalBusiness"
      data={{
        name: 'Rabotim.com',
        url: 'https://rabotim.com',
        description: 'Водещата платформа за намиране на почасова работа и професионални изпълнители в България',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'BG',
          addressLocality: 'София'
        },
        telephone: '+359-XX-XXX-XXXX',
        openingHours: 'Mo-Fr 09:00-18:00',
        priceRange: '$$',
        servesCuisine: 'Various Services',
        acceptsReservations: false,
        paymentAccepted: 'Cash, Card, Bank Transfer',
        currenciesAccepted: 'BGN, EUR',
        areaServed: {
          '@type': 'Country',
          name: 'Bulgaria'
        },
        hasMap: 'https://maps.google.com/?q=Sofia,Bulgaria',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '1250',
          bestRating: '5',
          worstRating: '1'
        }
      }}
    />
  )
}

export function FAQStructuredData({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  return (
    <StructuredData
      type="FAQPage"
      data={{
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }}
    />
  )
}

export function BreadcrumbListStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  return (
    <StructuredData
      type="BreadcrumbList"
      data={{
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      }}
    />
  )
}
