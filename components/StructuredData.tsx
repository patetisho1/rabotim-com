'use client'

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'JobPosting' | 'LocalBusiness' | 'Person'
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
        description: 'Водещата платформа за намиране на почасова работа и професионални изпълнители в България',
        foundingDate: '2024',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+359-XX-XXX-XXXX',
          contactType: 'Customer Service',
          availableLanguage: ['bg', 'en']
        },
        sameAs: [
          'https://facebook.com/rabotim',
          'https://instagram.com/rabotim',
          'https://linkedin.com/company/rabotim'
        ],
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'BG',
          addressLocality: 'София'
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
        description: 'Платформа за намиране на почасова работа и изпълнители в България',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://rabotim.com/tasks?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
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
          name: 'Rabotim.com'
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
        }
      }}
    />
  )
}


