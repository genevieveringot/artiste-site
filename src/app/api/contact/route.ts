import { NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity.client'

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs obligatoires.' },
        { status: 400 }
      )
    }

    // 1. Save message to Sanity (always works)
    try {
      await writeClient.create({
        _type: 'inquiry',
        name,
        email,
        phone: phone || undefined,
        message: subject ? `[${subject}] ${message}` : message,
        status: 'new',
        createdAt: new Date().toISOString(),
      })
    } catch (sanityErr) {
      console.error('Sanity write error:', sanityErr)
    }

    // 2. Try to send email via Resend (optional)
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (RESEND_API_KEY && RESEND_API_KEY !== 'your-resend-api-key') {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'Site Artiste <onboarding@resend.dev>',
            to: [process.env.CONTACT_EMAIL || 'contact@example.com'],
            reply_to: email,
            subject: subject ? `[Site] ${subject}` : `[Site] Message de ${name}`,
            html: `
              <h2>Nouveau message depuis le site</h2>
              <p><strong>Nom :</strong> ${name}</p>
              <p><strong>Email :</strong> ${email}</p>
              ${phone ? `<p><strong>Téléphone :</strong> ${phone}</p>` : ''}
              ${subject ? `<p><strong>Sujet :</strong> ${subject}</p>` : ''}
              <hr />
              <p>${message.replace(/\n/g, '<br />')}</p>
            `,
          }),
        })
      } catch (emailErr) {
        console.error('Resend email error:', emailErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 }
    )
  }
}
