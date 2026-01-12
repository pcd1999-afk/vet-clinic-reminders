# Holistic Vet Clinic - WhatsApp Appointment Reminder System

A beautiful, automated appointment reminder system that sends WhatsApp messages to pet owners before their scheduled veterinary appointments.

## 🐾 Features

- **WhatsApp Integration**: Connect your WhatsApp account to send automated reminders
- **Smart Scheduling**: Set reminders 1-3 days before appointments
- **Beautiful Interface**: Veterinary-themed design with calming, professional colors
- **Client Management**: Store pet owner information and appointment details
- **Automatic Reminders**: System automatically sends reminders at scheduled times
- **Manual Override**: Send reminders immediately if needed
- **Statistics Dashboard**: Track appointments and reminder status

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (version 14 or higher)
- npm (comes with Node.js)
- A smartphone with WhatsApp installed
- Google Chrome or Chromium (required for WhatsApp Web automation)

## 🚀 Installation

### Step 1: Install Dependencies

Open your terminal and navigate to the project folder, then run:

```bash
npm install
```

This will install:
- `express` - Web server framework
- `whatsapp-web.js` - WhatsApp Web automation
- `qrcode` - QR code generation for WhatsApp login
- `node-schedule` - Automated task scheduling
- `cors` - Cross-origin resource sharing

### Step 2: Set Up the Project Structure

Create a `public` folder and move the HTML file:

```bash
mkdir public
mv appointment-reminder-system.html public/index.html
```

### Step 3: Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

## 📱 How to Use

### Connecting to WhatsApp

1. Open your browser and go to `http://localhost:3000`
2. Click the "Connect WhatsApp" button
3. A QR code will appear on the screen
4. Open WhatsApp on your phone:
   - **iPhone**: Settings → Linked Devices → Link a Device
   - **Android**: Menu (⋮) → Linked Devices → Link a Device
5. Scan the QR code with your phone
6. Once connected, the status indicator will turn green

### Adding Appointments

1. Fill out the appointment form with:
   - Client name
   - Phone number (with country code)
   - Date and time of appointment
   - Service type
   - When to send reminder (1-3 days before)

2. Click "Add Appointment"

3. The appointment will appear in the "Upcoming Appointments" section

### Managing Reminders

**Automatic Reminders:**
- The system checks every hour for appointments that need reminders
- Reminders are sent automatically at 10:00 AM on the scheduled day
- Example: If an appointment is on Friday and set to remind 2 days before, the reminder sends Wednesday at 10 AM

**Manual Reminders:**
- Click "Send Reminder Now" on any appointment to send immediately
- Useful for testing or last-minute reminders

### Phone Number Format

Phone numbers should be entered as:
- Country code: Select from dropdown (e.g., +1 for US)
- Number: Enter without spaces or dashes (e.g., 5551234567)

Example: +1-5551234567 becomes 15551234567@c.us internally

## 🔧 Technical Details

### How It Works

1. **WhatsApp Web Connection**: Uses `whatsapp-web.js` which launches a headless Chrome browser and connects to WhatsApp Web
2. **Data Storage**: Currently uses in-memory storage (appointments are lost on restart)
3. **Scheduling**: Uses `node-schedule` to set up cron jobs for automatic reminders
4. **Message Format**: Sends formatted messages with appointment details

### File Structure

```
vet-appointment-reminder/
├── server.js                 # Backend server with WhatsApp logic
├── package.json             # Dependencies and scripts
├── public/
│   └── index.html          # Frontend interface
└── README.md               # This file
```

## ⚙️ Configuration

### Reminder Message Template

Edit the message template in `server.js` (line ~140):

```javascript
const message = `Hello ${appointment.clientName}! 🐾

