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
    const playbackUrl = "https://stream.mux.com/G8Qd9BYgs1VaeYAPu002TEufD62zPCiSU00d3OZlSaBCI.m3u8"; // Replace with your Mux URL
    res.render('liveStream', { playbackUrl });
});

// ✅ Create a New Live Stream
app.get('/create-stream', async (req, res) => {
    try {
        const response = await axios.post(
            'https://api.mux.com/video/v1/live-streams',
            {
                playback_policy: ["public"],
                new_asset_settings: { playback_policy: ["public"] },
                reconnect_window: 1800 // Keep the stream alive for 30 minutes even after disconnect
            },
            {
                auth: {
                    username: MUX_ACCESS_TOKEN_ID,
                    password: MUX_SECRET_KEY
                }
            }
        );

        const streamData = response.data.data;
        res.json({
            message: "Live stream created successfully!",
            streamKey: streamData.stream_key,
            playbackId: streamData.playback_ids[0].id,
            rtmpUrl: "rtmp://live.mux.com/app"
        });
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
});


// ✅ Start the Server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
