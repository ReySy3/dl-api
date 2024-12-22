const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the media downloader API' });
});

// Download media route
app.get('/download', async (req, res) => {
  const mediaUrl = req.query.url;

  if (!mediaUrl) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  try {
    // Simulate fetching media from a URL (replace with actual logic)
    const mediaResponse = await axios.get(mediaUrl); // Replace with media fetching logic

    // Assume we get a direct downloadable link (e.g., from an API or web scraping)
    const downloadLink = 'https://example.com/path/to/media/file.mp4'; // Replace with real link extraction logic

    // Return the downloadable link
    res.json({ downloadLink });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching media from the provided URL' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
