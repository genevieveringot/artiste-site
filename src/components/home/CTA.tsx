import Link from 'next/link'
import ScrollReveal from '@/components/shared/ScrollReveal'

export default function CTA() {
  return (
    <ScrollReveal>
      <section className="page-section page-section--cta" id="cta">
        <div className="container">
          <div className="cta-block">
            <h2 className="cta-block__title">Vous aimez mon travail ?</h2>
            <p className="cta-block__text">
              N&apos;hésitez pas à me contacter pour toute demande de renseignement,
              commande ou collaboration.
            </p>
            <Link href="/contact" className="btn btn--white btn--lg">
              Me contacter
            </Link>
          </div>
        </div>
      </section>
    </ScrollReveal>
  )
}
