const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Serve the React app as static files
app.use(express.static(path.join(__dirname, 'youtube-downloader/build')));

// Handle video download
app.get('/download', async (req, res) => {
  const url = req.query.url;
  const quality = req.query.quality || 'highest';

  if (!ytdl.validateURL(url)) {
    return res.status(400).send('Invalid YouTube URL');
  }

  try {
    res.header('Content-Disposition', `attachment; filename="video.mp4"`);
    ytdl(url, { quality: quality }).pipe(res);
  } catch (error) {
    console.error('Error during download:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Handle any other requests by serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'youtube-downloader/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
