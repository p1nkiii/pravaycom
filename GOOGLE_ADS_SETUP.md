# Google Ads Setup for /passiontest Landing Page

## Overview
Your `/passiontest` landing page is now optimized for Google Ads campaigns. Here's what you need to do to complete the setup:

## 1. Google Analytics 4 Setup
Add this to your `src/app/layout.tsx` in the `<head>` section:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Replace `GA_MEASUREMENT_ID` with your actual Google Analytics 4 measurement ID.

## 2. Google Ads Conversion Tracking
1. In your Google Ads account, go to Tools & Settings > Conversions
2. Create a new conversion action for "Passion Test Signup"
3. Copy the conversion ID and label
4. Replace `AW-CONVERSION_ID/CONVERSION_LABEL` in the passiontest page with your actual values

## 3. Campaign Setup Recommendations

### Ad Groups to Create:
- **"Find Your Passion"** - Broad match keywords
- **"Passion Discovery Test"** - Exact match keywords  
- **"Career Change Help"** - Related keywords
- **"Life Purpose Test"** - Long-tail keywords

### Recommended Keywords:
- find your passion
- passion discovery test
- career change help
- life purpose test
- what should I do with my life
- feeling lost career
- passion assessment
- career guidance
- life direction test

### Landing Page URL:
Use: `https://yourdomain.com/passiontest`

### Ad Copy Suggestions:
**Headline 1:** Find Your True Passion in 15 Minutes
**Headline 2:** Free AI-Powered Passion Discovery Test
**Description:** Stop feeling lost. Our AI conversation reveals what truly excites you. Get personalized matches and action plans.

## 4. Conversion Tracking
The page includes conversion tracking that fires when users click the CTA buttons. Make sure to:
1. Set up conversion tracking in Google Ads
2. Test the conversion tracking is working
3. Monitor conversion rates and optimize accordingly

## 5. A/B Testing Recommendations
Test these elements:
- Headlines (current vs. more emotional)
- CTA button text ("Start Free Test Now" vs. "Discover My Passion")
- Social proof numbers
- Pricing presentation

## 6. Mobile Optimization
The page is fully responsive and optimized for mobile users, which is crucial for Google Ads performance.

## 7. Page Speed
The page uses optimized animations and should load quickly. Monitor Core Web Vitals in Google Search Console.

## Next Steps:
1. Set up Google Analytics 4
2. Create Google Ads conversion tracking
3. Launch your first campaign
4. Monitor and optimize based on performance data

The landing page is designed to convert visitors into signups for your passion discovery service. Track your conversion rates and adjust your campaigns accordingly.
