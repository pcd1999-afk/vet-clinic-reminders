# 🚀 QUICK START GUIDE

## Get Started in 5 Minutes!

### 1️⃣ First Time Setup (One-time only)

**WINDOWS USERS (Easiest):**
1. Double-click `setup-windows.bat`
2. Wait for it to complete
3. Done! Skip to step 2.

**Option A: Automatic Setup (Mac/Linux)**
```bash
bash setup.sh
```

**Option B: Manual Setup**
```bash
# Create public folder
mkdir public

# Move HTML file (Windows)
move appointment-reminder-system.html public\index.html

# Move HTML file (Mac/Linux)
mv appointment-reminder-system.html public/index.html

# Install dependencies
npm install
```

### 2️⃣ Start the Server

**WINDOWS:** Double-click `start-server.bat`

**Mac/Linux:**
```bash
npm start
```

You should see:
```
Server running on port 3000
Frontend: http://localhost:3000
Ready to connect to WhatsApp!
```

### 3️⃣ Open in Browser

Go to: **http://localhost:3000**

### 4️⃣ Connect WhatsApp

1. Click the **"Connect WhatsApp"** button
2. A QR code will appear
3. Open WhatsApp on your phone:
   - **iPhone**: Settings → Linked Devices → Link a Device
   - **Android**: Menu (⋮) → Linked Devices → Link a Device
4. Scan the QR code
5. Wait for "Connected to WhatsApp" ✅

### 5️⃣ Add Your First Appointment

Fill out the form:
- **Pet Owner Name**: Jane Doe
- **Phone**: (Country code +1) 5551234567
- **Date/Time**: Pick a future date
- **Service**: Choose from dropdown (Wellness Exam, Acupuncture, etc.)
- **Reminder**: 1-2 days before

Click **"Add Appointment"**

### 6️⃣ Test a Reminder

Click **"Send Reminder Now"** to test immediately!

---

## 📱 Phone Number Format

✅ **Correct:**
- Country code: +1 (from dropdown)
- Number: 5551234567 (no spaces, dashes, or parentheses)

❌ **Incorrect:**
- (555) 123-4567
- 555-123-4567
- +1 555 123 4567

---

## ⚡ Common Issues

### "npm: command not found"
- **Solution**: Install Node.js from https://nodejs.org/

### QR Code Not Showing
- **Solution**: 
  1. Stop server (Ctrl+C)
  2. Run `npm start` again
  3. Refresh browser

### "WhatsApp not connected"
- **Solution**: Click "Connect WhatsApp" and scan QR code

### Messages Not Sending
- **Check**: 
  - WhatsApp is connected (green status)
  - Phone number format is correct
  - Recipient has WhatsApp installed

---

## 🎯 What's Next?

1. **Test thoroughly** with your own number first
2. **Add real appointments** once you're comfortable
3. **Check the full README.md** for advanced features
4. **Consider upgrading to production** setup (see README)

---

## 📞 Need Help?

Check the full **README.md** for:
- Detailed troubleshooting
- Production deployment guide
- Customization options
- Security considerations

---

**Ready to go? Run `npm start` and visit http://localhost:3000!** 🎉
