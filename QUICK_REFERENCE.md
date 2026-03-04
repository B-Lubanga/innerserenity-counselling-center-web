# Quick Reference - Inner Serenity Setup

## 🚀 30-Second Start

### Start the Application
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Start Ollama (AI Chat)
```bash
# Terminal 1: Start service
ollama serve

# Terminal 2: Download model
ollama pull neural-chat
```

---

## 🔑 Environment Variables (.env.local)

```env
# Ollama (Local AI)
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=neural-chat
USE_LOCAL_OLLAMA=true

# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-key
SUPABASE_SERVICE_ROLE_KEY=your-secret-key
```

---

## 📋 What Changed (Latest Update)

| Item | Change | Location |
|------|--------|----------|
| **Navigation** | Cleaned up, removed clutter | `/components/navbar.tsx` |
| **Images** | African-focused therapy photos | `/public/images/therapy-*.jpg` |
| **Videos** | Added 4 YouTube mindfulness links | `/app/resources/page.tsx` |
| **Scroll** | Auto scroll-to-top on page change | `/components/scroll-to-top.tsx` |
| **Docs** | Full API setup guide | `/API_CONFIGURATION.md` |

---

## 🤖 Ollama Quick Commands

```bash
# List installed models
ollama list

# Download a model
ollama pull neural-chat    # Recommended
ollama pull mistral        # Fast
ollama pull llama2         # High quality

# Test API
curl http://localhost:11434/api/tags

# Remove model
ollama rm neural-chat
```

---

## 🗄️ Supabase Quick Setup

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy keys from Settings → API
4. Paste in `.env.local`
5. Run SQL from `/API_CONFIGURATION.md`

---

## 📱 Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page with hero |
| Services | `/services` | Service offerings |
| Booking | `/booking` | Schedule appointments |
| Chat | `/chat` | AI chat support |
| Resources | `/resources` | Guides + YouTube videos |
| Admin Login | `/admin/login` | Staff access |
| Admin Dashboard | `/admin/dashboard` | Management interface |

---

## 🎨 Design System

**Colors:**
- Primary: Sage Green (#a7d8c8)
- Accent: Burnt Orange (#d97706)
- Background: White/Dark Gray
- Text: Dark Gray/White

**Typography:**
- Font: Inter (Google Fonts)
- Headings: Bold
- Body: Regular

---

## 🔐 Security Checklist

- [ ] Never commit `.env.local`
- [ ] Use different keys for dev/prod
- [ ] Enable RLS on Supabase tables
- [ ] Use service role key only on server
- [ ] Keep Ollama behind firewall in prod

---

## 🐛 Troubleshooting

### Ollama not responding
```bash
# Check if running
curl http://localhost:11434/api/tags

# Restart
# Kill process and run: ollama serve
```

### Supabase connection fails
- Verify URL in `.env.local`
- Check API key is correct
- Test connection in browser console:
  ```javascript
  fetch('https://your-url/rest/v1/')
  ```

### Images not loading
- Check `/public/images/` folder
- Run `npm run build`
- Clear browser cache

### Chat not working
- Ensure Ollama is running
- Check model is downloaded: `ollama list`
- Try different model: `ollama pull mistral`

---

## 📊 Admin Dashboard Features

- **Dashboard:** KPIs, charts, sessions overview
- **Calendar:** Schedule/edit appointments
- **Clients:** Manage client database, assign to counselors
- **Invoices:** Generate and send invoices
- **Records:** Track patient history and progress

---

## 🎥 YouTube Videos Added

1. 10-Minute Mindfulness Meditation
2. What is Counselling & How Can It Help?
3. 5-Minute Anxiety Relief Breathing
4. Power of Self-Compassion in Healing

Find them on `/resources` page

---

## 📚 Documentation Files

- **`/API_CONFIGURATION.md`** - Complete setup guide (353 lines)
- **`/LATEST_UPDATES.md`** - What changed (222 lines)
- **`/QUICK_REFERENCE.md`** - This file

---

## ✨ Key Features

✅ Clean navigation header
✅ African-focused imagery
✅ Local AI chat (Ollama)
✅ Admin dashboard
✅ Calendar management
✅ Client assignment
✅ Invoice system
✅ YouTube resources
✅ Dark/light mode
✅ Mobile responsive
✅ Scroll-to-top on navigation
✅ Production-ready code

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Deploy from Vercel dashboard
# Set environment variables in project settings
```

### Environment Variables on Vercel
- Add all keys from `.env.local`
- Keep production keys separate from dev
- Never expose service role key to client

---

**Last Updated:** March 4, 2026
**Version:** 2.0
**Status:** Production Ready ✅
