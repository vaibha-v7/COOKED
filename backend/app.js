require("dotenv").config();

const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const express = require('express');
const app = express();


const cors = require('cors');
const cookieParser = require('cookie-parser');
const querystring = require("querystring");
const axios = require('axios');


const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173',], 
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

app.get('/',(req,res)=>{
  res.send("home page");
})

app.get('/login', (req, res) => {
  const state = Math.random().toString(36).substring(2, 15);  // random string
  const scope = 'user-read-private user-read-email user-top-read user-read-recently-played user-library-read playlist-read-private playlist-read-collaborative';


  const authUrl =
    'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: process.env.REDIRECT_URI,
      state: state,
    });

  res.redirect(authUrl);
});


app.get("/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.SPOTIFY_CLIENT_ID +
                ":" +
                process.env.SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
        },
      }
    );

    const access_token = response.data.access_token;
    const refresh_token = response.data.refresh_token;

    // Redirect with token in hash
    res.redirect(`${process.env.FRONTEND_URL}/#/profile?token=${access_token}&refresh=${refresh_token}`);
    // res.redirect(`/profile`);
  } catch (err) {
    res.send(err.response.data);
  }
});


app.get("/profile", async (req, res) => {
  // Get token from Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // Extract token from "Bearer token"

  if (!token) return res.status(401).json({ error: "No token" });

  const response = await axios.get("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` }
  });

  res.json(response.data);
});

app.get("/top-tracks", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    
    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=long_term",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const refined = response.data.items.map(track => ({
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      image: track.album.images[0]?.url,
      preview: track.preview_url
    }));

    const trackSummary = refined
      .map(t => `${t.name} by ${t.artist}`)
      .join(", ");

const roastPrompt = `
This playlist includes: ${trackSummary}.
Create a savage Wrapped-style roast using simple, everyday English.
Add 1-2 track names in the joke.
Make it harsh but easy to understand, like a bold headline.
No AI tone, no complex words, no talking to the listener.
and keep it like  a spotify wrapped roast with easier vocalbulary so that everyone can understand it.
dont include any date or year references.
keep it under 30 words and very rosting.
include a funny one-liner about their music taste.
use emojes to make it more engaging.
`;
    const roastResponse = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "user", content: roastPrompt }
      ]
    });

    const roast = roastResponse.choices[0].message.content;

    
    res.json({
      tracks: refined,
      roast: roast
    });

  } catch (err) {
    res.send(err.response?.data || err);
  }
});


app.get("/top-artists", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/artists?limit=5&time_range=long_term",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const refined = response.data.items.map(artist => ({
      name: artist.name,
      genres: artist.genres,
      popularity: artist.popularity,
      image: artist.images[0]?.url
    }));
    const artistSummary = refined.map(a => a.name).join(", ");
    const roastPrompt = `
Your top artists include: ${artistSummary}.
Write a brutal Spotify Wrapped–style roast in simple English.
Make it short, darkly funny, and easy to understand.
Add 1–2 artist names naturally.
Do NOT talk to the listener directly. No "you".
Just a cold, savage, headline-style roast in under 2 lines.
include a funny one-liner about their artists choice.
dont include any date or year references.
use emojes to make it more engaging.
`;



    const roastResponse = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "user", content: roastPrompt }
      ]
    });

    const roast = roastResponse.choices[0].message.content;


 
    res.json({
      artists: refined,
      roast: roast
    });

  } catch (err) {
    res.send(err.response?.data || err);
  }
});


app.get('/top-genres', async (req, res) => {
  // Use Bearer token from Authorization header for consistency
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    // Fetch top artistlong-term
    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/artists?limit=5&time_range=long_term",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const artists = response.data.items;
    const genreCount = {};

    
    artists.forEach(artist => {
      artist.genres.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });

    
    const sortedGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1]);

    const topGenres = sortedGenres.slice(0, 5).map(([genre]) => genre);


    
    const roastPrompt = `
Top genres include: ${topGenres.join(", ")}.
Write a brutal Spotify Wrapped–style roast using simple English.
Make it short, harsh, and easy to understand.
Mention 1–2 of these genres naturally.
No direct address, no polite tone, no AI-style talk.
Just a cold, savage, headline-style roast in under 2 lines.
include a funny one-liner about their music genres.
dont include any date or year references.
use emojes to make it more engaging.
`;


    
    const roastResponse = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "user", content: roastPrompt }
      ]
    });

    const roast = roastResponse.choices[0].message.content;


    
    // Align response with frontend expectations
    res.json({
      genres: topGenres,
      roast: roast
    });

  } catch (err) {
    res.send(err.response?.data || err);
  }
});