This is a friendly reminder about your pet's upcoming appointment...`;
```

### Reminder Time

Change when reminders are sent (currently 10:00 AM) in `server.js` (line ~195):

```javascript
reminderDate.setHours(10, 0, 0, 0); // Send at 10 AM
```

### Service Types

Add or modify service types in `public/index.html` (around line 280):

```html
<option value="Your Service">Your Service</option>
<!-- Current options: Wellness Exam, Acupuncture, Chiropractic, etc. -->
```

## 🔄 Upgrading to Production

This prototype uses:
- In-memory storage (appointments are lost on restart)
- Local file system for WhatsApp session
- No user authentication

For production, consider:

1. **Database**: Use MongoDB, PostgreSQL, or MySQL
   ```bash
   npm install mongoose  # for MongoDB
   # or
   npm install pg        # for PostgreSQL
   ```

2. **Persistent Storage**: Store appointments in database
3. **User Authentication**: Add login system for multiple users
4. **Cloud Hosting**: Deploy to Heroku, DigitalOcean, or AWS
5. **WhatsApp Business API**: Upgrade to official API for better reliability

### Moving to WhatsApp Business API

The official WhatsApp Business API offers:
- More reliability
- Official support
- Better rate limits
- Business verification

Steps:
1. Sign up at https://business.whatsapp.com/
2. Get API credentials
3. Replace `whatsapp-web.js` with official API calls

## 🐛 Troubleshooting

### "WhatsApp not connected" Error

**Solution**: Make sure you've clicked "Connect WhatsApp" and scanned the QR code

### QR Code Not Appearing

**Solution**: 
1. Restart the server (`npm start`)
2. Clear browser cache
3. Try a different browser

### Messages Not Sending

**Possible causes**:
1. WhatsApp Web session expired - reconnect by scanning QR code
2. Phone number format incorrect - ensure country code is included
3. WhatsApp not installed on recipient's phone
4. Rate limiting from WhatsApp

### Appointments Disappearing

**Cause**: This prototype uses in-memory storage

**Solution**: Upgrade to database storage (see Production section above)

## 📝 Important Notes

### WhatsApp Terms of Service

- This uses WhatsApp Web automation, which is technically against WhatsApp's Terms of Service
- For production use, upgrade to official WhatsApp Business API
- Risk: Your WhatsApp number could be temporarily banned
- **Recommendation**: Use a separate business number, not your personal WhatsApp

### Rate Limits

- Don't send too many messages quickly
- WhatsApp may flag your account as spam
- Space out reminder times appropriately

### Testing

Before going live:
1. Test with your own phone number
2. Verify message formatting looks good
3. Check reminder timing works correctly
4. Have a backup plan for important appointments

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server logs in the terminal
3. Check browser console for frontend errors

## 🔐 Security Considerations

- Keep your WhatsApp session secure
- Don't share the `.wwebjs_auth` folder (contains your session)
- Add `.wwebjs_auth/` to `.gitignore` if using version control
- Use HTTPS in production
- Add authentication before deploying publicly

## 🎨 Customization

### Changing Colors

Edit CSS variables in `public/index.html` (around line 12):

```css
:root {
    --vet-dark: #2c5f6f;      /* Dark teal */
    --healing-green: #6b9b7f;  /* Green accent */
    --warm-coral: #e88873;     /* Coral accent */
    /* Add your own colors */
}
```

### Business Logo

Add your logo to the header section in `public/index.html`

### Fonts

Currently uses:
- Cormorant Garamond (elegant serif for headings)
- Montserrat (clean sans-serif for body)

Change in the Google Fonts import at the top of `index.html`

## 📈 Future Enhancements

Potential features to add:
- [ ] Database integration
- [ ] Email reminders as backup
- [ ] SMS fallback option
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Client response tracking
- [ ] Appointment confirmation requests
- [ ] No-show tracking
- [ ] Multi-user support
- [ ] Mobile app version
- [ ] Payment integration

## 📄 License

MIT License - Feel free to modify and use for your veterinary practice!

---

Built with ❤️ for Holistic Vet Clinic
