# Inner Serenity Counselling Centre - Testing Guide

## Test Checklist

### Navigation & Routing
- [x] Home page loads at `/`
- [x] About page loads at `/about` with active link indicator
- [x] Services page loads at `/services` with active link indicator
- [x] Booking page loads at `/booking` with calendar interface
- [x] Resources page loads at `/resources`
- [x] Contact page loads at `/contact` with form
- [x] Chat page loads at `/chat`
- [x] Logo/brand name click returns to home
- [x] Mobile menu toggle works correctly

### Animations
- [x] Fade-in animations on scroll for sections
- [x] Hero cards have staggered entrance animations
- [x] Hero cards have hover effects (slight lift)
- [x] Smooth page transitions
- [x] Scroll animations trigger when elements enter viewport

### Booking System
- [ ] Calendar displays available dates
- [ ] Can select a date with availability
- [ ] Time slots show for selected date
- [ ] Can select available time slot
- [ ] Cannot select booked time slots
- [ ] Form validates all required fields
- [ ] Submission sends confirmation email
- [ ] Email contains booking details
- [ ] Confirmation message displays to user

### Chat Functionality
- [ ] Chat interface loads
- [ ] Can type messages
- [ ] Messages send to AI API
- [ ] AI responses appear in chat
- [ ] Chat is context-aware about services
- [ ] Loading state shows while waiting for response

### Email Integration
- [ ] Booking confirmation emails send
- [ ] Contact form can submit
- [ ] Email templates are formatted correctly
- [ ] Environment variables are properly configured

### UI/UX
- [ ] Responsive design on mobile (< 768px)
- [ ] Responsive design on tablet (768px - 1024px)
- [ ] Responsive design on desktop (> 1024px)
- [ ] Dark/light mode toggle works
- [ ] Theme persists on reload
- [ ] All text is readable with good contrast
- [ ] Images load correctly

### Performance
- [ ] Page loads within 3 seconds
- [ ] Animations are smooth (60fps)
- [ ] No console errors
- [ ] No console warnings

### SEO & Accessibility
- [ ] All pages have proper metadata
- [ ] Images have alt text
- [ ] Form labels are properly associated
- [ ] Color contrast meets WCAG standards
- [ ] Keyboard navigation works

## How to Test

1. **Navigation**: Click through all links in navbar
2. **Animations**: Scroll down each page and observe fade-in effects
3. **Booking**: 
   - Go to `/booking`
   - Select a date with availability
   - Choose a time slot
   - Fill in all form fields
   - Submit and check email
4. **Chat**: 
   - Go to `/chat`
   - Type a test message
   - Verify AI response
5. **Responsive**: Use browser dev tools to test different screen sizes

## Known Limitations

- Booking system uses mock data for demonstration
- Email integration requires RESEND_API_KEY
- Chat requires OPENAI_API_KEY
- Some images use placeholder URLs

## Environment Variables Required

```
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
```
