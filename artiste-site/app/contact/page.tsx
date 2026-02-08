import { Metadata } from 'next'
import { ContactForm } from './ContactForm'
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact | Artiste',
  description: 'Contactez-moi pour toute question sur mes œuvres, commandes personnalisées ou collaborations.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="text-[#c9a86c] text-sm uppercase tracking-[0.3em] mb-4">
            Contact
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-6">
            Restons en Contact
          </h1>
          <p className="text-[#888] font-light text-lg max-w-2xl mx-auto">
            Une question sur mes œuvres ? Un projet de commande personnalisée ?
            N'hésitez pas à me contacter.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-6 lg:px-12 pb-24">
        <div className="grid lg:grid-cols-5 gap-16 lg:gap-24">
          
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Info Cards */}
            <div className="space-y-8">
              <a 
                href="mailto:contact@artiste.com" 
                className="group flex items-start gap-6"
              >
                <div className="w-14 h-14 border border-[#2a2a2a] flex items-center justify-center group-hover:border-[#c9a86c] transition-colors duration-300">
                  <Mail size={20} className="text-[#c9a86c]" />
                </div>
                <div>
                  <p className="text-[#888] text-sm uppercase tracking-wider mb-1">Email</p>
                  <p className="text-lg group-hover:text-[#c9a86c] transition-colors duration-300">
                    contact@artiste.com
                  </p>
                </div>
              </a>

              <a 
                href="tel:+33612345678" 
                className="group flex items-start gap-6"
              >
                <div className="w-14 h-14 border border-[#2a2a2a] flex items-center justify-center group-hover:border-[#c9a86c] transition-colors duration-300">
                  <Phone size={20} className="text-[#c9a86c]" />
                </div>
                <div>
                  <p className="text-[#888] text-sm uppercase tracking-wider mb-1">Téléphone</p>
                  <p className="text-lg group-hover:text-[#c9a86c] transition-colors duration-300">
                    +33 6 12 34 56 78
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 border border-[#2a2a2a] flex items-center justify-center">
                  <MapPin size={20} className="text-[#c9a86c]" />
                </div>
                <div>
                  <p className="text-[#888] text-sm uppercase tracking-wider mb-1">Atelier</p>
                  <p className="text-lg">Paris, France</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-[#888] text-sm uppercase tracking-wider mb-4">Suivez-moi</p>
              <div className="flex gap-3">
                {[
                  { icon: Instagram, href: 'https://instagram.com' },
                  { icon: Facebook, href: 'https://facebook.com' },
                  { icon: Twitter, href: 'https://twitter.com' },
                ].map(({ icon: Icon, href }, i) => (
                  <a 
                    key={i}
                    href={href}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 border border-[#2a2a2a] flex items-center justify-center text-white/70 hover:border-[#c9a86c] hover:text-[#c9a86c] transition-all duration-300"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="border-t border-[#1a1a1a] pt-12">
              <h3 className="font-serif text-2xl mb-8">Questions Fréquentes</h3>
              <div className="space-y-6">
                {[
                  {
                    q: 'Livrez-vous à l\'international ?',
                    a: 'Oui, je livre dans le monde entier avec un emballage professionnel.',
                  },
                  {
                    q: 'Acceptez-vous les commandes personnalisées ?',
                    a: 'Absolument ! Contactez-moi pour discuter de votre projet.',
                  },
                  {
                    q: 'Peut-on visiter l\'atelier ?',
                    a: 'Sur rendez-vous uniquement, n\'hésitez pas à me contacter.',
                  },
                ].map((faq, i) => (
                  <div key={i}>
                    <p className="font-medium mb-2">{faq.q}</p>
                    <p className="text-[#888] font-light text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-[#111] border border-[#1a1a1a] p-8 lg:p-12">
              <h2 className="font-serif text-3xl mb-8">Envoyez-moi un message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
