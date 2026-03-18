import { Metadata } from 'next'
import { safeFetch } from '@/lib/sanity.client'
import { siteSettingsQuery } from '@/lib/sanity.queries'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez l\'artiste pour toute demande de renseignement, commande ou collaboration.',
}

export default async function ContactPage() {
  const settings = await safeFetch(siteSettingsQuery)

  return (
    <>
      <section className="hero hero--small hero--no-image">
        <div className="hero__content">
          <h1 className="hero__title">Contact</h1>
          <p className="hero__subtitle">N&apos;hésitez pas à me contacter</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Contact' }]} />
          <div className="contact-section">
            <ContactForm />
            <ContactInfo settings={settings} />
          </div>
        </div>
      </section>
    </>
  )
}
