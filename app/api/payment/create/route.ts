import { NextResponse } from 'next/server'

// This will redirect to PayPal payment
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { painting, customer } = body

    // For now, create a simple PayPal payment link
    // In production, you'd use PayPal SDK or Stripe
    
    const paypalEmail = process.env.PAYPAL_EMAIL || 'contact@artiste.com'
    const itemName = encodeURIComponent(painting.title)
    const amount = painting.price
    const returnUrl = encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://artiste-site-seven.vercel.app'}/payment/success`)
    const cancelUrl = encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://artiste-site-seven.vercel.app'}/payment/cancel`)

    // PayPal.me link or PayPal button URL
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${paypalEmail}&item_name=${itemName}&amount=${amount}&currency_code=EUR&return=${returnUrl}&cancel_return=${cancelUrl}&notify_url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://artiste-site-seven.vercel.app'}/api/payment/webhook`)}`

    // Send notification email to artist
    await sendOrderNotification(painting, customer)

    return NextResponse.json({ 
      success: true, 
      paypalUrl,
      orderId: Date.now().toString()
    })
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 })
  }
}

async function sendOrderNotification(painting: any, customer: any) {
  // Send email using Resend or similar
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  
  if (!RESEND_API_KEY) {
    console.log('No Resend API key, skipping email')
    return
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Artiste Portfolio <onboarding@resend.dev>',
        to: [process.env.ARTIST_EMAIL || 'contact@artiste.com'],
        subject: `Nouvelle commande: ${painting.title}`,
        html: `
          <h1>Nouvelle commande reçue!</h1>
          <h2>Tableau: ${painting.title}</h2>
          <p>Prix: ${painting.price} €</p>
          <hr>
          <h3>Client:</h3>
          <p>Nom: ${customer.name}</p>
          <p>Email: ${customer.email}</p>
          <p>Téléphone: ${customer.phone}</p>
          <p>Adresse: ${customer.address}</p>
          <p>Message: ${customer.message || 'Aucun'}</p>
        `
      })
    })
  } catch (error) {
    console.error('Email error:', error)
  }
}
