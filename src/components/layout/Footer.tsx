import Link from 'next/link'
import SocialLinks from '@/components/shared/SocialLinks'

interface FooterProps {
  settings?: any
}

export default function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear()
  const siteName = settings?.siteName || 'Artiste Peintre'

  return (
    <footer className="site-footer" id="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link href="/" className="site-logo__text">
            {siteName}
          </Link>
          <p>{settings?.footerText || 'Artiste peintre passionné(e), créant des œuvres uniques entre lumière et couleurs.'}</p>
        </div>

        <div className="site-footer__nav">
          <h4>Navigation</h4>
          <ul>
            <li><Link href="/">Accueil</Link></li>
            <li><Link href="/galerie">Galerie</Link></li>
            <li><Link href="/expositions">Expositions</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="site-footer__contact">
          <h4>Contact</h4>
          {settings?.contactEmail && <p><a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></p>}
          {settings?.contactPhone && <p><a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a></p>}
          {!settings?.contactEmail && !settings?.contactPhone && (
            <p>Pour toute demande de renseignement, n&apos;hésitez pas à me contacter.</p>
          )}
          <SocialLinks links={settings?.socialLinks} />
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>&copy; {year} {siteName}. Tous droits réservés.</p>
      </div>
    </footer>
  )
}
