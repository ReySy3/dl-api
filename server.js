const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// Route to scrape the media downloader page
app.get('/scrape', async (req, res) => {
    const url = 'https://publer.io/tools/media-downloader';

    try {
        // Fetch the HTML of the page
        const { data } = await axios.get(url);
        
        // Load the HTML into cheerio
        const $ = cheerio.load(data);
        
        // Extract the title
        const title = $('title').text();
        
        // Extract sections and their content
        const sections = [];
        $('h3').each((index, element) => {
            const sectionTitle = $(element).text().trim();
            const content = $(element).next().text().trim();
            sections.push({ sectionTitle, content });
        });

        // Send the response
        res.json({ title, sections });
    } catch (error) {
        console.error('Error fetching the page:', error);
        res.status(500).send('Error fetching the page');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
