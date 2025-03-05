require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const MUX_ACCESS_TOKEN_ID = process.env.MUX_ACCESS_TOKEN_ID;
const MUX_SECRET_KEY = process.env.MUX_SECRET_KEY;

const auth = {
    auth: {
        username: MUX_ACCESS_TOKEN_ID,
        password: MUX_SECRET_KEY
    }
};

app.set('view engine', 'ejs');

app.get('/watch', (req, res) => {
    const playbackUrl = "https://stream.mux.com/ZtQc7i8Y1BQuyaTeOk7J27j02QVewYJ009XOrTITz3974.m3u8"; // Replace with your Mux URL
    res.render('liveStream', { playbackUrl });
});

// ✅ Create a New Live Stream
app.get('/create-live-stream', async (req, res) => {
    try {
        const response = await axios.post('https://api.mux.com/video/v1/live-streams', {
            playback_policy: ['public'],
            new_asset_settings: { playback_policy: ['public'] }
        }, auth);

        const stream = response.data.data;
        res.json({
            success: true,
            stream_key: stream.stream_key,
            rtmp_url: `rtmp://live.mux.com/app/${stream.stream_key}`,
            playback_url: stream.playback_ids[0].id
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
});

// ✅ Start the Server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
