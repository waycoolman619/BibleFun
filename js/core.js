/* Bible Fun v2.0.0 - Core Engine (Fixed Audio) */
/* Shared for Trivia, Fill in the Blank, Who Am I (Battle Mode: individuals = icon as name, teams = clan) */
const GAME_ICONS = [
    { emoji: '🦁', label: 'Lion' }, { emoji: '🐻', label: 'Bear' }, { emoji: '🐼', label: 'Panda' },
    { emoji: '🦊', label: 'Fox' }, { emoji: '🐯', label: 'Tiger' }, { emoji: '🐲', label: 'Dragon' },
    { emoji: '🦄', label: 'Unicorn' }, { emoji: '🐙', label: 'Octopus' }, { emoji: '🐴', label: 'Horse' },
    { emoji: '🐶', label: 'Dog' }, { emoji: '🐱', label: 'Cat' }, { emoji: '🐰', label: 'Rabbit' },
    { emoji: '🦉', label: 'Owl' }, { emoji: '🐸', label: 'Frog' }, { emoji: '🐵', label: 'Monkey' },
    { emoji: '🐔', label: 'Rooster' }, { emoji: '🐧', label: 'Penguin' }, { emoji: '🦋', label: 'Butterfly' },
    { emoji: '⚡', label: 'Lightning' }, { emoji: '🔥', label: 'Fire' }
];
const GAME_CLANS = [
    { emoji: '🦁', name: 'Lion Clan' }, { emoji: '🐻', name: 'Bear Clan' },
    { emoji: '🐺', name: 'Wolf Clan' }, { emoji: '🦅', name: 'Eagle Clan' },
    { emoji: '🦊', name: 'Fox Clan' }, { emoji: '🐲', name: 'Dragon Clan' },
    { emoji: '🐯', name: 'Tiger Clan' }, { emoji: '🦉', name: 'Owl Clan' },
    { emoji: '🐴', name: 'Horse Clan' }, { emoji: '🦂', name: 'Scorpion Clan' }
];

