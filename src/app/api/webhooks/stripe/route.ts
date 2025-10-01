import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  let rawBody = ''
  try {
    rawBody = await request.text()
  } catch {
    return NextResponse.json({ error: 'Failed to read request body' }, { status: 400 })
  }
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = verifyStripeSignature(rawBody, signature)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }
      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: `Webhook processing failed: ${message}` }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id || session.client_reference_id || ''
  const creditsPurchased = parseInt(session.metadata?.credits_purchased || '1', 10)

  if (!userId) return

  const paymentIntentId = typeof session.payment_intent === 'string'
    ? session.payment_intent
    : session.payment_intent?.id || ''

  if (!paymentIntentId) return

  const amountCents = typeof session.amount_total === 'number' ? session.amount_total : 0

  // Idempotency: if a purchase for this payment intent already exists, do nothing
  const { data: existingPurchase, error: existingError } = await supabaseAdmin
    .from('purchases')
    .select('id')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .limit(1)

  if (existingError) return

  const alreadyRecorded = Array.isArray(existingPurchase) && existingPurchase.length > 0
  if (alreadyRecorded) return

  // Create purchase record
  const { error: purchaseInsertError } = await supabaseAdmin
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

  if (purchaseInsertError) return

  // Update or create user profile credits
  const { data: profiles, error: profileFetchError } = await supabaseAdmin
    .from('user_profiles')
    .select('id, credits, total_purchased')
    .eq('id', userId)
    .limit(1)

  if (profileFetchError) return

  const hasProfile = Array.isArray(profiles) && profiles.length > 0
  if (!hasProfile) {
    // Create a profile row if missing
    const { error: profileInsertError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: userId,
        credits: creditsPurchased,
        total_purchased: creditsPurchased,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    if (profileInsertError) return
    return
  }

  const currentCredits = profiles[0].credits || 0
  const currentTotalPurchased = profiles[0].total_purchased || 0

  const { error: profileUpdateError } = await supabaseAdmin
    .from('user_profiles')
    .update({
      credits: currentCredits + creditsPurchased,
      total_purchased: currentTotalPurchased + creditsPurchased,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (profileUpdateError) return
}

function verifyStripeSignature(rawBody: string, signature: string): Stripe.Event {
  const configuredSecrets = [
    process.env.STRIPE_WEBHOOK_SECRET,
    process.env.STRIPE_WEBHOOK_SECRET_ALT,
    process.env.STRIPE_WEBHOOK_SECRET_TEST,
    process.env.STRIPE_WEBHOOK_SECRET_LIVE,
  ].filter(Boolean) as string[]

  if (configuredSecrets.length === 0) {
    throw new Error('No STRIPE_WEBHOOK_SECRET configured')
  }

  const errors: string[] = []
  for (const secret of configuredSecrets) {
    try {
      return stripe.webhooks.constructEvent(rawBody, signature, secret)
    } catch (e) {
      errors.push(e instanceof Error ? e.message : String(e))
    }
  }

  throw new Error(`Failed verifying with ${configuredSecrets.length} configured secret(s).`)
}