app.get("/personality", async (req, res) => {
  // Use Bearer token from Authorization header for consistency across endpoints
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    
    const tracksRes = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=long_term",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log("Top tracks fetched successfully. Count:", tracksRes.data.items.length);

    const tracks = tracksRes.data.items.map(t => ({
      id: t.id,
      name: t.name,
      artist: t.artists[0].name
    }));

    console.log("Track names:", tracks.map(t => t.name).join(", "));

    // Extract valid Idd
    const ids = tracks
      .map(t => t.id)
      .filter(id => id)
      .join(",");

    if (!ids) {
      return res.json({
        personality: "Unknown Listener",
        roast: "Your music is so mysterious even Spotify can't read you 😭",
        audio_profile: null
      });
    }

    
    const artistsRes = await axios.get(
      "https://api.spotify.com/v1/me/top/artists?limit=10&time_range=long_term",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const artists = artistsRes.data.items.map(a => ({
      name: a.name,
      genres: a.genres,
      popularity: a.popularity
    }));

    // Extract all genres
    const allGenres = artists.flatMap(a => a.genres);
    const uniqueGenres = [...new Set(allGenres)];

    
    const personalityPrompt = `
Based on this Spotify listening data:

TOP TRACKS:
${tracks.map((t, i) => `${i + 1}. "${t.name}" by ${t.artist}`).join('\n')}

TOP ARTISTS:
${artists.map((a, i) => `${i + 1}. ${a.name} (Genres: ${a.genres.slice(0, 3).join(', ') || 'Unknown'})`).join('\n')}

TOP GENRES: ${uniqueGenres.slice(0, 10).join(', ')}

Analyze their music taste and assign ONE specific music personality from these categories (or create a very similar one):

PERSONALITY TYPES:
-The Professional Crybaby (sad, emotional, slow songs)
-The Overcaffeinated Menace (high energy, chaotic)
-The Serial Simp (love songs, ballads)
-The Creatine Philosopher (gym bro, workout music)
-The Lofi Laptop Hermit (lofi, coder vibes)
-The Budget Eminem Fanboy (rap addict)
-The Thrift-Store Vinyl Collector (indie hipster)
-The Permanent Neck Injury (metal head)
-The Glowstick Enthusiast (EDM raver)
-The Spotify Top 40 Sheep (pop listener)
-The Pretends-to-Know-Music Theory Guy (jazz/classical)
-The Pickup-Truck Heartbreaker (country/folk)
-The Bollywood Heartbreak Machine (Bollywood listener)
-The K-Pop Photocard Investor (k-pop stan)
-The Human Beach Chair (reggae/chill vibes)
-The Smooth-Talker Who Isn’t Actually Smooth (R&B/soul)

Choose the BEST match based on their actual data. Be specific with "The" prefix format.

Generate:
1. The exact personality name using "The [Adjective] [Noun]" format
2. A 20–25 word savage roast about their music taste, simple English, very funny, no AI tone. Add emojis.

Return ONLY valid JSON:
{
  "personality": "The ...",
  "roast": "..."
}
`;

    
    const groqResponse = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: personalityPrompt }],
      temperature: 0.9
    });

    const text = groqResponse.choices[0].message.content.trim();

    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { 
      personality: "Mystery Listener", 
      roast: "Your taste is so unique even AI can't process it 🎭" 
    };

    
    res.json({
      personality: result.personality,
      roast: result.roast,
      audio_profile: {
        top_tracks: tracks.slice(0, 5).map(t => t.name),
        top_artists: artists.slice(0, 5).map(a => a.name),
        top_genres: uniqueGenres.slice(0, 5)
      }
    });

  } catch (err) {
    console.log("Error:", err.response?.data || err.message);
    res.status(500).json({ 
      error: err.response?.data || err.message 
    });
  }
});





















app.listen("3000",()=>{
  console.log("Connected to server");
  // console.log(process.env.GEMINI_API_KEY);
})

