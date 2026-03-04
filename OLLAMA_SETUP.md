# Ollama Setup Guide for Inner Serenity Chat

## Quick Start

### Step 1: Install Ollama
1. Visit [ollama.ai](https://ollama.ai)
2. Download for your operating system
3. Run the installer and complete setup

### Step 2: Download a Model
Open terminal/command prompt and run:
```bash
ollama pull mistral
```

Alternative models (each ~4-7GB):
- `ollama pull llama2` - Meta's Llama 2 (70B parameters)
- `ollama pull neural-chat` - Intel's Neural Chat (7B)
- `ollama pull dolphin-mistral` - Optimized Mistral variant

### Step 3: Start Ollama Service
```bash
ollama serve
```

This starts the Ollama API server at `http://localhost:11434`

### Step 4: Configure Environment
In your project's `.env.local` file, add:
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

### Step 5: Test the Chat
1. Navigate to `/chat` on your local server
2. Type a message
3. You should receive a response from Ollama

---

## Troubleshooting

### Chat Not Working?
1. Verify Ollama is running: `curl http://localhost:11434/api/tags`
2. Check model is installed: Look for it in Ollama's model list
3. Check environment variables are set
4. Restart dev server after env changes

### Slow Responses?
- Ollama is CPU/GPU intensive
- First response may be slower (model loading)
- Ensure sufficient RAM available
- Consider using a smaller model (neural-chat instead of mistral)

### Port Already in Use?
Default is 11434. To change:
1. Find what's using the port
2. Either kill that process or configure Ollama to use different port
3. Update OLLAMA_BASE_URL in env

### Model Won't Download?
- Check internet connection
- Verify disk space (4-7GB needed)
- Try in terminal directly: `ollama pull mistral`

---

## Available Models

### Recommended for Counselling
- **Mistral** (7B) - Good balance, responsive
- **Neural-Chat** (7B) - Optimized for conversation
- **Llama 2** (7B) - Great context understanding

### For Faster Response (Lower Quality)
- **Phi** (2.7B) - Tiny, very fast
- **Orca** (3B) - Efficient, decent output

### For Better Quality (Slower)
- **Llama 2 13B** - Better reasoning
- **Mistral 7B × 2** - Requires 16GB+ RAM

---

## Switching Models

1. Stop current Ollama service
2. Run: `ollama pull neural-chat` (or chosen model)
3. Update `.env.local`: `OLLAMA_MODEL=neural-chat`
4. Restart dev server
5. Restart Ollama service

---

## System Requirements

### Minimum
- 8GB RAM
- 10GB free disk space
- CPU: Modern processor (Ryzen 5+ or Intel i5+)
- 5-10 second response time expected

### Recommended
- 16GB+ RAM
- 20GB free disk space
- GPU with CUDA or Metal support
- 1-3 second response time

### Ideal for Production
- 32GB+ RAM
- Multiple GPU support
- Dedicated inference server
- Sub-second response times

---

## Production Deployment

### Docker Option
```dockerfile
FROM ollama/ollama:latest
RUN ollama pull mistral
CMD ["ollama", "serve"]
```

### Kubernetes Option
Deploy Ollama as a separate service and point `OLLAMA_BASE_URL` to it.

### Remote Server Option
1. Deploy Ollama on production server
2. Set `OLLAMA_BASE_URL=https://your-domain.com:port`
3. Configure CORS if needed
4. Add authentication if exposing publicly

---

## Security Notes

- Ollama API should NOT be publicly exposed without authentication
- Run behind a reverse proxy in production
- Consider using API keys for remote access
- Keep models updated
- Monitor resource usage

---

## Model Customization

You can create custom models with system prompts:

1. Create `Modelfile`:
```
FROM mistral
SYSTEM """You are a compassionate mental health counselor..."""
```

2. Build: `ollama create counselor -f Modelfile`
3. Use: `OLLAMA_MODEL=counselor`

---

## Performance Tips

1. **Pre-load Models**: Keep model in memory with persistent requests
2. **Batch Requests**: Group multiple queries when possible
3. **Use Smaller Models**: Trade quality for speed
4. **GPU Acceleration**: Enable CUDA/Metal in Ollama settings
5. **Caching**: Implement response caching for common questions

---

## Need Help?

- Check Ollama docs: https://github.com/jmorganca/ollama
- Review chat API: `/app/api/chat/route.ts`
- Check Ollama service: `/lib/ollama-service.ts`
- Test directly: `curl -X POST http://localhost:11434/api/chat -d '{...}'`
