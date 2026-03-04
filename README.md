# Inner Serenity Counselling Centre - Web Application

A modern, responsive counselling center website built with Next.js, TypeScript, and Tailwind CSS featuring real-time chat support, session booking with calendar integration, and smooth scroll animations.

## Features

### Core Features
- **Professional Branding**: Elegant lotus logo and "Inner Serenity" branding throughout
- **Responsive Design**: Mobile-first approach optimized for all device sizes
- **Dark/Light Mode**: Theme toggle with persistent user preference
- **Smooth Animations**: Framer Motion-powered scroll animations and page transitions

### Pages
- **Home**: Hero section with inspirational quotes carousel, services overview, mood tracker
- **About**: Team profiles, mission/vision, core values, why choose us
- **Services**: 6+ counselling services with pricing, duration, and booking links
- **Resources**: Free mental health guides, workbooks, and educational materials
- **Booking**: Full calendar with availability, time slot selection, and email confirmation
- **Chat**: AI-powered customer support chat with context-aware responses
- **Contact**: Contact information and message form

### Functionality
- **Smart Calendar**: Shows available/booked dates and times, prevents double-booking
- **Email Integration**: Automatic booking confirmations via Resend
- **AI Chat Support**: OpenAI-powered customer service with domain knowledge
- **Form Validation**: Client-side and server-side validation
- **Session Tracking**: Visual indicators for booking status

## Technology Stack

### Frontend
- **Next.js 15+**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn/UI**: Pre-built accessible components
- **Framer Motion**: Advanced animations
- **AI SDK**: Vercel AI SDK for chat functionality

### Backend
- **Next.js API Routes**: Serverless functions
- **Resend**: Email service for confirmations
- **OpenAI**: GPT-4o for chat intelligence

## Project Structure

```
.
├── app/
│   ├── layout.tsx              # Root layout with navbar/footer
│   ├── page.tsx                # Home page
│   ├── about/
│   ├── services/
│   ├── resources/
│   ├── contact/
│   ├── booking/
│   ├── chat/
│   └── api/
│       ├── chat/route.ts       # Chat API endpoint
│       └── email/
│           └── send-confirmation/ # Email sending endpoint
├── components/
│   ├── navbar.tsx              # Navigation with active links
│   ├── logo.tsx                # Lotus logo component
│   ├── hero.tsx                # Hero section with animations
│   ├── animated-scroll.tsx     # Scroll animation components
│   └── ...other components
├── lib/
│   ├── constants.ts            # Centralized constants and data
│   ├── types.ts                # TypeScript types
│   ├── helpers.ts              # Utility functions
│   ├── email.ts                # Email templates
│   └── animations.ts           # Framer Motion variants
├── public/                     # Static assets
└── styles/                     # Global styles

```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd inner-serenity
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:
```
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
```

4. Run development server:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Configuration

### Available Constants
Edit `/lib/constants.ts` to customize:
- Center name, contact info, hours
- Services and pricing
- Mock availability dates
- Booked time slots

### Email Templates
Modify `/lib/email.ts` to customize:
- Email subject lines
- Booking confirmation content
- Email styling

## Testing

### Manual Testing
See `/TESTING.md` for comprehensive test checklist covering:
- Navigation and routing
- Animations and transitions
- Booking system
- Chat functionality
- Email integration
- Responsive design

### Automated Testing
```bash
node scripts/verify-setup.js  # Verify all files exist
```

## Performance Optimizations

- Images use `next/image` for optimization
- Components use `React.memo` where appropriate
- Animations are GPU-accelerated with Framer Motion
- API routes are optimized with streaming responses
- Tailwind CSS is tree-shaken for minimal bundle size

## Accessibility

- WCAG 2.1 AA compliant color contrast
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android latest

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
1. Build: `npm run build`
2. Start: `npm run start`

Set environment variables on your hosting platform.

## API Documentation

### POST /api/chat
Streams chat responses using AI SDK.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Can I book a session?" }
  ]
}
```

**Response:** Streaming text response

### POST /api/email/send-confirmation
Sends booking confirmation email.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "date": "2026-03-10T10:00:00Z",
  "time": "10:00 AM",
  "sessionType": "virtual"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Confirmation email sent successfully"
}
```

## Contributing

Guidelines for contributing:
1. Follow existing code style
2. Use TypeScript for type safety
3. Add tests for new features
4. Update documentation

## License

Proprietary - Inner Serenity Counselling Centre

## Support

For issues or questions:
- Email: support@innerserenity.com
- Phone: +1 (555) 123-4567
- Hours: Mon-Fri 9AM-7PM, Sat 10AM-4PM

## Troubleshooting

### Chat not responding
- Verify `OPENAI_API_KEY` is set
- Check OpenAI account has available credits
- Review browser console for errors

### Emails not sending
- Verify `RESEND_API_KEY` is set
- Check email address is valid
- Review `/app/api/email/send-confirmation/route.ts`

### Animations not smooth
- Check browser hardware acceleration is enabled
- Disable browser extensions
- Try a different browser

---

Built with ❤️ for mental health and inner serenity.
