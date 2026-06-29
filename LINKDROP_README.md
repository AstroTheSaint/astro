# Link Drop - Social Media Data Exporter

A powerful, easy-to-use web tool for batch exporting social media data using the Apify API.

## Features

- 🔑 **Secure API Key Storage** - Store your Apify API key locally in your browser
- 📋 **Smart Batch Processing** - Paste links with or without notes, system extracts URLs automatically
- 🚀 **Multi-Platform Support** - Works with Instagram, TikTok, Twitter/X, Facebook, YouTube, and more
- 📊 **Real-time Progress Tracking** - Visual progress bars and statistics
- 💾 **CSV Export** - Export comprehensive data in structured CSV format
- 🎨 **Modern UI** - Clean, responsive design that works on desktop and mobile
- 🔒 **Privacy First** - All data processing happens in your browser

## Getting Started

### 1. Open Link Drop

Simply open `linkdrop.html` in any modern web browser. No installation or server required!

### 2. Configure Your API Key

1. Get your Apify API key from [Apify Console](https://console.apify.com/account/integrations)
2. Enter it in the "API Configuration" section
3. Click "Save Key" - it will be stored securely in your browser

### 3. Choose Your Actor (Optional)

Link Drop uses Apify actors to fetch data. Default is Instagram scraper, but you can change it for different platforms:

- Instagram: `apify/instagram-scraper`
- TikTok: `apify/tiktok-scraper`
- Twitter/X: `apify/twitter-scraper`
- Facebook: `apify/facebook-scraper`

### 4. Paste Your Links

Copy and paste social media links into the text area. You can:

- Paste one link per line
- Include notes or comments on the same line
- Mix URLs with text - the system extracts URLs automatically

**Example Input:**
```
https://www.instagram.com/p/ABC123/
Check this viral post: https://www.tiktok.com/@user/video/123456
https://twitter.com/user/status/123456 - important for campaign
Review later: https://www.facebook.com/post/789
```

### 5. Fetch Data

Click "🚀 Fetch Data" and watch the progress! The tool will:

- Extract all URLs from your input
- Process each link through Apify
- Display real-time progress and statistics
- Show a preview of the fetched data

### 6. Export CSV

Once data is fetched, click "📥 Export CSV" to download your data.

## CSV Output Format

The exported CSV includes the following columns:

| Column | Description |
|--------|-------------|
| Platform | Social media platform (Instagram, TikTok, etc.) |
| URL | Original post URL |
| Username | Account username |
| Display Name | Account display name |
| Post ID | Unique post identifier |
| Caption | Post caption/description |
| Likes | Number of likes |
| Comments | Number of comments |
| Shares | Number of shares |
| Views | Number of views (for videos) |
| Post Date | When the post was published |
| Post Type | Type of content (image, video, etc.) |
| Hashtags | Comma-separated hashtags |
| Mentions | Comma-separated mentions |
| Location | Location name (if available) |
| Is Verified | Account verification status |
| Follower Count | Account follower count |
| Following Count | Account following count |
| Media URL | URL to the media content |
| Thumbnail URL | URL to thumbnail image |
| Fetch Timestamp | When data was fetched |

## Tips & Best Practices

### Batch Processing

- Process 5-20 links at a time for optimal performance
- The tool adds small delays between requests to avoid rate limiting
- Large batches may take several minutes to complete

### API Usage

- Each link processed consumes Apify credits
- Check your Apify usage dashboard to monitor credit consumption
- Free Apify accounts include monthly credits

### Data Accuracy

- Data freshness depends on Apify's actors and rate limits
- Some platforms have restrictions on what data can be accessed
- Private or deleted posts may not return data

### Browser Storage

- Your API key is stored in browser localStorage
- Clear browser data will remove your saved API key
- Use private/incognito mode for temporary sessions

## Troubleshooting

### "Please save your API key first!"

Make sure you've entered a valid Apify API key and clicked "Save Key".

### "No valid URLs found"

The system couldn't extract any URLs from your input. Make sure you're pasting complete URLs starting with `http://` or `https://`.

### "Failed to fetch data"

This can happen if:
- Your API key is invalid or expired
- The Apify actor doesn't support that URL format
- The post is private or deleted
- You've exceeded your Apify rate limits

### Data is Missing

Some fields may be empty if:
- The platform doesn't provide that data
- The post type doesn't support that metric (e.g., images don't have views)
- Privacy settings restrict access

## Supported Platforms

- ✅ Instagram (posts, reels, stories)
- ✅ TikTok (videos)
- ✅ Twitter/X (tweets)
- ✅ Facebook (posts)
- ✅ YouTube (videos)
- ✅ LinkedIn (posts)

*Support depends on available Apify actors*

## Privacy & Security

- **No Data Collection**: Link Drop doesn't collect or store any of your data
- **Local Processing**: All data processing happens in your browser
- **Secure Storage**: API keys are stored locally using browser localStorage
- **No Tracking**: No analytics or tracking scripts

## Technical Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Internet connection
- Valid Apify API key

## Customization

The tool is a single HTML file with embedded CSS and JavaScript. You can easily customize:

- Colors and styling (CSS variables in the `<style>` section)
- CSV columns (modify the `exportCSV()` function)
- Actor configurations (change default actors)
- UI text and labels

## License

This tool is provided as-is for personal and commercial use.

## Support

For issues related to:
- **Link Drop**: Check the browser console for error messages
- **Apify API**: Visit [Apify Documentation](https://docs.apify.com/)
- **Actor Issues**: Check specific actor documentation on Apify

---

**Made with ❤️ for efficient social media data collection**
