# 🔑 Link Drop Setup Guide

## Step 1: Get Your Apify API Key

1. Go to https://console.apify.com/account/integrations
2. Sign up for a free account (if you don't have one)
3. Copy your API key (starts with `apify_api_`)

## Step 2: Open Link Drop

Open `linkdrop.html` in your browser (just double-click it)

## Step 3: Configure Your API Key

1. Look for the "⚙️ API Configuration" section at the top
2. Paste your API key into the "Apify API Key" field
3. Click the "Save Key" button
4. You'll see: "✓ API key saved successfully!"

## Step 4: Start Exporting!

Paste social media links and click "🚀 Fetch Data"

## 📝 Try Example Links

```
https://www.instagram.com/p/C8nF_XxPQj-/
https://www.tiktok.com/@tiktok/video/7331577598429269291
https://twitter.com/X/status/1672284635794657280
```

## 🔒 Security

Your API key is:
- ✅ Stored only in YOUR browser (localStorage)
- ✅ Never sent anywhere except directly to Apify
- ✅ Not committed to any repository
- ✅ Private to you

## 💡 What You Can Do

### Batch Processing
```
Post 1: https://www.instagram.com/p/ABC123/
Viral video: https://www.tiktok.com/@user/video/123456
Important: https://twitter.com/user/status/789
```

### CSV Export
Get 21 data fields including:
- Likes, Comments, Shares, Views
- Caption, Hashtags, Mentions
- User info, Follower counts
- Media URLs, Timestamps

### Platform Support
Change the Actor ID for different platforms:
- Instagram: `apify/instagram-scraper`
- TikTok: `apify/tiktok-scraper`
- Twitter: `apify/twitter-scraper`
- Facebook: `apify/facebook-scraper`

## 📚 More Help

- `QUICKSTART.md` - Quick start guide
- `LINKDROP_README.md` - Full documentation
- `EXAMPLES.md` - Real-world workflows

---

**Ready to go!** Open `linkdrop.html` and start exporting! 🚀
