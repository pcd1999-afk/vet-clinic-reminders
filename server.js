// server.js - WhatsApp Appointment Reminder Backend with Twilio Integration
// Supports: WhatsApp Web (testing), Twilio WhatsApp (production), and SMS fallback

require('dotenv').config();
const express = require('express');
const schedule = require('node-schedule');
const cors = require('cors');

// Twilio setup
const twilio = require('twilio');
let twilioClient = null;

// WhatsApp Web setup (for testing/prototype)
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Configuration
const USE_TWILIO = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., "whatsapp:+14155238886"
const TWILIO_SMS_NUMBER = process.env.TWILIO_SMS_NUMBER; // e.g., "+14155238886"

// In-memory storage (in production, use a real database)
let appointments = [];
let whatsappClient = null;
let isWhatsAppReady = false;
let currentQRCode = null;

// Initialize Twilio if credentials are provided
if (USE_TWILIO) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('✓ Twilio initialized');
} else {
    console.log('⚠ Twilio not configured - will use WhatsApp Web only');
}

// Initialize WhatsApp Web client (for prototype/testing)
function initializeWhatsApp() {
    whatsappClient = new Client({
        authStrategy: new LocalAuth({
            clientId: "holistic-vet-reminders"
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox']
        }
    });

    // QR Code generation
    whatsappClient.on('qr', async (qr) => {
        console.log('QR Code received, generating image...');
        currentQRCode = await qrcode.toDataURL(qr);
    });

    // Client ready
    whatsappClient.on('ready', () => {
        console.log('WhatsApp Web client is ready!');
        isWhatsAppReady = true;
        currentQRCode = null;
    });

    // Authentication
    whatsappClient.on('authenticated', () => {
        console.log('WhatsApp Web authenticated');
    });

    // Disconnection handling
    whatsappClient.on('disconnected', (reason) => {
        console.log('WhatsApp Web disconnected:', reason);
        isWhatsAppReady = false;
    });

    whatsappClient.initialize();
}

// API Endpoints

// Get connection status
app.get('/api/status', (req, res) => {
    res.json({
        connected: isWhatsAppReady || USE_TWILIO,
        qrCode: currentQRCode,
        twilioEnabled: USE_TWILIO,
        whatsappWebEnabled: isWhatsAppReady
    });
});

// Connect to WhatsApp Web
app.post('/api/connect', (req, res) => {
    if (!whatsappClient) {
        initializeWhatsApp();
    }
    res.json({ message: 'Initializing WhatsApp connection...' });
});

// Get all appointments
app.get('/api/appointments', (req, res) => {
    res.json(appointments);
});

// Add new appointment
app.post('/api/appointments', (req, res) => {
    const appointment = {
        id: Date.now(),
        ...req.body,
        reminderSent: false,
        reminderMethod: null, // Will be 'whatsapp', 'sms', or 'whatsapp-web'
        createdAt: new Date().toISOString()
    };
    
    appointments.push(appointment);
    appointments.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
    
    // Schedule reminder
    scheduleReminder(appointment);
    
    res.json(appointment);
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    appointments = appointments.filter(apt => apt.id !== id);
    res.json({ success: true });
});

// Send reminder manually
app.post('/api/send-reminder/:id', async (req, res) => {
    const appointment = appointments.find(apt => apt.id === parseInt(req.params.id));
    if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
    }

    try {
        const result = await sendReminderMessage(appointment);
        appointment.reminderSent = true;
        appointment.reminderMethod = result.method;
        res.json({ 
            success: true, 
            message: 'Reminder sent successfully',
            method: result.method 
        });
    } catch (error) {
        console.error('Error sending reminder:', error);
        res.status(500).json({ error: 'Failed to send reminder', details: error.message });
    }
});

// Helper Functions

// Format phone number for WhatsApp
function formatPhoneNumber(phone) {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Ensure it starts with country code
    if (!cleaned.startsWith('1') && cleaned.length === 10) {
        cleaned = '1' + cleaned; // Assume US if no country code
    }
    
    return cleaned;
}

// Format phone number for Twilio (with +)
function formatPhoneNumberForTwilio(phone) {
    const cleaned = formatPhoneNumber(phone);
    return '+' + cleaned;
}

