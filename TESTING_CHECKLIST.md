# Testing Checklist - Inner Serenity Platform

Complete this checklist to verify all features are working correctly.

---

## 1. Quote API Integration

### Quote Display
- [ ] Visit home page (`/`)
- [ ] Verify quote carousel appears with title "Daily Inspiration"
- [ ] Check that a quote is displayed in a card
- [ ] Quote has text and author attribution

### Quote Rotation
- [ ] Note the currently displayed quote
- [ ] Wait 8 seconds
- [ ] Quote should change automatically
- [ ] Wait again - quote should change again

### Manual Navigation
- [ ] Click "Previous" arrow (chevron-left)
- [ ] Quote should go to previous quote
- [ ] Click "Next" arrow (chevron-right)
- [ ] Quote should advance to next quote

### API Fallback
- [ ] Open browser DevTools → Network tab
- [ ] Refresh page
- [ ] Look for API call to `zenquotes.io`
- [ ] If API fails, fallback quotes should display
- [ ] Quotes should still auto-rotate

### Dark Mode
- [ ] Toggle dark mode using mode button (top-right)
- [ ] Quote carousel should be visible and readable
- [ ] Colors should adapt to dark theme

---

## 2. Virtual Meeting System

### Booking Process
- [ ] Click "Book Session" button
- [ ] Complete Step 1: Enter personal info
  - [ ] Name field
  - [ ] Email field
  - [ ] Phone field
  - [ ] Select session type
  - [ ] Enter concerns
  - [ ] Click "Next"

### Meeting URL Generation
- [ ] Complete Step 2: Select date and time
- [ ] Choose a date in the calendar
- [ ] Select an available time slot
- [ ] Click "Next"

### Booking Confirmation
- [ ] Complete Step 3: Review details
- [ ] Verify all information is correct
- [ ] Click "Confirm Booking"
- [ ] Check console (DevTools) for logs:
  - [ ] Should see: "[v0] Confirmation email sent: true"
  - [ ] Should see: "[v0] Calendar synced: true"
  - [ ] Should see: "[v0] Counselor notified: true"

### Success Message
- [ ] Should see "Booking Confirmed!" message
- [ ] Message should include session date and time
- [ ] Toast notification appears briefly

### Meeting Link
- [ ] Open DevTools → Console tab
- [ ] Look for logs containing "meetingUrl"
- [ ] Copy the meeting URL
- [ ] Format should be: `/meeting/booking-XXXXX?token=...`
- [ ] Token should be base64 encoded

---

## 3. Automatic Calendar Synchronization

### Calendar Event Creation
- [ ] Open DevTools → Console
- [ ] After booking, check for log:
  - [ ] "[v0] Calendar synced to counselor calendar"
  - [ ] Should include client name and date

### Conflict Detection
- [ ] Try to book the exact same time twice
- [ ] Should get error: "Time slot conflicts with existing appointment"
- [ ] Console should show conflict detected

### Calendar API Testing
- [ ] Open new browser tab
- [ ] Go to: `http://localhost:3000/api/calendar/sync-booking?counsellorId=default`
- [ ] Should return JSON with calendar events
- [ ] Check "events" array for your booking

### Counselor Notification
- [ ] Check console after booking
- [ ] Look for: "[v0] Counselor notified: true"
- [ ] This confirms notification was triggered

---

## 4. Email Integration

### Confirmation Email
- [ ] Complete a booking
- [ ] Check console for email payload
- [ ] Should contain:
  - [ ] Client name
  - [ ] Session date and time
  - [ ] Meeting URL
  - [ ] Session type and counselor preference

### Counselor Notification
- [ ] Complete booking
- [ ] Check console for second email
- [ ] Should contain:
  - [ ] "New Appointment Confirmed"
  - [ ] Client name
  - [ ] Session date/time
  - [ ] Meeting URL

