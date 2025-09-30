import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('❌ No Stripe signature')
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('❌ Webhook signature verification failed:', errorMessage)
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      console.log('🎉 Checkout session completed!')
      console.log('Session ID:', session.id)

      const userId = session.metadata?.user_id || session.client_reference_id
      const creditsPurchased = parseInt(session.metadata?.credits_purchased || '1')

      console.log('User ID:', userId)
      console.log('Credits to add:', creditsPurchased)

      if (!userId) {
        console.error('❌ No user ID in webhook')
        return NextResponse.json({ received: true })
      }

      const paymentIntentId = typeof session.payment_intent === 'string' 
        ? session.payment_intent 
        : session.payment_intent?.id || ''
      
      // Get the actual price from your Stripe product (single source of truth)
      const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID!)
      const amountCents = price.unit_amount || 0

      console.log('📝 Creating purchase record...')
      console.log('Amount from Stripe product:', amountCents, 'cents ($' + (amountCents/100) + ')')
      
      const { error: purchaseError } = await supabaseAdmin
        .from('purchases')
        .insert({
          user_id: userId,
          stripe_payment_intent_id: paymentIntentId,
          amount_cents: amountCents,
          credits_purchased: creditsPurchased,
          status: 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (purchaseError) {
        console.error('❌ Error creating purchase:', purchaseError)
      } else {
        console.log('✅ Purchase record created!')
      }

      console.log('💰 Updating user credits...')
      const { data: profile, error: fetchError } = await supabaseAdmin
        .from('user_profiles')
        .select('credits, total_purchased')
        .eq('id', userId)
        .single()

      if (fetchError) {
        console.error('❌ Error fetching profile:', fetchError)
        return NextResponse.json({ received: true })
      }

      const currentCredits = profile?.credits || 0
      const currentTotalPurchased = profile?.total_purchased || 0

      const { error: updateError } = await supabaseAdmin
        .from('user_profiles')
        .update({
          credits: currentCredits + creditsPurchased,
          total_purchased: currentTotalPurchased + creditsPurchased,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (updateError) {
        console.error('❌ Error updating credits:', updateError)
      } else {
        console.log(`✅ Added ${creditsPurchased} credits to user ${userId}`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('❌ Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
