const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Endpoint to fetch media from a URL
app.get('/download', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        // Fetch the HTML content of the URL
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Find all media links (images and videos)
        const mediaLinks = [];
        
        // Extract image links
        $('img').each((_, element) => {
            const src = $(element).attr('src');
            if (src) {
                mediaLinks.push(src);
            }
        });

        // Extract video links
        $('video').each((_, element) => {
            const src = $(element).attr('src');
            if (src) {
                mediaLinks.push(src);
            }
        });

        // Check if any media was found
        if (mediaLinks.length === 0) {
            return res.status(404).json({ error: "No media found" });
        }

        // Return the media links
        res.json({ mediaLinks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch media" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
