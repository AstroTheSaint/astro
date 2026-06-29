# Link Drop - Usage Examples

## Example 1: Simple Batch Export

**Input:**
```
https://www.instagram.com/p/ABC123/
https://www.instagram.com/p/DEF456/
https://www.instagram.com/p/GHI789/
```

**Result:** Fetches data for 3 Instagram posts and exports to CSV

---

## Example 2: Mixed Input with Notes

**Input:**
```
Campaign Post 1: https://www.instagram.com/p/ABC123/
Review this TikTok later: https://www.tiktok.com/@user/video/123456
Important tweet about launch: https://twitter.com/brand/status/789
https://www.facebook.com/page/posts/456 - competitor analysis
```

**Result:** Extracts all 4 URLs and processes them, ignoring the notes

---

## Example 3: Multi-Platform Analysis

**Input:**
```
Instagram: https://www.instagram.com/p/ABC123/
TikTok: https://www.tiktok.com/@creator/video/987654
Twitter: https://twitter.com/user/status/555555
YouTube: https://www.youtube.com/watch?v=VIDEO_ID
```

**Result:** Fetches data from multiple platforms in one batch

**Note:** Make sure to select the appropriate Apify actor for each platform, or use a multi-platform actor if available.

---

## Example 4: Campaign Tracking

**Scenario:** Tracking performance of a product launch across platforms

**Input:**
```
Day 1 Launch Post: https://www.instagram.com/p/LAUNCH1/
Day 1 Story Highlight: https://www.instagram.com/stories/highlights/STORY1/
Influencer Collab: https://www.tiktok.com/@influencer/video/COLLAB1
Press Release Tweet: https://twitter.com/brand/status/PRESS1
Facebook Announcement: https://www.facebook.com/brand/posts/ANNOUNCE1
```

**Workflow:**
1. Paste all links at launch time
2. Fetch data → Export CSV (baseline metrics)
3. Wait 24 hours
4. Paste same links again
5. Fetch data → Export CSV (24h metrics)
6. Compare CSVs to see performance growth

---

## Example 5: Competitive Analysis

**Input:**
```
Competitor A - Latest Post: https://www.instagram.com/p/COMP_A1/
Competitor B - Viral Video: https://www.tiktok.com/@comp_b/video/VIRAL1
Our Post (for comparison): https://www.instagram.com/p/OURS1/
Industry Leader Post: https://www.instagram.com/p/LEADER1/
```

**Result:** Compare engagement metrics across competitors

---

## CSV Output Preview

After exporting, your CSV will look like this:

| Platform | URL | Username | Likes | Comments | Views | Caption |
|----------|-----|----------|-------|----------|-------|---------|
| Instagram | https://... | johndoe | 1,234 | 89 | 0 | Amazing sunset... |
| TikTok | https://... | creator | 50,000 | 2,500 | 1,000,000 | Viral dance... |
| Twitter | https://... | techuser | 890 | 123 | 0 | Just launched... |

*(Plus 14 more columns with detailed metrics)*

---

## Tips for Best Results

### Batch Processing
- ✅ **Good:** 5-20 links per batch
- ⚠️ **Okay:** 20-50 links (may take 10+ minutes)
- ❌ **Not Recommended:** 100+ links (very slow, may hit rate limits)

### Timing
- Wait 5-10 seconds between batches to avoid rate limiting
- For time-series analysis, fetch data at consistent intervals
- Some platforms update metrics with delays (views, etc.)

### Platform-Specific Notes

**Instagram:**
- Posts, Reels, and IGTV videos supported
- Stories require special handling
- Private accounts won't return data

**TikTok:**
- Public videos only
- View counts may be delayed
- Some regions have restrictions

**Twitter/X:**
- Public tweets only
- Retweet and quote tweet data available
- Rate limits are strict

**Facebook:**
- Public posts only
- Page posts work better than personal profiles
- Some metrics may be limited

### Actor Selection

Different platforms require different Apify actors:

```
Instagram → apify/instagram-scraper
TikTok → apify/tiktok-scraper
Twitter → apify/twitter-scraper
Facebook → apify/facebook-scraper
LinkedIn → apify/linkedin-scraper
YouTube → apify/youtube-scraper
```

You can change the actor in the "API Configuration" section!

---

## Common Workflows

### 1. Daily Monitoring
1. Keep a text file with URLs to monitor
2. Copy/paste into Link Drop daily
3. Export CSV with date in filename
4. Track changes over time

### 2. Campaign Report
1. Collect all campaign URLs
2. Fetch data weekly
3. Compare CSV files to show growth
4. Present metrics to stakeholders

### 3. Content Research
1. Find top-performing posts in your niche
2. Export their metrics
3. Analyze what works (hashtags, timing, format)
4. Apply insights to your content

### 4. Influencer Vetting
1. Collect recent posts from potential influencers
2. Export engagement data
3. Calculate engagement rates
4. Verify authenticity of metrics

---

**Pro Tip:** Keep your exported CSVs organized by date and campaign name for easy reference!

Example: `linkdrop-export-campaign-launch-2026-06-29.csv`
