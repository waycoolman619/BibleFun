/* Bible Fun v2.0.2 - Jeopardy with Epic Video Intro */
const JeopardyGame = {
    activeClue: null,
    topics: [], // Filled from BibleDatabase so every category has questions
    currentPlayerIndex: 0,
    boardData: {},

    getSetupHTML: function() {
        return `
            <div class="global-settings">
                <div class="setting-item">
                    <label>Number of Players</label>
                    <select id="j-pcount" onchange="JeopardyGame.togglePlayerNames()">
                        <option value="1">1 Player</option>
                        <option value="2">2 Players</option>
                        <option value="3">3 Players</option>
                        <option value="4">4 Players</option>
                    </select>
                </div>
                <div id="j-names-container" style="display:none;">
                    <p class="t-hint" style="margin-bottom:10px;">Choose who you want to be (Lion, Bear, Wolf, etc.)</p>
                    <div class="setting-item j-name-row" id="j-name-row-1">
                        <label>Player 1</label>
                        <select id="j-icon1" class="t-icon-select">${GAME_ICONS.map((ic, i) => `<option value="${i}"${i === 0 ? ' selected' : ''}>${ic.emoji} ${ic.label}</option>`).join('')}</select>
                    </div>
                    <div class="setting-item j-name-row" id="j-name-row-2">
                        <label>Player 2</label>
                        <select id="j-icon2" class="t-icon-select">${GAME_ICONS.map((ic, i) => `<option value="${i}"${i === 1 ? ' selected' : ''}>${ic.emoji} ${ic.label}</option>`).join('')}</select>
                    </div>
                    <div class="setting-item j-name-row" id="j-name-row-3">
                        <label>Player 3</label>
                        <select id="j-icon3" class="t-icon-select">${GAME_ICONS.map((ic, i) => `<option value="${i}"${i === 2 ? ' selected' : ''}>${ic.emoji} ${ic.label}</option>`).join('')}</select>
                    </div>
                    <div class="setting-item j-name-row" id="j-name-row-4">
                        <label>Player 4</label>
                        <select id="j-icon4" class="t-icon-select">${GAME_ICONS.map((ic, i) => `<option value="${i}"${i === 3 ? ' selected' : ''}>${ic.emoji} ${ic.label}</option>`).join('')}</select>
                    </div>
                </div>
            </div>
            <button class="btn" onclick="JeopardyGame.start()">Enter Game</button>
        `;
    },

    togglePlayerNames: function() {
        const n = parseInt(document.getElementById('j-pcount').value) || 1;
        const container = document.getElementById('j-names-container');
        if (!container) return;
        container.style.display = n >= 2 ? 'block' : 'none';
        for (let i = 1; i <= 4; i++) {
            const row = document.getElementById('j-name-row-' + i);
            if (row) row.style.display = i <= n ? 'block' : 'none';
        }
    },

    start: function() {
        const count = Math.min(4, Math.max(1, parseInt(document.getElementById('j-pcount').value) || 1));
        GameManager.players = [];
        if (count === 1) {
            GameManager.players.push({ name: 'Player 1', score: 0 });
        } else {
            for (let i = 1; i <= count; i++) {
                const iconEl = document.getElementById('j-icon' + i);
                const idx = iconEl ? parseInt(iconEl.value, 10) : (i - 1) % GAME_ICONS.length;
                const choice = GAME_ICONS[Math.min(idx, GAME_ICONS.length - 1)] || GAME_ICONS[0];
                GameManager.players.push({ name: choice.label, icon: choice.emoji, score: 0 });
            }
        }

        // Use only topics that have multiple-choice questions in the database; pick 6 at random each game
        const topicSet = {};
        BibleDatabase.filter(q => q.type === 'multiple').forEach(q => { topicSet[q.topic] = true; });
        let allTopics = Object.keys(topicSet);
        if (allTopics.length === 0) {
            alert("No trivia questions in the database.");
            return;
        }
        allTopics = allTopics.sort(() => Math.random() - 0.5);
        this.topics = allTopics.length > 6 ? allTopics.slice(0, 6) : allTopics;

        this.currentPlayerIndex = 0;
        this.boardData = {};

        document.getElementById('setup-screen').classList.add('hidden');

        const videoCont = document.getElementById('video-intro-container');
        const video = document.getElementById('intro-video');

        video.onended = () => { this.skipVideo(); };
        video.onerror = () => { this.skipVideo(); }; // no video file? go straight to board

        videoCont.classList.remove('hidden');
        video.play().catch(() => { this.skipVideo(); });
    },

    skipVideo: function() {
        const videoCont = document.getElementById('video-intro-container');
        const video = document.getElementById('intro-video');
        video.pause();
        videoCont.classList.add('hidden');
        
        // Show board with fade-in effect
        const board = document.getElementById('jeopardy-board');
        board.classList.remove('hidden');
        board.classList.add('fade-in');
        
        this.renderBoard();
    },

    renderBoard: function() {
        const scoreboard = document.getElementById('j-turn-display');
        scoreboard.innerHTML = GameManager.players.map((p, i) => `
            <div class="player-score-box ${i === this.currentPlayerIndex ? 'active-player' : ''}">
                <span class="p-name">${p.icon ? p.icon + ' ' : ''}${p.name}</span>
                <span class="p-amount">$${p.score}</span>
            </div>
        `).join('');

        const grid = document.getElementById('j-grid');
        grid.innerHTML = '';
        
        this.topics.forEach(cat => {
            const head = document.createElement('div');
            head.className = 'j-header';
            head.innerText = cat;
            grid.appendChild(head);
        });

        for (let row = 1; row <= 5; row++) {
            const val = row * 200;
            this.topics.forEach(cat => {
                const cell = document.createElement('div');
                cell.className = 'j-cell';
                const key = `${cat}-${val}`;
                if (this.boardData[key]) cell.classList.add('used');
                else {
                    cell.innerText = `$${val}`;
                    cell.onclick = () => this.ask(cat, val, key);
                }
                grid.appendChild(cell);
            });
        }
    },

    ask: function(cat, val, key) {
        const pool = BibleDatabase.filter(q => q.topic === cat && q.type === 'multiple');
        if (!pool.length) return;
        this.activeClue = pool[Math.floor(Math.random() * pool.length)];
        this.boardData[key] = true;

        document.getElementById('jeopardy-board').classList.add('hidden');
        document.getElementById('game-play').classList.remove('hidden');
        
        const cur = GameManager.players[this.currentPlayerIndex];
        document.getElementById('display-player-name').innerText = `${cur.icon ? cur.icon + ' ' : ''}${cur.name}: ${cat} for $${val}`;
        const clueText = this.activeClue.clue || this.activeClue.q;
        document.getElementById('question-box').innerText = clueText;
        document.getElementById('feedback').innerText = '';
        GameManager.readQuestion(clueText);
        
        const optCont = document.getElementById('options-container');
        optCont.innerHTML = `
            <p class="j-answer-hint">Answer in the form: <strong>Who is ___ ?</strong> or <strong>What is ___ ?</strong></p>
            <div class="j-answer-row">
                <input type="text" id="j-ans" class="btn j-ans-input" placeholder="e.g. Who is Moses? or What is Bethlehem?">
                <button type="button" class="btn j-mic-btn" id="j-mic-btn" title="Speak your answer" onclick="JeopardyGame.startVoiceInput()">🎤 Speak</button>
            </div>
            <button class="btn" onclick="JeopardyGame.check(${val})">Submit Answer</button>
        `;
        document.getElementById('j-ans').focus();
    },

    startVoiceInput: function() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            document.getElementById('feedback').innerText = 'Speech input is not supported in this browser. Try Chrome or Edge.';
            return;
        }
        const input = document.getElementById('j-ans');
        const btn = document.getElementById('j-mic-btn');
        if (!input || !btn) return;
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';
        btn.disabled = true;
        btn.textContent = 'Listening…';
        document.getElementById('feedback').innerText = 'Listening… say your answer.';
        rec.onresult = function(e) {
            const transcript = (e.results[0][0].transcript || '').trim();
            input.value = transcript;
            btn.disabled = false;
            btn.textContent = '🎤 Speak';
            document.getElementById('feedback').innerText = transcript ? 'Got it. Submit when ready.' : '';
        };
        rec.onerror = rec.onend = function() {
            btn.disabled = false;
            btn.textContent = '🎤 Speak';
            if (document.getElementById('feedback').innerText === 'Listening… say your answer.') document.getElementById('feedback').innerText = '';
        };
        rec.start();
    },

    normalizeJeopardyAnswer: function(text) {
        if (!text) return '';
        let t = text.toLowerCase().trim().replace(/\?+$/, '').trim();
        const prefixes = ['who is ', 'what is ', 'who was ', 'what was ', 'who are ', 'what are '];
        for (const p of prefixes) {
            if (t.startsWith(p)) { t = t.slice(p.length).trim(); break; }
        }
        return t;
    },

    check: function(val) {
        const rawGuess = document.getElementById('j-ans').value.trim();
        const guess = this.normalizeJeopardyAnswer(rawGuess);
        const correct = this.activeClue.a.toLowerCase().trim();
        
        if (guess === correct) {
            GameManager.players[this.currentPlayerIndex].score += val;
            GameManager.playSound('correct');
            document.getElementById('feedback').innerText = "✅ Correct!";
        } else {
            GameManager.playSound('wrong');
            document.getElementById('feedback').innerText = `❌ No, it was: ${this.activeClue.a}`;
        }
        
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % GameManager.players.length;
        
        setTimeout(() => {
            document.getElementById('game-play').classList.add('hidden');
            document.getElementById('jeopardy-board').classList.remove('hidden');
            this.renderBoard();
        }, 2000);
    }
};

GameManager.registerGame('jeopardy', JeopardyGame);