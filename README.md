# مذاقات البنّ – Registration Page
### Workshop Registration Site · Netlify Deployment Guide

---

## 📁 Project Structure

```
mazaqat-albunn/
├── index.html                        ← Main registration page
├── netlify.toml                      ← Netlify config (build + redirects)
├── netlify/
│   └── functions/
│       └── get-seats.js              ← Serverless function (live seat counter)
└── README.md
```

---

## 🚀 Deployment Steps

### Step 1 – Push to GitHub

1. Create a new **private** repository on GitHub (e.g. `mazaqat-albunn`)
2. Upload all project files into it (drag & drop or use Git)
3. Make sure the structure matches the tree above exactly

### Step 2 – Connect to Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and authorize Netlify
4. Select your `mazaqat-albunn` repository
5. Build settings (these should auto-detect from `netlify.toml`):
   - **Publish directory**: `.` (a single dot — the root)
   - **Functions directory**: `netlify/functions`
6. Click **"Deploy site"**

---

### Step 3 – Enable Netlify Forms

Netlify Forms are enabled automatically once you deploy the site — no plugin needed.
After the first student submits a form, you can view submissions at:

**Netlify Dashboard → Your Site → Forms → mazaqat-albunn-registration**

---

### Step 4 – Set Environment Variables (for live seat counter)

The seat counter reads live submission data from the Netlify API.
You need two environment variables:

#### 4a. Get your Personal Access Token
1. Go to [app.netlify.com/user/applications](https://app.netlify.com/user/applications)
2. Scroll to **"Personal access tokens"**
3. Click **"New access token"** → give it a name (e.g. `mazaqat-seats`)
4. Copy the token (you won't see it again!)

#### 4b. Get your Site ID
1. Go to your site in Netlify
2. **Site configuration → General → Site details**
3. Copy the **API ID** (a long alphanumeric string)

#### 4c. Add the Variables
1. Go to **Site configuration → Environment variables**
2. Click **"Add a variable"** and add:
   | Key | Value |
   |-----|-------|
   | `NETLIFY_PERSONAL_ACCESS_TOKEN` | (your token from step 4a) |
   | `NETLIFY_SITE_ID` | (your API ID from step 4b) |
3. Click **Save**
4. Go to **Deploys → Trigger deploy → Deploy site** (to redeploy with the new vars)

---

## ✅ Testing the Form Locally

You can open `index.html` directly in a browser for design preview.

> Note: The seat counter will show 15 (full seats) locally since the Netlify Function and API aren't available in local mode. This is expected — it works correctly once deployed.

---

## 📋 How It Works

| Feature | How |
|---------|-----|
| Form capture | Netlify Forms (built-in, zero config after deploy) |
| Seat counter | `get-seats.js` function reads submission count from Netlify API |
| Counter refresh | Auto-refreshes every 30 seconds for all active visitors |
| Full seats message | Shown automatically when `remaining === 0` |
| Spam protection | Netlify honeypot field hidden in form |

---

## 📬 Viewing Registrations

All registrations are viewable in:
**Netlify Dashboard → [Your Site] → Forms → mazaqat-albunn-registration**

You can also export them as CSV from that same page.

---

## ⚙️ Changing Total Seats

The seat count is set in **two places** — change both if needed:

1. `index.html` → line `const TOTAL_SEATS = 15;`
2. `netlify/functions/get-seats.js` → line `const TOTAL_SEATS = 15;`

---

*Built for Department of Arts & Vocational Training · Culinary Skills*
