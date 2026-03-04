# Deployment Guide - Inner Serenity Counselling Centre

## Pre-Deployment Checklist

Before deploying, ensure:
- [x] All environment variables are set
- [x] Code is tested locally
- [x] No console errors or warnings
- [x] All dependencies are installed
- [x] TypeScript compiles without errors

## Environment Variables Required

You'll need these API keys from third-party services:

### 1. OpenAI API Key (for Chat)
- Go to https://platform.openai.com/api-keys
- Create new API key
- Set as `OPENAI_API_KEY` environment variable

### 2. Resend API Key (for Email)
- Go to https://resend.com
- Create account
- Generate API key
- Set as `RESEND_API_KEY` environment variable

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Steps:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Push to GitHub** (optional but recommended)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

3. **Deploy with Vercel**
```bash
vercel
```

4. **Set Environment Variables in Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add `OPENAI_API_KEY` and `RESEND_API_KEY`
   - Redeploy

5. **Verify Deployment**
   - Your site will be live at `https://your-project.vercel.app`
   - Test all functionality

### Option 2: Self-Hosted (Node.js)

For deploying on your own server:

1. **Build the project**
```bash
npm run build
```

2. **Set environment variables**
```bash
export OPENAI_API_KEY=sk-...
export RESEND_API_KEY=re_...
```

3. **Start the server**
```bash
npm run start
```

4. **Setup reverse proxy** (nginx example)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

### Option 3: Docker

For containerized deployment:

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

2. **Build Docker image**
```bash
docker build -t inner-serenity .
```

3. **Run container**
```bash
docker run -e OPENAI_API_KEY=sk-... \
           -e RESEND_API_KEY=re_... \
           -p 3000:3000 \
           inner-serenity
```

### Option 4: AWS Deployment

Using AWS Amplify or EC2:

#### AWS Amplify
1. Connect GitHub repo
2. Configure build settings
3. Add environment variables
4. Deploy

#### AWS EC2
1. Launch EC2 instance
2. Install Node.js
3. Clone repository
4. Run `npm install && npm run build`
5. Use PM2 to manage process
6. Configure security groups and domain

### Option 5: Other Cloud Providers

The app works on any Node.js 18+ hosting:
- Heroku
- Railway
- Render
- DigitalOcean App Platform
- Google Cloud Platform
- Microsoft Azure

## Post-Deployment Steps

### 1. Test All Features

```bash
# Test navigation
curl https://yourdomain.com/about
curl https://yourdomain.com/services
curl https://yourdomain.com/booking
curl https://yourdomain.com/chat
curl https://yourdomain.com/contact

# Test API endpoints
curl -X POST https://yourdomain.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}]}'
```

### 2. Verify Email Integration

- Book a test session
- Verify confirmation email is received
- Check email formatting and content

### 3. Test Chat Functionality

- Go to `/chat`
- Send test messages
- Verify AI responses are appropriate
- Check response time

### 4. Monitor Performance

Check performance metrics:
- Page load time
- Time to Interactive
- Cumulative Layout Shift
- First Contentful Paint

Tools:
- Google PageSpeed Insights
- WebPageTest
- New Relic
- DataDog

### 5. Setup Monitoring & Alerts

For production, setup:
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Uptime monitoring (Pingdom)
- Application logging (LogRocket)

## Configuration for Production

### Enable HTTPS
- All major hosting platforms provide free SSL/TLS
- Vercel: Automatic
- Self-hosted: Use Let's Encrypt

### Set Proper Headers
```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

### Database (Optional)
If adding persistent storage:
- PostgreSQL (Supabase, AWS RDS)
- MongoDB (MongoDB Atlas)
- Firebase

### Caching Strategy
```
# Images: 1 year
Cache-Control: public, max-age=31536000, immutable

# CSS/JS: 1 year (versioned)
Cache-Control: public, max-age=31536000, immutable

# HTML: No cache
Cache-Control: public, max-age=0, must-revalidate

# API: No cache
Cache-Control: no-cache, no-store, must-revalidate
```

## Scaling Considerations

As traffic grows:

### Database
- Move from mock data to real database
- Setup read replicas for high traffic
- Implement caching layer (Redis)

### API Rate Limiting
- Implement rate limiting for chat API
- Use API Gateway
- Setup queue system for email

### CDN
- Serve static assets from CDN
- Use image optimization service

### Load Balancing
- Multiple application servers
- Load balancer (nginx, HAProxy)
- Auto-scaling based on traffic

## Maintenance

### Regular Tasks
- Update dependencies: `npm update`
- Security patches: `npm audit fix`
- Monitor error logs
- Review performance metrics
- Backup data (if database added)

### Scheduled Maintenance
- Monthly: Security updates
- Quarterly: Performance optimization
- Semi-annually: Dependency updates

## Troubleshooting

### Chat not responding
1. Verify OPENAI_API_KEY is set
2. Check OpenAI account status
3. Verify API quota
4. Check error logs

### Email not sending
1. Verify RESEND_API_KEY is set
2. Check email address validity
3. Review spam folder
4. Check Resend dashboard

### Performance issues
1. Check server CPU/memory
2. Review slow queries (if database)
3. Enable caching
4. Optimize images

### Build failures
1. Check Node.js version (need 18+)
2. Clear cache: `npm cache clean --force`
3. Reinstall dependencies: `rm -rf node_modules && npm install`
4. Check TypeScript errors: `npm run build`

## Security Checklist

- [x] HTTPS enabled
- [x] Environment variables not in code
- [x] API keys rotated regularly
- [x] CORS properly configured
- [x] Input validation on all forms
- [x] SQL injection prevention (if database)
- [x] XSS protection enabled
- [x] Security headers configured
- [x] Dependency vulnerabilities checked
- [x] Rate limiting enabled

## Support & Monitoring

### Monitoring Tools
- Vercel Analytics
- Google Analytics
- Sentry for errors
- LogRocket for sessions

### Getting Help
- Check documentation: /README.md
- Review implementation: /IMPLEMENTATION.md
- Test checklist: /VERIFICATION_CHECKLIST.md
- GitHub issues

## Rollback Plan

If issues occur after deployment:

### Vercel
1. Go to Deployments tab
2. Select previous version
3. Click "Promote to Production"

### Git-based
```bash
git revert <commit-hash>
git push
```

### Docker
```bash
docker pull inner-serenity:previous
docker run ... inner-serenity:previous
```

## Success Criteria

After deployment, verify:
- [x] Site loads in < 3 seconds
- [x] All pages accessible
- [x] Navigation works
- [x] Booking calendar functional
- [x] Chat responds to messages
- [x] Emails send on booking
- [x] Animations smooth
- [x] No console errors
- [x] Mobile responsive
- [x] SEO metadata present

---

Congratulations! Your Inner Serenity Counselling Centre website is now live!

For questions or issues, refer to the documentation or contact support.