### Email Templates
- [ ] Check that HTML email includes:
  - [ ] Green (#1B5E20) and orange (#BF5700) colors
  - [ ] Professional formatting
  - [ ] One-click join button
  - [ ] Fallback URL text
  - [ ] Company branding

---

## 5. Booking Page Features

### Date Picker
- [ ] Click on calendar
- [ ] Navigate to different months
- [ ] Select a date
- [ ] Selected date should highlight

### Time Slot Selection
- [ ] After selecting date, time slots appear
- [ ] Slots show availability status
- [ ] Available slots are clickable
- [ ] Booked slots are disabled (if any)

### Form Validation
- [ ] Try to skip fields
- [ ] Error messages should appear
- [ ] Required fields are marked

### Step Navigation
- [ ] Step indicator shows progress (1/4, 2/4, etc.)
- [ ] Progress bar fills as you advance
- [ ] Can go back with "Previous" button
- [ ] Cannot skip steps

---

## 6. Admin Features

### Admin Login
- [ ] Navigate to `/admin/login`
- [ ] You should see admin login page
- [ ] Try test credentials (demo login)
- [ ] Should redirect to admin dashboard

### Admin Navigation
- [ ] From navbar, click "Admin" button
- [ ] Takes you to `/admin/login`
- [ ] Separate from public nav

### Admin Dashboard
- [ ] View bookings list
- [ ] View counselor schedule
- [ ] See booking details
- [ ] (If implemented) See analytics

---

## 7. Dark/Light Mode

### Theme Toggle
- [ ] Click moon/sun icon in navbar (top right)
- [ ] Should show dropdown menu
- [ ] Click "Light Mode"
- [ ] Click "Dark Mode"
- [ ] Click "System Default"

### Visual Changes
- [ ] Background colors change
- [ ] Text colors remain readable
- [ ] All text has sufficient contrast
- [ ] Cards and sections adapt

### Persistence
- [ ] Toggle to dark mode
- [ ] Refresh page
- [ ] Dark mode should persist
- [ ] Toggle to light mode
- [ ] Refresh page
- [ ] Light mode should persist

---

## 8. Responsive Design

### Mobile View
- [ ] Open DevTools → Toggle device toolbar
- [ ] Set to mobile (375px width)
- [ ] All content visible
- [ ] Navigation works on mobile
- [ ] Quotes carousel responsive
- [ ] Booking form responsive

### Tablet View
- [ ] Set device to tablet (768px)
- [ ] Layout adapts properly
- [ ] Multi-column layouts stack single column
- [ ] Touch targets adequate

### Desktop View
- [ ] Full width desktop view (1920px)
- [ ] Multi-column layouts displayed
- [ ] Spacing appropriate
- [ ] No horizontal scrolling

---

## 9. Error Handling

### Network Error Simulation
- [ ] DevTools → Network tab
- [ ] Set throttling to "Offline"
- [ ] Try to load quotes
- [ ] Fallback quotes should display
- [ ] No white screen/errors

### API Errors
- [ ] Check console for error messages
- [ ] Should show clear [v0] prefixed logs
- [ ] User gets friendly error message
- [ ] App doesn't crash

### Form Errors
- [ ] Submit incomplete form
- [ ] Error message appears
- [ ] Can fix and resubmit
- [ ] Form doesn't lose data

---

## 10. Console Logging

### Verify Logging
- [ ] Open DevTools → Console
- [ ] Perform booking
- [ ] Should see multiple [v0] logs:
  - [ ] "[v0] Email sent successfully"
  - [ ] "[v0] Calendar synced"
  - [ ] "[v0] Counselor notified"
  - [ ] Other debug messages

### Log Format
- [ ] All logs start with "[v0]"
- [ ] No red errors unless expected
- [ ] Warnings are informational
- [ ] Logs help understand flow

---

## 11. Performance

### Page Load
- [ ] Home page loads < 3 seconds
- [ ] Booking page loads quickly
- [ ] Admin page responsive
- [ ] No flickering

### API Response
- [ ] Calendar API responds < 500ms
- [ ] Quote API responds < 1 second
- [ ] Email endpoints respond quickly
- [ ] No timeout errors

---

## 12. Browser Compatibility

### Chrome/Edge
- [ ] All features work
- [ ] No console errors
- [ ] Smooth animations

### Firefox
- [ ] All features work
- [ ] Console clean
- [ ] Styles correct

### Safari
- [ ] All features work
- [ ] Layout responsive
- [ ] Touch events work

---

## Final Verification Checklist

Before declaring system ready:

### Features Complete
- [ ] Quote API working
- [ ] Meeting URLs generated
- [ ] Calendar synced
- [ ] Emails sent (in console)
- [ ] Admin accessible
- [ ] Dark mode working

### Code Quality
- [ ] No console errors
- [ ] No red warnings
- [ ] [v0] logs informative
- [ ] Code well-organized

### User Experience
- [ ] Booking flow intuitive
- [ ] Error messages helpful
- [ ] Responsive on all sizes
- [ ] Theme toggle smooth

### Documentation
- [ ] README_PROJECT.md accurate
- [ ] FEATURES_IMPLEMENTED.md complete
- [ ] IMPLEMENTATION_GUIDE.md useful
- [ ] Code comments clear

### Ready for Deployment
- [ ] All tests pass
- [ ] No TODOs in code
- [ ] Environment variables ready
- [ ] Database schema planned

---

## Test Scenarios

### Scenario 1: Happy Path
1. Visit home page
2. View quotes
3. Book a session
4. Confirm booking
5. Check console logs
6. Verify all three systems work

### Scenario 2: Conflict Testing
1. Book a session for 2 PM Monday
2. Try to book 2 PM Monday again
3. Should be prevented
4. Select different time
5. Should succeed

### Scenario 3: Mobile Booking
1. Open on mobile device/emulation
2. Complete booking on mobile
3. All steps responsive
4. Confirm works
5. Meeting URL generated

### Scenario 4: Theme Switching
1. Start in light mode
2. Book session
3. Toggle to dark mode
4. Booking page visible
5. Toggle back to light
6. All visible and styled correctly

---

## Known Limitations (Current Build)

- **Email**: Currently logs to console. Add RESEND_API_KEY to send real emails
- **Calendar**: In-memory storage. Add database for persistence
- **Video**: URLs generated but no actual video yet. Integrate Jitsi Meet or Daily.co
- **Admin**: Login functional but no password security. Add proper auth

---

## Debug Commands

### Check Calendar Events
Open DevTools console and run:
```javascript
fetch('/api/calendar/sync-booking?counsellorId=default')
  .then(r => r.json())
  .then(d => console.log(d))
```

### Validate Token
```javascript
import { validateMeetingToken } from '@/lib/meeting-service'
// (won't work in console, but shows how)
```

### Test Quote API
```javascript
fetch('https://zenquotes.io/api/random')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## Troubleshooting

### Quotes Don't Load
1. Check network tab for API call
2. Verify API response has `q` and `a` fields
3. Check console for errors
4. Try manual refresh
5. Check fallback quotes display

### Calendar Conflicts Not Working
1. Check calendar API returns events
2. Verify date/time format matches
3. Try booking different time
4. Check counselor availability hours

### Email Not Sent
1. Add RESEND_API_KEY to environment
2. Check API response in console
3. Verify email template HTML
4. Check for rate limiting

### Meeting Link Invalid
1. Verify token format (base64)
2. Check token age (< 24 hours)
3. Verify bookingId matches token
4. Check validateMeetingToken function

---

## Sign-Off

- [ ] All tests passed
- [ ] No critical issues
- [ ] Team approval obtained
- [ ] Ready for production deployment

**Tested By**: ________________  
**Date**: ________________  
**Version**: 1.0  

---

**For detailed feature documentation, see `FEATURES_IMPLEMENTED.md`**
