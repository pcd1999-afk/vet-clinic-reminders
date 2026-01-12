// google-calendar.js - Google Calendar Integration Module

const CALENDAR_SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
const CALENDAR_API_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

class GoogleCalendarSync {
    constructor() {
        this.accessToken = null;
        this.calendarId = 'primary';
        this.syncInterval = null;
    }

    // Initialize Google Sign-In
    async initGoogleAuth() {
        return new Promise((resolve, reject) => {
            // Load Google API
            if (!window.google) {
                const script = document.createElement('script');
                script.src = 'https://accounts.google.com/gsi/client';
                script.onload = () => {
                    this.setupGoogleSignIn();
                    resolve();
                };
                script.onerror = reject;
                document.head.appendChild(script);
            } else {
                this.setupGoogleSignIn();
                resolve();
            }
        });
    }

    setupGoogleSignIn() {
        // Initialize Google Identity Services
        google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID', // Will be replaced by user
            callback: this.handleCredentialResponse.bind(this)
        });
    }

    // Handle OAuth2 flow
    async requestCalendarAccess() {
        const client = google.accounts.oauth2.initTokenClient({
            client_id: 'YOUR_GOOGLE_CLIENT_ID', // Will be replaced
            scope: CALENDAR_SCOPES,
            callback: (response) => {
                if (response.access_token) {
                    this.accessToken = response.access_token;
                    localStorage.setItem('googleAccessToken', this.accessToken);
                    this.onAuthSuccess();
                }
            },
        });

        client.requestAccessToken();
    }

    handleCredentialResponse(response) {
        this.accessToken = response.credential;
        this.onAuthSuccess();
    }

    onAuthSuccess() {
        console.log('Google Calendar connected successfully!');
        if (window.onGoogleCalendarConnected) {
            window.onGoogleCalendarConnected();
        }
    }

    // Fetch events from Google Calendar
    async fetchEvents(startDate, endDate) {
        if (!this.accessToken) {
            throw new Error('Not authenticated with Google Calendar');
        }

        const params = new URLSearchParams({
            timeMin: startDate.toISOString(),
            timeMax: endDate.toISOString(),
            singleEvents: true,
            orderBy: 'startTime'
        });

        const response = await fetch(`${CALENDAR_API_URL}?${params}`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch calendar events');
        }

        const data = await response.json();
        return this.parseEvents(data.items || []);
    }

    // Parse Google Calendar events into appointment format
    parseEvents(events) {
        return events.map(event => {
            // Try to extract client and pet information from event
            const summary = event.summary || '';
            const description = event.description || '';
            
            // Look for patterns like "Client: Name" or "Pet: Name"
            const clientMatch = description.match(/(?:client|לקוח):\s*([^\n]+)/i);
            const petMatch = description.match(/(?:pet|חיה):\s*([^\n]+)/i);
            const phoneMatch = description.match(/(?:phone|טלפון):\s*([\d\s\+\-\(\)]+)/i);
            const serviceMatch = description.match(/(?:service|טיפול):\s*([^\n]+)/i);

            return {
                id: `gcal-${event.id}`,
                clientName: clientMatch ? clientMatch[1].trim() : summary.split('-')[0]?.trim() || 'Unknown',
                petName: petMatch ? petMatch[1].trim() : summary.split('-')[1]?.trim() || 'Unknown',
                petType: 'Unknown',
                clientPhone: phoneMatch ? phoneMatch[1].trim().replace(/[\s\-\(\)]/g, '') : '',
                appointmentDate: event.start.dateTime || event.start.date,
                serviceType: serviceMatch ? serviceMatch[1].trim() : event.summary || 'Unknown Service',
                reminderDays: 1, // Default to 1 day before
                reminderSent: false,
                source: 'google-calendar',
                googleEventId: event.id,
                createdAt: new Date().toISOString()
            };
        });
    }

    // Auto-sync on interval
    startAutoSync(intervalMinutes = 60) {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }

        this.syncInterval = setInterval(() => {
            this.syncNow();
        }, intervalMinutes * 60 * 1000);
    }

    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    async syncNow() {
        try {
            const now = new Date();
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 30); // Next 30 days

            const events = await this.fetchEvents(now, futureDate);
            
            if (window.onCalendarEventsFetched) {
                window.onCalendarEventsFetched(events);
            }

            return events;
        } catch (error) {
            console.error('Calendar sync failed:', error);
            throw error;
        }
    }

    // Check if already authenticated
    isAuthenticated() {
        return !!this.accessToken || !!localStorage.getItem('googleAccessToken');
    }

    // Disconnect
    disconnect() {
        this.accessToken = null;
        localStorage.removeItem('googleAccessToken');
        this.stopAutoSync();
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleCalendarSync;
}
