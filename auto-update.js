// auto-update.js - Automatic Update Checker and Installer

class AutoUpdater {
    constructor(currentVersion = '1.0.0', githubRepo = '') {
        this.currentVersion = currentVersion;
        this.githubRepo = githubRepo; // Format: "username/repo"
        this.updateCheckURL = githubRepo 
            ? `https://raw.githubusercontent.com/${githubRepo}/main/version.json`
            : './version.json';
        this.updateInterval = null;
        this.checkIntervalMinutes = 60; // Check every hour
    }

    // Start checking for updates periodically
    startAutoCheck(intervalMinutes = 60) {
        this.checkIntervalMinutes = intervalMinutes;
        
        // Check immediately on start
        this.checkForUpdates();

        // Then check periodically
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            this.checkForUpdates();
        }, intervalMinutes * 60 * 1000);
    }

    stopAutoCheck() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // Check if updates are available
    async checkForUpdates() {
        try {
            // For local development, check a local version file
            // For production, this would check a remote server
            const response = await fetch('./version.json?t=' + Date.now(), {
                cache: 'no-store'
            });

            if (!response.ok) {
                console.log('No update server configured');
                return null;
            }

            const versionInfo = await response.json();
            
            if (this.isNewerVersion(versionInfo.version, this.currentVersion)) {
                console.log(`Update available: ${versionInfo.version}`);
                
                if (window.onUpdateAvailable) {
                    window.onUpdateAvailable(versionInfo);
                }

                return versionInfo;
            } else {
                console.log('App is up to date');
                return null;
            }
        } catch (error) {
            console.log('Update check skipped (normal for local dev)');
            return null;
        }
    }

    // Compare version numbers (semantic versioning)
    isNewerVersion(newVersion, currentVersion) {
        const newParts = newVersion.split('.').map(Number);
        const currentParts = currentVersion.split('.').map(Number);

        for (let i = 0; i < 3; i++) {
            if (newParts[i] > currentParts[i]) return true;
            if (newParts[i] < currentParts[i]) return false;
        }

        return false;
    }

    // Download and apply update
    async installUpdate(versionInfo) {
        try {
            // Show update progress
            if (window.onUpdateProgress) {
                window.onUpdateProgress('מוריד עדכון...');
            }

            // If GitHub repo is configured, download files from GitHub
            if (this.githubRepo && versionInfo.files) {
                for (const file of versionInfo.files) {
                    const url = `https://raw.githubusercontent.com/${this.githubRepo}/main/${file}`;
                    const response = await fetch(url);
                    const content = await response.text();
                    
                    // Store in localStorage for offline access
                    localStorage.setItem(`updated_${file}`, content);
                }
            }
            
            // Clear service worker cache if using one
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) {
                    await registration.unregister();
                }
            }

            // Clear browser cache
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
            }

            // Update local version
            localStorage.setItem('appVersion', versionInfo.version);
            localStorage.setItem('lastUpdateCheck', new Date().toISOString());

            if (window.onUpdateProgress) {
                window.onUpdateProgress('עדכון הושלם! טוען מחדש...');
            }

            // Reload the page to get new version
            setTimeout(() => {
                window.location.reload(true);
            }, 1000);

        } catch (error) {
            console.error('Update installation failed:', error);
            if (window.onUpdateError) {
                window.onUpdateError(error);
            }
            alert('שגיאה בהתקנת העדכון. אנא נסה שוב מאוחר יותר.');
        }
    }

    // Manual update check
    async checkNow() {
        return await this.checkForUpdates();
    }

    // Get current version
    getCurrentVersion() {
        return this.currentVersion;
    }

    // Show update notification
    showUpdateNotification(versionInfo) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #6b9b7f, #4a8fa0);
            color: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;

        notification.innerHTML = `
            <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">
                🎉 עדכון חדש זמין!
            </div>
            <div style="font-size: 0.9rem; margin-bottom: 1rem; opacity: 0.95;">
                גרסה ${versionInfo.version} - ${versionInfo.description || 'שיפורים וחידושים'}
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button id="installUpdateBtn" style="
                    flex: 1;
                    padding: 0.75rem;
                    background: white;
                    color: #2c5f6f;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                ">
                    עדכן עכשיו
                </button>
                <button id="dismissUpdateBtn" style="
                    padding: 0.75rem;
                    background: transparent;
                    color: white;
                    border: 2px solid white;
                    border-radius: 8px;
                    cursor: pointer;
                ">
                    מאוחר יותר
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        // Handle button clicks
        document.getElementById('installUpdateBtn').onclick = () => {
            notification.remove();
            this.installUpdate(versionInfo);
        };

        document.getElementById('dismissUpdateBtn').onclick = () => {
            notification.remove();
        };
    }
}

// Create global instance
// IMPORTANT: Replace with your GitHub username/repo after creating the repository
// Example: window.autoUpdater = new AutoUpdater('1.0.0', 'pooh/vet-clinic-reminders');
window.autoUpdater = new AutoUpdater('1.0.0', ''); // Add your repo here!

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoUpdater;
}
