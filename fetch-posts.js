// fetch-posts.js
// Fetches your Facebook Page's latest posts using the Graph API
// and saves them into posts.json for your website to read.

const fs = require('fs');
const https = require('https');

// ====== FILL THESE IN ======
const PAGE_ID = "PASTE_YOUR_PAGE_ID_HERE";
const ACCESS_TOKEN = "PASTE_YOUR_LONG_LIVED_PAGE_ACCESS_TOKEN_HERE";
// ============================

const fields = "message,full_picture,permalink_url,created_time";
const url = `https://graph.facebook.com/v20.0/${PAGE_ID}/posts?fields=${fields}&access_token=${ACCESS_TOKEN}&limit=10`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);

            if (json.error) {
                console.error("Facebook API error:", json.error.message);
                return;
            }

            const posts = json.data.map(post => ({
                message: post.message ? post.message.substring(0, 200) : "",
                image: post.full_picture || "",
                link: post.permalink_url,
                time: post.created_time
            }));

            fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));
            console.log(`Saved ${posts.length} posts to posts.json`);
        } catch (err) {
            console.error("Error parsing response:", err);
        }
    });
}).on('error', (err) => {
    console.error("Request failed:", err);
});
