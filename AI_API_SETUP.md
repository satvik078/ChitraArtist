# AI Scoring API Setup Guide

This guide explains how to set up **free AI APIs** to replace the simulated scoring with real AI evaluation.

## 🏆 Recommended: Hugging Face Inference API (FREE)

**Best Option** - 30,000 free requests/month, no credit card needed.

### Setup Steps:

1. **Create Hugging Face Account**
   - Go to https://huggingface.co/
   - Sign up for free account
   - Verify your email

2. **Get API Token**
   - Go to https://huggingface.co/settings/tokens
   - Click "New token"
   - Name it "art-scoring" and give it "Read" permissions
   - Copy the token (starts with `hf_...`)

3. **Add to Backend `.env` File**
   ```bash
   AI_SCORING_PROVIDER=huggingface
   HUGGINGFACE_API_KEY=hf_your_token_here
   ```

4. **Restart Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

### How It Works:
- Uses image classification models to analyze artwork
- Extracts features: aesthetic quality, technical skill, creativity, composition
- Returns scores on 0-100 scale
- **Free tier: 30,000 requests/month** (more than enough!)

---

## Alternative Free Options

### Option 2: Replicate API

**Free tier:** Limited requests, requires credit card (but free tier exists)

1. **Sign up at https://replicate.com/**
2. **Get API token from https://replicate.com/account/api-tokens**
3. **Add to `.env`:**
   ```bash
   AI_SCORING_PROVIDER=replicate
   REPLICATE_API_KEY=r8_your_token_here
   ```

**Note:** Replicate has good models but requires credit card for free tier.

---

### Option 3: Stability AI

**Free tier:** Limited requests

1. **Sign up at https://platform.stability.ai/**
2. **Get API key from dashboard**
3. **Add to `.env`:**
   ```bash
   AI_SCORING_PROVIDER=stability
   STABILITY_API_KEY=sk_your_key_here
   ```

---

### Option 4: Keep Simulated (Current Default)

If you don't want to use external APIs yet, keep this in `.env`:
```bash
AI_SCORING_PROVIDER=simulated
```

The system will use simulated scoring (consistent, works offline).

---

## Testing Your Setup

1. **Upload a test artwork** through your dashboard
2. **Check backend logs** - you should see:
   - `AI scoring error` if API fails (falls back to simulated)
   - No errors if API works correctly
3. **Check artwork score** - View the artwork in dashboard, it should have AI scores

---

## Troubleshooting

### Issue: "HUGGINGFACE_API_KEY not set"
**Solution:** Make sure you added the key to `backend/.env` and restarted the server

### Issue: API returns errors
**Solution:** 
- Check if you've exceeded free tier limits
- Verify API token is correct
- Check Hugging Face model availability (some models may be loading)

### Issue: Scores seem random
**Solution:** 
- Different models give different results
- Adjust `extractScoreFromHF()` function in `aiScoringService.js` to better interpret model responses
- Consider using multiple models and averaging scores

---

## Advanced: Using Better Hugging Face Models

Edit `backend/services/aiScoringService.js` to use better models:

### For Aesthetic Scoring:
```javascript
// Try these models:
- "google/vit-base-patch16-224" (general image classification)
- "caidas/swin2SR-classical-sr-x2-64" (image quality)
- "facebook/detr-resnet-50" (object detection for composition)
```

### For Better Results:
You can call multiple models and average their scores:

```javascript
const aestheticResponse = await fetch(
  `https://api-inference.huggingface.co/models/google/vit-base-patch16-224`,
  // ... config
);
const qualityResponse = await fetch(
  `https://api-inference.huggingface.co/models/caidas/swin2SR-classical-sr-x2-64`,
  // ... config
);
// Combine both results for better accuracy
```

---

## Cost Comparison

| Provider | Free Tier | Best For |
|----------|-----------|----------|
| **Hugging Face** | ✅ 30k/month | **Recommended** - Best free tier |
| Replicate | ⚠️ Limited | Good models, needs credit card |
| Stability AI | ⚠️ Limited | Professional models |
| Simulated | ✅ Unlimited | Offline, consistent baseline |

---

## Next Steps

1. ✅ Set up Hugging Face (recommended)
2. ✅ Add API key to `.env`
3. ✅ Test with one artwork upload
4. ✅ Monitor scores in dashboard
5. ✅ Adjust scoring weights in `aiScoringService.js` if needed

**Your competition system will now use real AI to evaluate artwork!** 🎨✨

