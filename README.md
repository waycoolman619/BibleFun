# BibleFun
A fun game for to play with others with bible Q&amp;A games

## Announcer voice (when you start a game)
When you start a game, an announcer says a short line (e.g. “You are now entering… Trivia Quest.”). You can use any of these **free** options, or a paid API:

### Free options (no payment)

1. **Browser voice (default)**  
   Nothing to set up. The app uses a slower, deeper built-in voice and a short dramatic pause. Works in all modern browsers.

2. **Pre-recorded MP3s (best free quality)**  
   Generate the lines once with a free TTS site (e.g. [ElevenLabs](https://elevenlabs.io) free tier — create an account and generate the phrases, then download as MP3). Put the files in `sounds/announcer/` with these exact names:
   - `trivia-quest.mp3`
   - `fill-in-the-blank.mp3`
   - `who-am-i.mp3`
   - `bible-jeopardy.mp3`
   - `prophetic-pairs.mp3`
   - `testament-timeline.mp3`  
   If a file is missing, the app falls back to the browser voice for that game. No API key, no ongoing cost.

### Paid option (OpenAI TTS)
For realistic AI voice without recording files:

1. Copy `js/config.example.js` to `js/config.js`.
2. Get an API key from [OpenAI API keys](https://platform.openai.com/api-keys) (billing may apply).
3. In `js/config.js`, set `window.BIBLE_FUN_OPENAI_API_KEY = 'sk-...'`.
4. In `index.html`, add **before** the other script tags:  
   `<script src="js/config.js"></script>`
5. Add `js/config.js` to `.gitignore` so you don’t commit your key.

**Order the app tries:** Pre-recorded file → OpenAI (if key set) → Browser voice.
