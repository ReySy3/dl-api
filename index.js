const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

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
    const response = await axios.get(mediaUrl, { responseType: 'stream' });
    const fileName = path.basename(mediaUrl);
    const filePath = path.join(__dirname, fileName);
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    writer.on('finish', () => {
      res.download(filePath, fileName, (err) => {
        if (err) {
          res.status(500).json({ error: 'Error downloading file' });
        }
      });
    });

    writer.on('error', () => {
      res.status(500).json({ error: 'Error saving file' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching media' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
