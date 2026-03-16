# Gudi Padwa Offer System - Setup Guide

## 🎉 Overview

Complete Gudi Padwa offer ticker + popup lead capture system that:
- ✅ Only appears on `/design-studio` page
- ✅ Features a continuous scrolling ticker with luxury aesthetic
- ✅ Captures leads via popup modal with form validation
- ✅ Integrates with Supabase database
- ✅ Sends data to Google Sheets via webhook
- ✅ Mobile responsive and accessible

## 📁 Files Created

1. **`src/components/marketing/GudiPadwaOffer.tsx`** - Main React component
2. **`supabase-gudi_padwa_leads.sql`** - Supabase table definition
3. **`GOOGLE_APPS_SCRIPT_SETUP.md`** - Google Sheets webhook setup guide

## 🚀 Setup Instructions

### 1. Database Setup (Supabase)

Run the SQL file in your Supabase project:

```sql
-- Run this in Supabase SQL Editor
-- File: supabase-gudi_padwa_leads.sql
```

This creates:
- `gudi_padwa_leads` table with proper constraints
- Row Level Security policies
- Performance indexes

### 2. Google Sheets Integration

Follow the setup guide in `GOOGLE_APPS_SCRIPT_SETUP.md`:

1. Create Google Apps Script project
2. Deploy as Web App
3. Update webhook URL in `GudiPadwaOffer.tsx` (line 42)

### 3. Environment Variables

Ensure these are already configured in your `.env`:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Component Integration

The component is already integrated into:
- **Page**: `/design-studio` (Interiors.tsx)
- **Import**: Added to the Interiors page
- **Rendering**: Appears above the hero section

## 🎨 Features Implemented

### Offer Ticker
- **Full-width** horizontal scrolling animation
- **Luxury aesthetic** with dark background (#0F1B2B) and gold accents (#D4AF37)
- **Smooth animation** that pauses on hover
- **Clickable** entire ticker opens modal
- **Mobile responsive** design

### Popup Modal
- **Glassmorphism** design with backdrop blur
- **Form validation** with Indian phone number format
- **Loading states** and success messages
- **Auto-close** after successful submission
- **Responsive** for all screen sizes

### Form Validation
- **Name**: Required field
- **Phone**: 10-digit Indian validation (starts with 6-9)
- **Email**: Standard email format validation
- **Property Type**: Dropdown with required selection

### Data Integration
- **Supabase**: Inserts into `gudi_padwa_leads` table
- **Google Sheets**: Sends via webhook to Apps Script
- **Error Handling**: Comprehensive error logging
- **Success Feedback**: User-friendly success messages

## 🛠️ Technical Implementation

### Page Targeting
```typescript
// Only renders on /design-studio
if (window.location.pathname !== '/design-studio') {
  return null;
}
```

### Supabase Integration
```typescript
const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);

// Insert lead data
await supabase.from('gudi_padwa_leads').insert({
  name, phone, email, property_type, source_page, created_at
});
```

### Google Sheets Webhook
```typescript
// Send to Google Apps Script
await fetch('https://script.google.com/macros/s/YOUR_WEBHOOK_URL/exec', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, phone, email, propertyType, source })
});
```

## 🎯 Ticker Content

The ticker displays:
```
🎉 Gudi Padwa Special • Book your interior project for ₹999 •
🎁 Complimentary Gifts: AC | TV | Fridge | Washing Machine •
🏡 Luxury Interiors Designed for Your Dream Home •
⏳ Offer Valid Till 19 March • Click to Claim Offer
```

## 📱 Responsive Design

- **Desktop**: Full-width ticker with optimal font sizes
- **Tablet**: Adjusted spacing and font sizes
- **Mobile**: Compact design with smaller fonts
- **Touch-friendly**: Larger tap targets on mobile

## 🔧 Customization

### Update Ticker Text
Edit the ticker content in `GudiPadwaOffer.tsx` (line ~85):

```typescript
<span className="ticker-text">
  🎉 Your Custom Offer • Update This Text •
</span>
```

### Change Colors
Modify CSS variables in the component:

```css
/* Dark luxury background */
background: linear-gradient(135deg, #0F1B2B 0%, #1a2332 100%);
/* Gold accents */
color: #D4AF37;
```

### Update Form Fields
Add/remove form fields in the JSX and update the validation logic accordingly.

## 🚀 Testing

1. **Navigate to** `/design-studio` page
2. **Verify ticker** appears and scrolls smoothly
3. **Click ticker** to open modal
4. **Test form validation** with various inputs
5. **Submit valid form** and check:
   - Supabase database for new record
   - Google Sheet for new entry
   - Success message display

## 📊 Analytics

The system tracks:
- **Source page**: Always `/design-studio`
- **Timestamp**: Automatic creation time
- **Property type**: User selection
- **Contact details**: Name, phone, email

## 🔒 Security

- **Row Level Security** enabled on Supabase table
- **Input validation** prevents malicious data
- **Error handling** prevents data exposure
- **HTTPS required** for production

## 🎉 Ready to Launch!

Your Gudi Padwa offer system is now fully implemented and ready to capture leads on your design studio page!
