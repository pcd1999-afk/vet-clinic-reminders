# 📅 Google Calendar Setup Guide

## Overview

Sync appointments automatically from Ella's Google Calendar to the reminder app. No more manual entry!

---

## Quick Setup (5 Minutes)

### Step 1: Get Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Click **"Create Project"**
3. Name it: `Vet Clinic Reminders`
4. Click **"Create"**

### Step 2: Enable Google Calendar API

1. In your project, go to: **APIs & Services** → **Library**
2. Search for: `Google Calendar API`
3. Click on it
4. Click **"Enable"**

### Step 3: Create OAuth Credentials

1. Go to: **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure OAuth consent screen:
   - User Type: **External**
   - App name: `Vet Clinic Reminders`
   - User support email: Your email
   - Developer contact: Your email
   - Click **"Save and Continue"** through the steps
4. Back to Create OAuth client ID:
   - Application type: **Web application**
   - Name: `Vet Clinic App`
   - Authorized JavaScript origins:
     - Add: `http://localhost:3000`
     - Add: `http://localhost`  
   - Authorized redirect URIs:
     - Add: `http://localhost:3000`
5. Click **"Create"**
6. **Copy your Client ID** (looks like: `123456789-abc...apps.googleusercontent.com`)

### Step 4: Add Client ID to App

1. Open `google-calendar.js` in a text editor
2. Find line with: `client_id: 'YOUR_GOOGLE_CLIENT_ID'`
3. Replace with your actual Client ID
4. Save the file
5. Do this in BOTH places (lines ~30 and ~42)

### Step 5: Test It!

1. Start the app: `npm start`
2. Open: http://localhost:3000/manual-workflow.html
3. Click **"Connect to Google Calendar"** button
4. Sign in with Google
5. Grant calendar access
6. Done! ✅

---

## How Calendar Sync Works

### Automatic Event Detection

The app looks for appointment information in calendar events:

**Best Practice - Event Format:**
```
Title: Sarah Cohen - Max

Description:
Client: Sarah Cohen
Pet: Max
Phone: +972501234567
Service: Wellness Exam
```

**Or Simpler:**
```
Title: Sarah Cohen - Max (Wellness Exam)
Description: +972501234567
```

**Minimal:**
```
Title: Sarah Cohen - Max
Description: 0501234567
```

### What Gets Synced

✅ Event title → Client name & Pet name  
✅ Event description → Phone, Service type  
✅ Event date/time → Appointment date  
✅ Automatic reminder scheduling (1 day before default)  

### Sync Options

**Manual Sync:**
- Click "Connect to Google Calendar"
- Events sync immediately
- Shows how many appointments imported

**Auto-Sync (Future Feature):**
- Syncs every hour automatically
- Only adds new appointments
- Doesn't duplicate existing ones

---

## Calendar Event Examples

### Example 1: Full Details
```
Title: ישראל כהן - צוקי

Description:
Client: ישראל כהן
Pet: צוקי
Phone: +972501234567
Service: בדיקה כללית
```

### Example 2: English
```
Title: Sarah Cohen - Max

Description:
Client: Sarah Cohen
Pet: Max
Phone: +972501234567
Service: Wellness Exam
```

### Example 3: Minimal
```
Title: David Levi - Luna

Description:
0501234567
Acupuncture
```

---

## Troubleshooting

### "Google Calendar connection failed"

**Solution:**
1. Make sure you added the correct Client ID
2. Check that Calendar API is enabled
3. Verify localhost is in authorized origins
4. Try clearing browser cache

### "No events imported"

**Check:**
1. Events are in the future (next 30 days)
2. Events have phone numbers in description
3. Calendar is the primary calendar

### "Can't find Client ID"

**Steps:**
1. Go to Google Cloud Console
2. Select your project
3. APIs & Services → Credentials
4. Find your OAuth 2.0 Client ID
5. Click edit (pencil icon)
6. Copy the Client ID at the top

---

## Privacy & Security

### What Access Does the App Have?

- **Read-only access** to calendar events
- Cannot create, edit, or delete events
- Only fetches events from next 30 days
- All data stays local (localStorage)

### How to Revoke Access

1. Go to: https://myaccount.google.com/permissions
2. Find "Vet Clinic Reminders"
3. Click "Remove Access"

---

## Cost

**Google Calendar API:**
- FREE for up to 1,000,000 requests/day
- For a vet clinic, this is essentially unlimited
- No credit card required

---

## Advanced Features (Future)

### Two-Way Sync
- Update calendar when reminder is sent
- Mark appointments as "Reminder Sent"

### Smart Parsing
- AI-powered extraction of pet/client info
- Automatic service type detection
- Phone number formatting

### Multiple Calendars
- Sync from multiple calendars
- Different reminder times per calendar

---

## Quick Reference

**Google Cloud Console:** https://console.cloud.google.com/  
**Manage App Permissions:** https://myaccount.google.com/permissions  
**Calendar API Docs:** https://developers.google.com/calendar  

---

## Support

Having trouble? Check:
1. Client ID is correct in both places in `google-calendar.js`
2. Calendar API is enabled in Google Cloud
3. OAuth consent screen is configured
4. Localhost is in authorized origins

**Still stuck?** Open an issue or contact support.

---

**Ready to sync?** Follow the steps above and you'll be importing appointments in minutes! 📅✨
