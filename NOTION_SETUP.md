# Notion Blog Integration

## Setup Instructions

### 1. Create Notion Integration
1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Name it "Portfolio Blog"
4. Select your workspace
5. Copy the "Internal Integration Token"

### 2. Create Blog Database in Notion
Create a new database with these properties:

| Property | Type | Required |
|----------|------|----------|
| Title | Title | ✅ |
| Slug | Text | ✅ (URL-friendly, e.g., "my-first-post") |
| Excerpt | Text | ✅ (Short preview text) |
| Category | Select | ✅ (Options: AI, Automation, CRM, etc.) |
| Date | Date | ✅ |
| Read Time | Text | Optional (e.g., "5 min") |
| Featured | Checkbox | Optional |
| Published | Checkbox | ✅ (Only published posts appear) |

### 3. Share Database with Integration
1. Open your Blog database in Notion
2. Click "..." menu → "Add connections"
3. Select your "Portfolio Blog" integration

### 4. Get Database ID
1. Open the database in Notion
2. Copy the URL, it looks like:
   `https://notion.so/myworkspace/abc123def456...?v=...`
3. The database ID is the long string after the workspace name: `abc123def456...`

### 5. Add Environment Variables
Add these to your `.env.local` file and Vercel:

```
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_BLOG_DATABASE_ID=abc123def456...
```

### 6. Write Blog Posts
1. Add a new row to your Notion database
2. Fill in Title, Slug, Excerpt, Category, Date
3. Write your content in the page body
4. Check "Published" when ready to go live
5. Redeploy to see changes
