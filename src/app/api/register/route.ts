import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { writeClient, client } from '@/lib/sanity.client'

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis.' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères.' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existing = await client.fetch(
      `*[_type == "user" && email == $email][0]{ _id }`,
      { email }
    )

    if (existing) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cet email.' },
        { status: 400 }
      )
    }

    const passwordHash = await hash(password, 12)

    await writeClient.create({
      _type: 'user',
      name,
      email,
      phone: phone || '',
      passwordHash,
      emailVerified: false,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte.' },
      { status: 500 }
    )
  }
}
