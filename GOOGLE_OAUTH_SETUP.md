# Google OAuth Setup Guide

This guide will help you complete the Google OAuth setup for your Pravay application.

## What's Been Implemented

✅ Google sign-in button added to login page (`/src/app/login/page.tsx`)
✅ Google sign-in button added to signup page (`/src/app/signup/page.tsx`)
✅ Server actions for Google OAuth created
✅ OAuth callback handler created (`/src/app/auth/callback/route.ts`)
✅ Automatic user profile creation for Google sign-ins

## Required: Configure Google OAuth in Supabase

To enable Google sign-in, you need to configure it in your Supabase project:

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth Client ID**
5. Select **Web application** as the application type
6. Add your authorized redirect URIs:
   - For development: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   - For production: `https://[YOUR-PRODUCTION-DOMAIN]/auth/v1/callback`
7. Note your **Client ID** and **Client Secret**

### Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Navigate to **Authentication** > **Providers**
3. Find **Google** in the list and toggle it to **Enabled**
4. Enter your **Client ID** and **Client Secret** from Google
5. Configure the redirect URL (should be pre-filled): `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
6. Click **Save**

### Step 3: Update Site URL Settings

1. In Supabase Dashboard, go to **Authentication** > **URL Configuration**
2. Set your **Site URL**:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
3. Add your redirect URLs to the **Redirect URLs** allowlist:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

## How It Works

1. **User clicks "Sign in with Google"** → Redirects to Google's OAuth consent screen
2. **User authorizes the app** → Google redirects back to `/auth/callback` with an authorization code
3. **Callback handler exchanges code for session** → Creates user profile if it doesn't exist
4. **User is redirected to dashboard** → Fully authenticated and ready to use the app

## User Profile Handling

When a user signs in with Google:
- If they're a new user, a profile is automatically created in the `user_profiles` table
- The `first_name` is extracted from their Google profile name
- The `age` field is set to `null` (can be updated later if needed)
- The profile uses the same `id` as the Supabase auth user

## Testing

After configuration, test the flow:

1. Start your development server: `npm run dev`
2. Navigate to `/login`
3. Click "Sign in with Google"
4. Authorize the app
5. You should be redirected to `/dashboard` after successful authentication

## Troubleshooting

### "OAuth error: Failed to authenticate with Google"
- Check that your Google OAuth credentials are correct in Supabase
- Verify the redirect URLs match exactly (no trailing slashes)
- Ensure Google OAuth consent screen is configured properly

### User profile not created
- Check Supabase logs for any database errors
- Verify the `user_profiles` table exists and has the correct schema
- Check that RLS (Row Level Security) policies allow inserts

### Redirect loop or "Invalid redirect URL"
- Verify the callback URL is in the Supabase allowlist
- Check that the Site URL is set correctly in Supabase
- Clear browser cookies and try again

## Security Notes

- Google OAuth tokens are handled securely by Supabase
- User sessions are managed by Supabase Auth
- The callback endpoint validates the authorization code before creating a session
- Profile creation prevents duplicates by checking for existing profiles first

## Additional Configuration (Optional)

### Request Additional Scopes
If you need more user data from Google (like profile picture), modify the OAuth call in `actions.ts`:

```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${origin}/auth/callback`,
    scopes: 'profile email', // Add more scopes as needed
  },
})
```

### Customize OAuth Button
The Google button is styled to match Google's brand guidelines. You can customize it in:
- `/src/app/login/page.tsx`
- `/src/app/signup/page.tsx`

Look for the `<svg>` element with the Google logo and the button styling.

