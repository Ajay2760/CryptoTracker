# Vercel Deployment Fix Guide

## Issue: Cryptocurrency list not showing on Vercel deployment

### Most Common Causes:

## 1. Environment Variable Missing
**Problem**: `COINGECKO_API_KEY` not set in Vercel
**Solution**: 
1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add: `COINGECKO_API_KEY` = `your_api_key_value`
4. **Important**: Set for all environments (Production, Preview, Development)
5. Redeploy the project

## 2. Build Configuration Issues
**Problem**: Build process not generating correct files
**Solution**: Verify in Vercel settings:
- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

## 3. Serverless Function Timeout
**Problem**: CoinGecko API calls timing out
**Solution**: Already handled in code with error logging

## 4. CORS Issues
**Problem**: Cross-origin requests blocked
**Solution**: CORS headers are properly configured in all API files

## 5. Rate Limiting
**Problem**: CoinGecko API rate limits without API key
**Solution**: Ensure API key is properly set (see #1)

---

## Testing Your Deployment

### Step 1: Test API Endpoints Directly
Visit these URLs in your browser (replace `yourapp` with your Vercel domain):
- `https://yourapp.vercel.app/api/test` - Should show API status
- `https://yourapp.vercel.app/api/global` - Should show global market data
- `https://yourapp.vercel.app/api/coins/markets` - Should show cryptocurrency list

### Step 2: Check Function Logs
1. Go to Vercel dashboard → Your project
2. Click "Functions" tab
3. Click on any function (like `api/coins/markets.ts`)
4. Check "Invocations" for error logs

### Step 3: Browser Developer Tools
1. Open your deployed site
2. Press F12 → "Console" tab
3. Look for error messages
4. Check "Network" tab for failed API calls

---

## Quick Fix Commands

If you're still having issues, try these:

1. **Force redeploy**: Push a small change to trigger new deployment
2. **Clear build cache**: In Vercel dashboard, go to Deployments → ⋯ → "Redeploy"
3. **Check API key**: Verify it's correctly copied (no extra spaces)

---

## Files Updated for Better Debugging

✓ Added logging to `api/coins/markets.ts`
✓ Added logging to `api/global.ts`  
✓ Created test endpoint `api/test.ts`
✓ Added error handling in frontend

The dashboard works perfectly on Replit, so the issue is deployment-specific.