// Send reminder message via best available method
async function sendReminderMessage(appointment) {
    const aptDate = new Date(appointment.appointmentDate);
    const formattedDate = aptDate.toLocaleDateString('he-IL', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const formattedTime = aptDate.toLocaleTimeString('he-IL', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    // Message in Hebrew (customize as needed)
    const message = `שלום ${appointment.clientName}! 🐾

זוהי תזכורת ידידותית על התור הקרוב שלך במרפאה הווטרינרית ההוליסטית שלנו עבור ${appointment.petName}.

📅 תאריך: ${formattedDate}
⏰ שעה: ${formattedTime}
🏥 טיפול: ${appointment.serviceType}
🐾 חיה: ${appointment.petName} (${appointment.petType || 'חיית מחמד'})

אנו מצפים לספק טיפול הוליסטי ומלא חמלה עבור חבר המשפחה הפרוותי שלך. אם אתה צריך לשנות את המועד, נא ליידע אותנו בהקדם האפשרי.

נתראה בקרוב! 🐕🐈`;

    const phoneNumber = formatPhoneNumberForTwilio(appointment.clientPhone);
    
    // Try methods in order of preference:
    // 1. Twilio WhatsApp (most professional)
    // 2. Twilio SMS (reliable fallback)
    // 3. WhatsApp Web (prototype only)

    // Method 1: Try Twilio WhatsApp
    if (USE_TWILIO && TWILIO_WHATSAPP_NUMBER) {
        try {
            console.log(`Attempting Twilio WhatsApp to ${phoneNumber}...`);
            await twilioClient.messages.create({
                from: TWILIO_WHATSAPP_NUMBER,
                to: `whatsapp:${phoneNumber}`,
                body: message
            });
            console.log(`✓ Twilio WhatsApp sent to ${appointment.clientName}`);
            return { success: true, method: 'whatsapp' };
        } catch (error) {
            console.error('Twilio WhatsApp failed:', error.message);
            // Continue to fallback
        }
    }

    // Method 2: Fallback to Twilio SMS
    if (USE_TWILIO && TWILIO_SMS_NUMBER) {
        try {
            console.log(`Falling back to Twilio SMS for ${phoneNumber}...`);
            await twilioClient.messages.create({
                from: TWILIO_SMS_NUMBER,
                to: phoneNumber,
                body: message
            });
            console.log(`✓ Twilio SMS sent to ${appointment.clientName}`);
            return { success: true, method: 'sms' };
        } catch (error) {
            console.error('Twilio SMS failed:', error.message);
            // Continue to last fallback
        }
    }

    // Method 3: Final fallback to WhatsApp Web (prototype only)
    if (isWhatsAppReady) {
        try {
            console.log(`Using WhatsApp Web for ${appointment.clientName}...`);
            const waNumber = formatPhoneNumber(appointment.clientPhone) + '@c.us';
            await whatsappClient.sendMessage(waNumber, message);
            console.log(`✓ WhatsApp Web sent to ${appointment.clientName}`);
            return { success: true, method: 'whatsapp-web' };
        } catch (error) {
            console.error('WhatsApp Web failed:', error.message);
            throw error;
        }
    }

    throw new Error('No messaging method available');
}

// Schedule automatic reminders
function scheduleReminder(appointment) {
    const aptDate = new Date(appointment.appointmentDate);
    const reminderDate = new Date(aptDate);
    reminderDate.setDate(reminderDate.getDate() - appointment.reminderDays);
    reminderDate.setHours(10, 0, 0, 0); // Send at 10 AM

    // Only schedule if reminder date is in the future
    if (reminderDate > new Date()) {
        schedule.scheduleJob(reminderDate, async () => {
            if (!appointment.reminderSent) {
                try {
                    const result = await sendReminderMessage(appointment);
                    appointment.reminderSent = true;
                    appointment.reminderMethod = result.method;
                    console.log(`✓ Automatic reminder sent for ${appointment.clientName} via ${result.method}`);
                } catch (error) {
                    console.error('Failed to send automatic reminder:', error);
                }
            }
        });
        
        console.log(`Reminder scheduled for ${appointment.clientName} on ${reminderDate}`);
    }
}

// Check for reminders that need to be sent (runs every hour)
function checkPendingReminders() {
    const now = new Date();
    
    appointments.forEach(async apt => {
        if (apt.reminderSent) return;
        
        const aptDate = new Date(apt.appointmentDate);
        const daysUntil = Math.ceil((aptDate - now) / (1000 * 60 * 60 * 24));
        
        if (daysUntil <= apt.reminderDays && daysUntil >= 0) {
            try {
                const result = await sendReminderMessage(apt);
                apt.reminderSent = true;
                apt.reminderMethod = result.method;
                console.log(`✓ Pending reminder sent for ${apt.clientName} via ${result.method}`);
            } catch (err) {
                console.error('Error sending pending reminder:', err);
            }
        }
    });
}

// Run reminder check every hour
setInterval(checkPendingReminders, 60 * 60 * 1000);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║  Holistic Vet Clinic - Reminder System            ║
╚════════════════════════════════════════════════════╝

Server running on port ${PORT}
Frontend: http://localhost:${PORT}

Messaging Options:
${USE_TWILIO ? '✓' : '✗'} Twilio Enabled
${TWILIO_WHATSAPP_NUMBER ? '✓' : '✗'} Twilio WhatsApp Configured
${TWILIO_SMS_NUMBER ? '✓' : '✗'} Twilio SMS Configured
${!USE_TWILIO ? '⚠' : '○'} WhatsApp Web (prototype mode)

${!USE_TWILIO ? '\n⚠ WARNING: Running in prototype mode with WhatsApp Web\n   For production, configure Twilio in .env file\n' : ''}
Ready to send reminders!
    `);
});
