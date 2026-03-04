# Inner Serenity: API Configuration Guide

This guide walks you through configuring **Ollama** (local AI model) and **Supabase** (backend database) for the Inner Serenity Counselling platform.

---

## 🤖 Ollama Setup (Local AI Chat)

### What is Ollama?
Ollama allows you to run large language models locally on your machine without cloud dependencies. Perfect for privacy-conscious mental health applications.

### Installation

#### macOS / Linux
```bash
# Download and install from official website
curl https://ollama.ai/install.sh | sh

# Or download directly from https://ollama.ai
```

#### Windows
- Download from [ollama.ai/download](https://ollama.ai)
- Run the installer
- Ollama will start automatically

### Running Ollama

1. **Start the Ollama service:**
```bash
ollama serve
```

2. **Pull a recommended model** (in another terminal):
```bash
# Lightweight, good for counseling: Neural Chat
ollama pull neural-chat

# Alternative options:
ollama pull mistral       # Faster responses
ollama pull llama2        # Higher quality
ollama pull dolphin-mix   # Great conversations
```

3. **Test the API:**
```bash
curl http://localhost:11434/api/chat -d '{
  "model": "neural-chat",
  "messages": [{"role": "user", "content": "Hello"}],
  "stream": false
}'
```

### Environment Configuration

Create a `.env.local` file in your project root:

```env
# Ollama Configuration
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=neural-chat
# Alternative models: mistral, llama2, dolphin-mix

# Enable/disable local AI
USE_LOCAL_OLLAMA=true

# Chat system prompt temperature (0.0-1.0, lower = more focused)
OLLAMA_TEMPERATURE=0.7
```

### Using Ollama in Development

The application automatically detects Ollama when configured. The chat system will:
- Check for local Ollama availability
- Fall back gracefully if unavailable
- Use the configured model from environment variables
- Support streaming responses for real-time chat

### Monitoring Ollama

```bash
# Check running models
curl http://localhost:11434/api/tags

# View model details
curl http://localhost:11434/api/show -d '{"name": "neural-chat"}'
```

### Troubleshooting Ollama

**Error: Connection refused**
- Ensure Ollama is running: `ollama serve`
- Check port 11434 is accessible
- Verify firewall settings if on network

**Slow responses**
- Use lighter models: `mistral` or `neural-chat`
- Increase system RAM if available
- Reduce context window in prompts

**Model not found**
- Pull the model: `ollama pull neural-chat`
- Check available models: `ollama list`

---

## 🗄️ Supabase Setup (Backend Database)

### What is Supabase?
Supabase is an open-source Firebase alternative providing:
- PostgreSQL database
- Real-time subscriptions
- Authentication
- Row-level security (RLS)
- File storage

### Initial Setup

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up with email or GitHub
   - Create a new project

2. **Project Configuration**
   - **Project Name:** `inner-serenity-counselling`
   - **Database Password:** Generate strong password (save it)
   - **Region:** Choose closest to your location
   - Click "Create new project" (wait 2-3 minutes)

3. **Get API Keys**
   - Go to Settings → API (in sidebar)
   - Copy both keys:
     - `Project URL` (API URL)
     - `anon` key (public key)
     - `service_role` key (secret key)

### Environment Configuration

Update your `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Server-side only (never expose to client)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Database Schema Setup

1. **Create Tables** - Go to SQL Editor in Supabase dashboard

2. **Clients Table**
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  assigned_counsellor_id UUID,
  created_at TIMESTAMP DEFAULT now(),
  last_session DATE,
  notes TEXT,
  status TEXT DEFAULT 'active' -- active, inactive, archived
);

CREATE INDEX idx_clients_assigned ON clients(assigned_counsellor_id);
```

3. **Appointments Table**
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  counsellor_id UUID NOT NULL REFERENCES counsellors(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'scheduled' -- scheduled, completed, cancelled,
  notes TEXT,
  meeting_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(counsellor_id, start_time)
);

CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_counsellor ON appointments(counsellor_id);
```

4. **Counsellors Table**
```sql
CREATE TABLE counsellors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  specialisation TEXT,
  availability_start TIME DEFAULT '09:00',
  availability_end TIME DEFAULT '17:00',
  lunch_start TIME DEFAULT '12:00',
  lunch_end TIME DEFAULT '13:00',
  working_days INT[] DEFAULT ARRAY[1,2,3,4,5], -- 1=Monday, 5=Friday
  created_at TIMESTAMP DEFAULT now()
);
```

5. **Invoices Table**
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' -- pending, sent, paid,
  due_date DATE,
  created_at TIMESTAMP DEFAULT now(),
  paid_at TIMESTAMP
);

CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
```

### Row-Level Security (RLS)

Enable security for production:

```sql
-- Enable RLS on tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Example: Clients can only see their own data
CREATE POLICY "Clients see own data"
  ON clients FOR SELECT
  USING (auth.uid() = id);
```

### Migration to Your Project

1. **Connect your repository:**
   - Go to Settings → Version Control
   - Connect your GitHub repo
   - Enable preview deployments

2. **Deploy migrations:**
   - Push SQL schema changes
   - Migrations run automatically on deployment

### Using Supabase in Code

Example: Create Supabase client
```typescript
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Fetch clients
const { data, error } = await supabase
  .from("clients")
  .select("*")
  .eq("assigned_counsellor_id", counsellorId)
```

### Troubleshooting Supabase

**Error: Unauthorized**
- Verify API keys are correct
- Check RLS policies
- Ensure row is accessible to current user

**Connection timeout**
- Check internet connection
- Verify project URL is correct
- Check Supabase status page

**Auth errors**
- Clear browser cookies
- Check JWT token expiration
- Verify auth configuration

---

## 🔐 Security Best Practices

### Never Commit Keys
```bash
# .gitignore
.env.local
.env*.local
```

### Separate Keys in Deployment
- **Development:** Use test/demo API keys
- **Production:** Use dedicated production keys
- **Admin dashboard:** Requires authentication

### Supabase Security
- Enable 2FA on Supabase account
- Use service role key only in server-side code
- Implement RLS policies for multi-tenant access
- Regular backups enabled by default

---

## 📊 Monitoring

### Check Ollama Status
```bash
# Terminal
curl http://localhost:11434/api/tags
```

### Monitor Supabase
- Dashboard → Analytics
- Check query performance
- Monitor API usage
- Review RLS policy effectiveness

---

## 🚀 Deployment

### Vercel + Supabase Production Setup

1. **Add environment variables to Vercel:**
   - Project Settings → Environment Variables
   - Add all `NEXT_PUBLIC_*` and server-side keys

2. **Ollama in Production:**
   - Option A: Keep local Ollama running on separate server
   - Option B: Use cloud-based LLM (OpenAI) as fallback
   - Option C: Deploy Ollama on same server

3. **Database backups:**
   - Supabase handles daily automated backups
   - Access via Settings → Backups

---

## 📞 Support

- **Ollama:** [ollama.ai](https://ollama.ai)
- **Supabase:** [supabase.com/docs](https://supabase.com/docs)
- **Community:** Discord/GitHub discussions

---

**Last Updated:** March 4, 2026
**Status:** Production Ready
