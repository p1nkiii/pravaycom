import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const creditsToPurchase = 1
    
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      client_reference_id: user.id,
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/dashboard?payment=success`,
      cancel_url: `${request.headers.get('origin')}/dashboard?payment=cancelled`,
      metadata: {
        user_id: user.id,
        user_email: user.email || '',
        credits_purchased: creditsToPurchase.toString(),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session'
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
