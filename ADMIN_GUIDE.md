# Admin Dashboard Guide - Inner Serenity Counselling Centre

## Overview
The admin dashboard provides comprehensive tools for managing the counselling center, tracking clients, managing sessions, and monitoring revenue and performance metrics.

## Accessing the Dashboard

### Admin Login
1. Navigate to `/admin/dashboard` from the main navigation menu
2. Currently demo mode - no authentication required for prototype
3. In production, implement OAuth 2.0 or JWT authentication

### Dashboard Features

## Main Dashboard (Overview Tab)

### Key Metrics
Four primary KPI cards show:
- **Total Clients**: Lifetime client count
- **Active Sessions**: Current month sessions
- **Revenue**: Monthly revenue tracking
- **Completion Rate**: Session success metrics
- **Upcoming**: Today's scheduled sessions

### Charts & Analytics

#### 1. Session & Revenue Trend (Line Chart)
- **Shows**: Last 6 months of sessions and revenue
- **X-Axis**: Months (Jan-Jun)
- **Y-Axis**: Number of sessions / Revenue amount
- **Actions**: Hover for detailed metrics
- **Use Case**: Monitor growth trends, identify peak seasons

#### 2. Session Breakdown (Pie Chart)
- **Shows**: Distribution of session types
- **Types**: Individual, Couples, Family, Group
- **Colors**: Color-coded by type
- **Use Case**: Understand service popularity

#### 3. Today's Sessions
- **Lists**: All scheduled sessions for the current day
- **Shows**: Client name, counsellor assigned, time, status
- **Status Indicators**: Confirmed (green) or Pending (yellow)
- **Actions**: Click to view details or manage session

## Sessions Tab
Manage all counselling sessions:
- View session history
- Track session types and duration
- Monitor no-shows and cancellations
- Add notes and session summaries
- Schedule follow-up sessions

## Clients Tab
Comprehensive client management:
- Search and filter clients
- View client profiles
- Session history
- Contact information
- Treatment progress notes
- Communication history

## Counsellors Tab
Monitor counsellor performance:
- **Metrics Tracked**:
  - Sessions this month
  - Client ratings
  - Revenue generated
  - Specializations
  - Response times
  
- **Performance Indicators**:
  - Star ratings (average client satisfaction)
  - Session completion rates
  - Revenue contribution

## Reports Tab
Generate and export data:
- **Monthly Report**: Detailed metrics for the current month
- **Quarterly Report**: Aggregated data for 3-month periods
- **Export Options**:
  - Client data (CSV)
  - Session records
  - Financial reports
  - Performance metrics

## Live Session Interface (/admin/session)

### Before Starting a Session
1. Verify client information
2. Check previous session notes
3. Review any outstanding recommendations
4. Test video/audio equipment

### During Session

#### Video Controls
- **Start Recording**: Click to begin recording session (for transcription)
- **Video Toggle**: Enable/disable video feed
- **Audio Toggle**: Mute/unmute microphone
- **Session Timer**: Automatic duration tracking

#### Session Notes
- **Live Note Taking**: Type notes during the session
- **Save**: Manually save notes to database
- **AI Summary**: Generate automatic summary (coming soon)

#### Key Points Tracker
- **Add Point**: Type and click "+" or press Enter
- **Display**: Shows bulleted list of key discussion points
- **Use**: Helps maintain focus and document important topics
- **Remove**: Click "×" to delete a point

#### Recommendations & Follow-up
- **Add Recommendation**: Document therapeutic suggestions
- **Track Follow-ups**: Schedule next steps
- **Document**: Create action items for client

#### Client Information Panel
- **Quick Reference**: Client name, contact info, session history
- **Previous Sessions**: Click to view past notes
- **Session Type**: Displays therapy type (individual, couples, etc.)
- **History**: Number of previous sessions

### After Session
1. Complete all notes
2. Summarize key points
3. Document recommendations
4. End session (generates summary)
5. Session data saved automatically

## Key Features

### Real-Time Metrics
- Dashboard updates show live data
- Current session count
- Today's revenue totals
- Upcoming appointments

### Search & Filter
- Search clients by name or ID
- Filter sessions by date, type, counsellor
- Quick access to any record

### Export Capabilities
- Download reports as PDF/CSV
- Share with team
- Archive data
- Compliance documentation

### Session Recording
- Automatic recording available
- Secure storage
- Transcription ready
- Client consent tracking

## Best Practices

### Session Management
1. Always complete notes immediately after session
2. Review previous notes before each session
3. Document follow-up recommendations
4. Track no-shows for pattern analysis
5. Update client progress regularly

### Client Communication
1. Schedule follow-up sessions promptly
2. Send session summaries within 24 hours
3. Document all client interactions
4. Maintain confidentiality
5. Use professional language

### Performance Monitoring
1. Review metrics monthly
2. Identify trends in client satisfaction
3. Recognize high-performing counsellors
4. Address client complaints quickly
5. Plan for growth opportunities

### Data Security
1. Never share client data
2. Use secure connections only
3. Log out when away from desk
4. Report suspicious activity
5. Follow HIPAA guidelines

## Troubleshooting

### Session Recording Won't Start
- Check microphone permissions
- Verify browser supports WebRTC
- Restart video application
- Check internet connection

### Metrics Not Updating
- Refresh page with F5
- Clear browser cache
- Check server connection
- Verify data permissions

### Can't Save Notes
- Ensure internet connection
- Check file size limits
- Verify user permissions
- Try alternative browser

## System Requirements

### Hardware
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Webcam and microphone for sessions
- Stable internet connection
- 4GB+ RAM recommended

### Software
- JavaScript enabled
- Cookies enabled
- Pop-ups allowed for reports
- WebRTC support (for video)

## Security & Privacy

### Data Protection
- All client data encrypted
- Secure SSL/HTTPS connection
- Regular backups
- Access logs maintained
- GDPR compliant

### Session Privacy
- Video sessions encrypted
- Recording protected
- Client consent documented
- Automatic deletion policies
- Audit trail maintained

## Contact & Support

For technical issues:
- Email: admin@innerserenity.com
- Phone: (555) 123-4567
- Chat: In-app support chat
- Hours: Monday-Friday, 9AM-5PM

## Updates & Maintenance

### System Updates
- Scheduled: Monthly security patches
- Downtime: Minimal (2-3 hours)
- Notifications: 48-hour advance notice
- Backup: Automatic daily

### New Features
- Regular enhancements added
- Based on user feedback
- Tested thoroughly
- Training provided

---

**Last Updated**: 2026
**Version**: 1.0
