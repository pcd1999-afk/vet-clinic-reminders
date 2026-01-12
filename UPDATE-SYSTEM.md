# 🔄 Auto-Update System Guide

## How It Works

The app can update itself automatically without re-downloading or re-installing!

---

## For Users (Ella)

### Automatic Updates

**The app checks for updates every hour automatically.**

When an update is available, you'll see:
```
┌────────────────────────────────────┐
│ 🎉 עדכון חדש זמין!                 │
│                                    │
│ גרסה 1.1.0 - שיפורים וחידושים     │
│                                    │
│ [עדכן עכשיו] [מאוחר יותר]         │
└────────────────────────────────────┘
```

**Click "עדכן עכשיו" (Update Now):**
- App downloads the update
- Installs automatically
- Page refreshes
- Done! ✅

**No need to:**
- ❌ Re-download the ZIP
- ❌ Re-install anything
- ❌ Reconfigure settings
- ❌ Lose any data

### Manual Update Check

Click the **"🔄 בדוק עדכונים"** button anytime to check for updates immediately.

---

## For Developers (You/Pooh)

### How to Push an Update

#### Option 1: Simple File Replacement (For Ella)

**What Ella needs:**

1. You send her updated files (e.g., `manual-workflow.html`)
2. She replaces them in her folder
3. Next time she opens the app, it's updated!

**No restarting server needed if files are:**
- HTML files
- JavaScript files  
- CSS files

**Server restart needed if files are:**
- `server.js`
- `package.json`
- `.env`

#### Option 2: Version System (Automatic)

**Setup once:**

1. Create a simple file server or GitHub repo
2. Host `version.json` publicly
3. Update `auto-update.js` with the URL

**To release an update:**

1. Update `version.json`:
```json
{
  "version": "1.1.0",
  "releaseDate": "2026-01-15",
  "description": "Added calendar filtering",
  "changelog": [
    "New feature: Filter by date range",
    "Bug fix: Phone number formatting",
    "Performance improvements"
  ],
  "downloadURL": "https://your-server.com/updates/v1.1.0.zip"
}
```

2. Users get notified automatically
3. They click "Update"
4. Files download and install

---

## Update Scenarios

### Scenario 1: Bug Fix in HTML

**Problem:** Found a typo in the Hebrew text

**Solution:**
1. Fix `manual-workflow.html`
2. Send to Ella
3. She replaces the file
4. Refresh browser - done!

**Time: 1 minute**

---

### Scenario 2: New Feature

**Problem:** Want to add SMS scheduling

**Solution:**
1. Update necessary files
2. Test locally
3. Send all updated files to Ella
4. She replaces files
5. Restarts server if needed

**Time: 5 minutes**

---

### Scenario 3: Twilio Configuration Change

**Problem:** Ella got new Twilio numbers

**Solution:**
1. Ella opens the app
2. Clicks "Connect to Twilio"
3. Enters new credentials
4. Saves
5. Done!

**Time: 30 seconds**  
**No files needed from you!**

---

## Version Management

### Current Version

Check current version:
- Bottom of manual-workflow.html shows version
- `version.json` file contains version info
- Console log on app start

### Version Numbering

We use [Semantic Versioning](https://semver.org/):

**Format:** `MAJOR.MINOR.PATCH`

**Example:** `1.2.3`
- `1` = Major version (big changes, might break things)
- `2` = Minor version (new features, backwards compatible)
- `3` = Patch version (bug fixes, small improvements)

**When to increment:**

- **Patch (1.0.0 → 1.0.1):** Bug fixes, typos, small tweaks
- **Minor (1.0.0 → 1.1.0):** New features, improvements
- **Major (1.0.0 → 2.0.0):** Breaking changes, complete rewrites

---

## What Gets Updated

### Files That Can Update Without Restart:
✅ manual-workflow.html  
✅ google-calendar.js  
✅ auto-update.js  
✅ Any CSS/styling  
✅ Any JavaScript logic  

### Files That Need Server Restart:
⚠️ server.js  
⚠️ package.json (if dependencies change)  
⚠️ .env  

### Files That Don't Need Updates:
📌 TWILIO-SETUP.md (documentation)  
📌 README.md (documentation)  
📌 User's data in localStorage  

---

## Sending Updates to Ella

### Method 1: Email/Drive (Simple)

**Steps:**
1. Zip the updated files
2. Email or share via Google Drive
3. Ella downloads
4. Ella replaces files
5. Done!

**Example Email:**
```
Hi Ella!

I've made some improvements to the app:
- Fixed the phone number formatting bug
- Added better error messages in Hebrew
- Improved the calendar sync

Attached is the updated "manual-workflow.html" file.

To install:
1. Go to your app folder
2. Replace the old manual-workflow.html with this new one
3. Refresh your browser

That's it! No server restart needed.

Let me know if you have any issues!
```

---

### Method 2: GitHub (Advanced)

**Setup once:**
1. Put the app in a GitHub repo
2. Ella clones it

**To update:**
1. Push changes to GitHub
2. Ella runs: `git pull`
3. Done!

---

### Method 3: Automatic (Future)

**Setup:**
1. Host version.json on a server
2. Host updated files on same server
3. App checks automatically
4. Users click "Update" button
5. Files download automatically

---

## Best Practices

### Before Updating:

✅ Test changes locally first  
✅ Update version number  
✅ Document what changed  
✅ Test on a fresh install  
✅ Backup Ella's current version  

### When Sending Updates:

✅ List what files changed  
✅ Note if server restart needed  
✅ Explain what's new/fixed  
✅ Provide rollback instructions  

### Communication Template:

```
Update: v1.1.0
Date: January 15, 2026

What's New:
- Feature: Google Calendar now syncs every hour
- Fix: Phone numbers with spaces now work
- Improvement: Faster loading time

Files Changed:
- manual-workflow.html (replace this)
- google-calendar.js (replace this)

Installation:
1. Download attached files
2. Replace in your app folder
3. Refresh browser
4. No server restart needed!

Questions? Let me know!
```

---

## Troubleshooting Updates

### Update Failed

**Try:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Restart browser
4. Restart server

### Lost Settings After Update

**Solution:**
- Settings are in localStorage
- Should survive updates
- If lost, reconnect services
- Appointments stay saved

### Update Keeps Appearing

**Check:**
- Version number updated correctly
- Browser cache cleared
- version.json file correct

---

## Quick Reference

**Check Current Version:**
```javascript
console.log(window.autoUpdater.getCurrentVersion());
```

**Manually Check for Updates:**
Click "🔄 בדוק עדכונים" button

**Force Update:**
- Refresh browser (F5)
- Clear cache (Ctrl+Shift+Del)
- Close and reopen browser

---

## Future Enhancements

**Planned Features:**
- Automatic background updates (no user action needed)
- Rollback to previous version
- Update history log
- Diff view (what changed)
- Beta testing channel

---

**Ready to update?** Just send the files and Ella can update in seconds! 🚀