const GameManager = {
    activeGame: null,
    games: {},
    players: [],
    currentPlayerIndex: 0,
    audioUnlocked: false,
    soundAvailable: { correct: true, wrong: true }, // set false when a file fails to load

    registerGame: function(id, instance) {
        this.games[id] = instance;
    },

    // This runs the moment you click ANY menu button
    unlockAudio: function() {
        if (this.audioUnlocked) return;
        const soundIds = { correct: 'sound-correct', wrong: 'sound-wrong' };
        Object.keys(soundIds).forEach(type => {
            const el = document.getElementById(soundIds[type]);
            if (el) {
                el.play().then(() => {
                    el.pause();
                    el.currentTime = 0;
                }).catch(() => {
                    this.soundAvailable[type] = false;
                });
            }
        });
        this.audioUnlocked = true;
    },

    openSetup: function(gameId) {
        this.unlockAudio(); // Ensure audio is ready
        this.activeGame = this.games[gameId];
        
        if (!this.activeGame) {
            alert("Game '" + gameId + "' not found!");
            return;
        }

        const container = document.getElementById('dynamic-setup-container');
        container.innerHTML = this.activeGame.getSetupHTML();
        const subEl = document.getElementById('app-subtitle');
        if (subEl && this.ANNOUNCER_TITLES[gameId]) subEl.textContent = this.ANNOUNCER_TITLES[gameId];
        document.getElementById('menu').classList.add('hidden');
        document.getElementById('setup-screen').classList.remove('hidden');
    },

    toggleSoundDisplay: function() {
        const on = document.getElementById('sound-on');
        const wrap = document.getElementById('volume-slider-wrap');
        const label = document.getElementById('sound-state-label');
        if (wrap) wrap.classList.toggle('hidden', !on || !on.checked);
        if (label) label.textContent = (on && on.checked) ? 'On' : 'Off';
    },

    playSound: function(type, onEnded) {
        const soundOn = document.getElementById('sound-on');
        const runEnded = () => { if (onEnded) onEnded(); };
        if (!soundOn || !soundOn.checked) { runEnded(); return; }
        if (!this.soundAvailable[type]) { runEnded(); return; }
        const id = type === 'correct' ? 'sound-correct' : 'sound-wrong';
        const s = document.getElementById(id);
        if (!s) { runEnded(); return; }
        const vol = document.getElementById('volume-slider') ? document.getElementById('volume-slider').value : 0.8;
        s.volume = vol;
        s.currentTime = 0;
        s.onended = runEnded;
        s.play().catch(() => { this.soundAvailable[type] = false; runEnded(); });
    },

    // Pick a voice based on menu "Voice: Male / Female" (browser voices vary by device).
    getPreferredVoice: function(voices) {
        if (!voices || !voices.length) return null;
        const style = (document.getElementById('voice-style') || {}).value || 'male';
        const en = v => v.lang.startsWith('en');
        const enUS = v => v.lang.startsWith('en-US');
        if (style === 'female') {
            return voices.find(v => en(v) && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Karen') || v.name.includes('Victoria') || v.name.includes('Woman'))) ||
                voices.find(v => enUS(v)) ||
                voices.find(v => en(v));
        }
        return voices.find(v => en(v) && (v.name.includes('Male') || v.name.includes('Daniel') || v.name.includes('James') || v.name.includes('David'))) ||
            voices.find(v => enUS(v)) ||
            voices.find(v => en(v));
    },

    _readQuestionTimeout: null,

    // Speak turn announcement first in Battle Mode (e.g. "Lion's turn"). Optional onDone when finished. Then call readQuestion in onDone so question plays after.
    speakTurn: function(text, onDone) {
        const soundOn = document.getElementById('sound-on');
        if (!soundOn || !soundOn.checked) { if (onDone) onDone(); return; }
        if (!text || !window.speechSynthesis) { if (onDone) onDone(); return; }
        window.speechSynthesis.cancel();
        if (this._readQuestionTimeout) clearTimeout(this._readQuestionTimeout);
        this._readQuestionTimeout = null;
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.88;
        u.pitch = 1;
        u.volume = 1;
        const voices = speechSynthesis.getVoices();
        const preferred = this.getPreferredVoice(voices);
        if (preferred) u.voice = preferred;
        u.onend = () => { if (onDone) onDone(); };
        speechSynthesis.speak(u);
    },

    // Read the question aloud using the browser voice (1s delay, then speaks). Respects Sound on/off and Voice Male/Female.
    readQuestion: function(text) {
        const soundOn = document.getElementById('sound-on');
        if (soundOn && !soundOn.checked) return;
        if (!text || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        if (this._readQuestionTimeout) clearTimeout(this._readQuestionTimeout);
        const self = this;
        this._readQuestionTimeout = setTimeout(function() {
            self._readQuestionTimeout = null;
            const u = new SpeechSynthesisUtterance(text);
            u.rate = 0.82;
            u.pitch = 1;
            u.volume = 1;
            const voices = speechSynthesis.getVoices();
            const preferred = self.getPreferredVoice(voices);
            if (preferred) u.voice = preferred;
            speechSynthesis.speak(u);
        }, 1000);
    },

    // Epic announcer when entering a game. Options (in order): 1) Pre-recorded MP3, 2) OpenAI TTS, 3) Browser TTS (free).
    ANNOUNCER_PHRASES: {
        multiple: 'Welcome to Trivia Quest. Your quest starts now.',
        blank: 'Welcome to Fill in the Blank. Let the words be revealed.',
        whoami: 'Welcome to Who Am I? Uncover the Bible character.',
        jeopardy: 'You are now entering... Bible Jeopardy. Choose wisely.',
        match: 'You are now entering... Prophetic Pairs. Match the prophets.',
        sequence: 'You are now entering... Testament Timeline. Order the ages.'
    },
    ANNOUNCER_FILES: {
        multiple: 'trivia_quest.mp3',
        blank: 'fill-in-the-blank.mp3',
        whoami: 'who-am-i.mp3',
        jeopardy: 'bible-jeopardy.mp3',
        match: 'prophetic-pairs.mp3',
        sequence: 'testament-timeline.mp3'
    },
    ANNOUNCER_TITLES: {
        multiple: 'Trivia Quest',
        blank: 'Fill in the Blank',
        whoami: 'Who Am I?',
        jeopardy: 'Bible Jeopardy',
        match: 'Prophetic Pairs',
        sequence: 'Testament Timeline'
    },

    showGameIntroSplash: function(title, subtitle) {
        const el = document.getElementById('game-intro-splash');
        const titleEl = document.getElementById('game-intro-splash-title');
        const subEl = document.getElementById('game-intro-splash-subtitle');
        const appSub = document.getElementById('app-subtitle');
        if (appSub) appSub.style.display = 'none';
        if (titleEl) {
            titleEl.textContent = title || 'Get ready';
            titleEl.style.display = '';
        }
        if (subEl) {
            subEl.textContent = subtitle !== undefined ? subtitle : 'Get ready…';
            subEl.style.display = '';
        }
        if (el) el.classList.remove('hidden');
    },

    hideGameIntroSplash: function() {
        const el = document.getElementById('game-intro-splash');
        const appSub = document.getElementById('app-subtitle');
        if (el) el.classList.add('hidden');
        if (appSub) appSub.style.display = '';
    },

    announceGame: function(gameId, onDone) {
        const soundOn = document.getElementById('sound-on');
        const text = this.ANNOUNCER_PHRASES[gameId];
        const filename = this.ANNOUNCER_FILES[gameId];
        const done = () => { if (onDone) onDone(); };
        if (!soundOn || !soundOn.checked) {
            if (onDone) setTimeout(done, 1200);
            return;
        }
        if (!text) { done(); return; }
        if (filename) {
            this.announcerPlayFile(filename, () => this.announcerSay(text, done), done);
        } else {
            this.announcerSay(text, done);
        }
    },

    // Free: play pre-recorded MP3 from sounds/announcer/. onEnded when file finishes; onFallback when error.
    announcerPlayFile: function(filename, onFallback, onEnded) {
        const path = 'sounds/announcer/' + filename;
        const a = new Audio(path);
        const volEl = document.getElementById('volume-slider');
        a.volume = volEl ? parseFloat(volEl.value) : 0.8;
        let fallbackCalled = false;
        const tryFallback = () => {
            if (fallbackCalled) return;
            fallbackCalled = true;
            if (onFallback) onFallback();
        };
        a.onerror = tryFallback;
        a.onended = () => { if (onEnded) onEnded(); };
        a.play().catch(tryFallback);
    },

    announcerSay: function(text, onDone) {
        const key = window.BIBLE_FUN_OPENAI_API_KEY;
        if (key) {
            this.announcerSayOpenAI(text, key, onDone).catch(() => this.announcerSayBrowser(text, onDone));
        } else {
            this.announcerSayBrowser(text, onDone);
        }
    },

    // AI announcer: OpenAI TTS. Set window.BIBLE_FUN_OPENAI_API_KEY to enable.
    announcerSayOpenAI: function(text, apiKey, onDone) {
        return fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'tts-1-hd',
                voice: 'onyx',
                input: text,
                speed: 0.92
            })
        }).then(function(r) {
            if (!r.ok) throw new Error('TTS ' + r.status);
            return r.blob();
        }).then(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = new Audio(url);
            const volEl = document.getElementById('volume-slider');
            a.volume = volEl ? parseFloat(volEl.value) : 0.8;
            a.onended = a.onerror = function() {
                URL.revokeObjectURL(url);
                if (onDone) onDone();
            };
            return a.play();
        });
    },

    announcerSayBrowser: function(text, onDone) {
        if (!window.speechSynthesis) { if (onDone) onDone(); return; }
        window.speechSynthesis.cancel();
        const opts = { rate: 0.82, pitch: 0.88, volume: 1 };
        const voices = speechSynthesis.getVoices();
        const preferred = this.getPreferredVoice(voices);
        const speak = (str, endCb) => {
            const u = new SpeechSynthesisUtterance(str);
            u.rate = opts.rate;
            u.pitch = opts.pitch;
            u.volume = opts.volume;
            if (preferred) u.voice = preferred;
            u.onend = () => { if (endCb) endCb(); };
            speechSynthesis.speak(u);
        };
        const idx = text.indexOf('...');
        if (idx !== -1) {
            const part1 = text.slice(0, idx + 3).trim();
            const part2 = text.slice(idx + 3).trim();
            if (part2) {
                speak(part1);
                const u2 = new SpeechSynthesisUtterance(part2);
                u2.rate = opts.rate;
                u2.pitch = opts.pitch;
                u2.volume = opts.volume;
                if (preferred) u2.voice = preferred;
                u2.onend = () => { if (onDone) onDone(); };
                setTimeout(() => { speechSynthesis.speak(u2); }, 1200);
                return;
            }
        }
        speak(text, onDone);
    },

    enterFromSplash: function() {
        document.getElementById('splash-intro').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
    },

    goToMenu: function() {
        location.reload();
    },

    showFinish: function() {
        document.querySelectorAll('.game-container > div').forEach(d => d.classList.add('hidden'));
        document.getElementById('finish-screen').classList.remove('hidden');
        
        const sorted = [...this.players].sort((a, b) => b.score - a.score);
        document.getElementById('winner-declaration').innerText = "Wonderful Job!";
        document.getElementById('final-results-list').innerHTML = sorted.map((p, i) => {
            const nameAlreadyHasIcon = p.name && p.icon && String(p.name).trim().indexOf(p.icon) === 0;
            const label = nameAlreadyHasIcon ? p.name : (p.icon ? p.icon + (p.name ? ' ' + p.name : '') : p.name) || 'Player';
            const border = p.color ? `border-left: 4px solid ${p.color}; padding-left: 8px;` : '';
            return `<div class="result-row" style="margin:10px 0; font-size:1.2rem; ${border}">${i + 1}. ${label} <b>${p.score}</b></div>`;
        }).join('');
    }
};