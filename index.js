const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.get('/download', async (req, res) => {
  const mediaUrl = req.query.url;

  if (!mediaUrl) {
    return res.status(400).send('No URL provided');
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
          res.status(500).send('Error downloading file');
        }
      });
    });

    writer.on('error', () => {
      res.status(500).send('Error saving file');
    });
  } catch (error) {
    res.status(500).send('Error fetching media');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
