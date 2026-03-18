import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { client } from '@/lib/sanity.client'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const inquiries = await client.fetch(
      `*[_type == "inquiry" && email == $email] | order(createdAt desc) {
        _id,
        "oeuvreTitle": oeuvre->title,
        "oeuvreSlug": oeuvre->slug.current,
        message,
        status,
        createdAt
      }`,
      { email: session.user.email }
    )

    return NextResponse.json({ inquiries: inquiries || [] })
  } catch {
    return NextResponse.json({ inquiries: [] })
  }
}
