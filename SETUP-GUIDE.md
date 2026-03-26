# Levion - Setup Guide
## Follow these steps exactly in order

---

## STEP 1: Run the Database Schema in Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Open your **Levion** project
3. Click the **SQL Editor** icon on the left sidebar (looks like ">_")
4. Click **"New query"**
5. Open the file `supabase-schema.sql` from this folder
6. Copy ALL the text inside it
7. Paste it into the SQL Editor
8. Click the green **"Run"** button
9. You should see "Success. No rows returned" — that means it worked!

---

## STEP 2: Enable Email Login in Supabase

1. In Supabase, click **Authentication** on the left sidebar
2. Click **Providers**
3. Make sure **Email** is enabled (it should be by default)
4. Done!

---

## STEP 3: Install Node.js on Your Computer

1. Go to https://nodejs.org
2. Download the **LTS version** (the big green button)
3. Install it (just click Next, Next, Next... like any software)
4. To verify: Open **Terminal** (Mac) or **Command Prompt** (Windows)
5. Type: `node --version`
6. If you see a version number like `v20.x.x`, you're good!

---

## STEP 4: Create a GitHub Repository

1. Go to https://github.com/new
2. Repository name: `levion`
3. Keep it **Public**
4. Click **"Create repository"**
5. Keep this page open — you'll need it

---

## STEP 5: Upload Code to GitHub

### Option A: Using GitHub Desktop (Easiest)
1. Download GitHub Desktop: https://desktop.github.com
2. Sign in with your GitHub account
3. Click "Clone a repository" > find your `levion` repo
4. Copy ALL the files from this folder into the cloned folder
5. In GitHub Desktop, type a commit message: "Initial commit"
6. Click "Commit to main"
7. Click "Push origin"

### Option B: Using Terminal (if comfortable)
```
cd path/to/this/levion/folder
git init
git remote add origin https://github.com/YOUR-USERNAME/levion.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

---

## STEP 6: Deploy on Netlify (Free!)

1. Go to https://app.netlify.com
2. Sign up with your **GitHub account**
3. Click **"Add new site"** > **"Import an existing project"**
4. Choose **GitHub**
5. Find and select your **levion** repository
6. In the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
7. Click **"Show advanced"** > **"New variable"**
8. Add these TWO environment variables:
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://hnfqgkuctgwakplkxczk.supabase.co`
   
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuZnFna3VjdGd3YWtwbGt4Y3prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjU1NjksImV4cCI6MjA5MDEwMTU2OX0.4rHzxUVYR77maOftdM6wCSHp-3lHZEPNiRBJ42cOKWs`

9. Click **"Deploy site"**
10. Wait 2-3 minutes for it to build
11. Your app will be live at something like `levion-abc123.netlify.app`

---

## STEP 7: Add Your Site URL to Supabase

1. Go back to Supabase dashboard
2. Click **Authentication** > **URL Configuration**
3. In **Site URL**, enter your Netlify URL (e.g., `https://levion-abc123.netlify.app`)
4. In **Redirect URLs**, add: `https://levion-abc123.netlify.app/auth/callback`
5. Click **Save**

---

## DONE! 🎉

Your Levion app is now live! Open the Netlify URL on your phone,
and you can install it as a PWA (Add to Home Screen).

---

## How to Use:
1. Open the app URL on your phone
2. Sign in with your email (magic link - no password needed!)
3. Go to **Profile** tab and add your medicines (B12, Zinc, Magnesium)
4. Go to **Today** tab and start tracking!

## Need Google Login?
That requires extra setup in Google Cloud Console.
We can add it later as an upgrade.
