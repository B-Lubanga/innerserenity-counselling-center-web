# Inner Serenity Counselling Centre - Quick Start Guide

## Overview
Inner Serenity Counselling Centre is a fully responsive, professionally designed mental health counselling platform with booking, chat support, and admin dashboard capabilities.

## Key Features

### Public Website
- **Home Page**: Hero section with real images, inspirational quotes carousel, services overview
- **About Page**: Mission, values, team information
- **Services Page**: Detailed service offerings with pricing
- **Booking System**: Interactive calendar with real-time availability and email confirmation
- **Chat Support**: AI-powered customer support for services, mental wellness, and FAQs
- **Resources Page**: Mental health articles and downloadable resources
- **Contact Page**: Contact form and counsellor information
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### Admin Dashboard
- **Secure Login**: Email and password authentication (demo: admin@innerserenity.com / admin123)
- **Dashboard Overview**: Real-time KPIs, analytics charts, session metrics
- **Session Management**: Schedule, notes, transcription summaries
- **Client Database**: Manage client information and history
- **Reporting**: Generate monthly/quarterly reports with metrics

## Color Scheme
- **Primary**: Jungle Green (#1B5E20)
- **Accent**: Burnt Orange (#BF5700)
- **Neutral**: Black, Cream, Light Gray
- **Dark Mode**: Deep greens with cream text

## User Journeys

### Client Journey
1. Visit website → Browse services
2. Click "Chat Support" to ask questions or get information
3. Click "Book Session" to select date/time from calendar
4. Fill in personal details
5. Review booking and confirm
6. Receive confirmation email with session details

### Counsellor Journey
1. Click "Admin" button in navbar
2. Login with credentials
3. View today's schedule and client information
4. Take session notes during appointments
5. View session transcription summaries
6. Generate reports and track metrics

## Dark/Light Mode
- Toggle between light and dark themes using the theme toggle button in navbar
- Themes automatically adapt to system preference or manual selection
- All colors are optimized for both light and dark modes

## Chat Features
The AI chat system intelligently handles:
- **Service Inquiries**: Questions about counselling services and pricing
- **Booking Questions**: How to book sessions and availability
- **Mental Wellness**: Tips for mental health and self-care
- **Customer Service**: General questions and support
- **Escalation**: Routes complex issues to human representatives

## Installation & Deployment

### Prerequisites
- Node.js 18+
- npm or yarn
- Vercel account (for deployment)

### Setup
```bash
# Install dependencies
npm install

# Set environment variables
# Required:
# - OPENAI_API_KEY: For chat functionality
# - RESEND_API_KEY: For email confirmations (optional)

# Run development server
npm run dev

# Build for production
npm run build
```

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with one click

## Admin Access
- **Login URL**: /admin/login
- **Dashboard URL**: /admin/dashboard
- **Demo Email**: admin@innerserenity.com
- **Demo Password**: admin123

**Note**: In production, use a proper authentication system with secure password hashing.

## File Structure
```
app/
├── page.tsx                 # Home page
├── booking/page.tsx         # Booking system
├── chat/page.tsx           # Chat interface
├── about/page.tsx          # About page
├── services/page.tsx       # Services page
├── resources/page.tsx      # Resources page
├── contact/page.tsx        # Contact page
├── admin/
│   ├── login/page.tsx      # Admin login
│   ├── dashboard/page.tsx  # Admin dashboard
│   ├── session/page.tsx    # Session interface
│   └── layout.tsx          # Admin layout
├── api/
│   ├── chat/route.ts       # Chat API
│   └── email/send-confirmation/route.ts  # Email API
└── layout.tsx              # Root layout

components/
├── navbar.tsx              # Navigation bar
├── hero.tsx               # Hero section
├── quotes-carousel.tsx    # Quotes carousel
├── services.tsx           # Services component
├── booking-cta.tsx        # Booking call-to-action
└── mode-toggle.tsx        # Theme toggle

lib/
├── constants.ts           # App constants and data
├── helpers.ts            # Utility functions
├── chat-system.ts        # Chat logic
└── admin-types.ts        # Admin types and interfaces
```

## Customization

### Branding
- Update logo in `/components/logo.tsx`
- Change center name in navbar and throughout the app
- Update contact information in `/lib/constants.ts`

### Colors
- Modify color scheme in `/app/globals.css`
- Update Tailwind colors in `/tailwind.config.ts`

### Content
- Update services, pricing, and team info in `/lib/constants.ts`
- Modify page content in respective page files
- Update quotes in `/lib/constants.ts`

### Images
- Replace hero images in `/public/images/`
- Update image paths in component files

## Troubleshooting

### Chat Not Working
- Ensure `OPENAI_API_KEY` is set in environment variables
- Check browser console for error messages
- Verify API endpoint is `/api/chat`

### Dark Mode Not Switching
- Clear browser cache and cookies
- Check if `next-themes` is properly installed
- Verify `ThemeProvider` is in layout.tsx

### Email Confirmations Not Sending
- Set `RESEND_API_KEY` in environment variables
- Check email verification in Resend dashboard
- Review API logs for errors

### Admin Dashboard Not Accessible
- Clear localStorage to reset login state
- Use correct credentials: admin@innerserenity.com / admin123
- Check browser console for authentication errors

## Support & Documentation
- See `/README.md` for technical documentation
- See `/ADMIN_GUIDE.md` for admin dashboard features
- See `/IMPLEMENTATION_COMPLETE.md` for architecture details

## Version History
- **v1.0.0**: Initial release with full feature set
  - Responsive booking system with calendar
  - AI-powered chat support
  - Admin dashboard with session management
  - Dark/light theme support
  - Email confirmation integration
  - Analytics and reporting
