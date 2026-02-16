/* Bible Fun v2.0.4 - Jeopardy with Epic Video Intro */
const JeopardyGame = {
    activeClue: null,
    topics: [], // Filled from BibleDatabase so every category has questions
    boardClues: {}, // Pre-assigned clue per (category, value) so each game uses different questions
    currentPlayerIndex: 0,
    boardData: {},

    getSetupHTML: function() {
        return `
            <div class="global-settings">
                <div class="setup-row setup-row-single">
                    <div class="setup-card" id="j-pcount-card">
                        <span class="setup-card-label">Number of Players</span>
                        <div class="option-tiles">
                            <button type="button" class="option-tile selected" data-value="1" onclick="JeopardyGame.pickPlayerCount(1)">1</button>
                            <button type="button" class="option-tile" data-value="2" onclick="JeopardyGame.pickPlayerCount(2)">2</button>
                            <button type="button" class="option-tile" data-value="3" onclick="JeopardyGame.pickPlayerCount(3)">3</button>
                            <button type="button" class="option-tile" data-value="4" onclick="JeopardyGame.pickPlayerCount(4)">4</button>
                        </div>
                        <select id="j-pcount" onchange="JeopardyGame.togglePlayerNames()" aria-hidden="true" style="position:absolute;opacity:0;height:0;width:0"><option value="1" selected>1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>
                    </div>
                </div>
                <div id="j-names-container" class="j-names-container">
                    <p class="t-hint" style="margin-bottom:10px;">Enter each player's name, or use the mic to speak it.</p>
                    <div class="setting-item j-name-row" id="j-name-row-1">
                        <label>Player 1</label>
                        <div class="j-name-input-row">
                            <input type="text" id="j-name1" class="j-name-input" placeholder="Type or say your name" maxlength="30">
                            <button type="button" class="j-name-mic-btn" title="Speak your name" onclick="JeopardyGame.startNameInput(1)">🎤</button>
                        </div>
                    </div>
                    <div class="setting-item j-name-row" id="j-name-row-2" style="display:none;">
                        <label>Player 2</label>
                        <div class="j-name-input-row">
                            <input type="text" id="j-name2" class="j-name-input" placeholder="Type or say your name" maxlength="30">
                            <button type="button" class="j-name-mic-btn" title="Speak your name" onclick="JeopardyGame.startNameInput(2)">🎤</button>
                        </div>
                    </div>
                    <div class="setting-item j-name-row" id="j-name-row-3" style="display:none;">
                        <label>Player 3</label>
                        <div class="j-name-input-row">
                            <input type="text" id="j-name3" class="j-name-input" placeholder="Type or say your name" maxlength="30">
                            <button type="button" class="j-name-mic-btn" title="Speak your name" onclick="JeopardyGame.startNameInput(3)">🎤</button>
                        </div>
                    </div>
                    <div class="setting-item j-name-row" id="j-name-row-4" style="display:none;">
                        <label>Player 4</label>
                        <div class="j-name-input-row">
                            <input type="text" id="j-name4" class="j-name-input" placeholder="Type or say your name" maxlength="30">
                            <button type="button" class="j-name-mic-btn" title="Speak your name" onclick="JeopardyGame.startNameInput(4)">🎤</button>
                        </div>
                    </div>
                </div>
            </div>
            <button class="btn" onclick="JeopardyGame.start()">Enter Game</button>
        `;
    },

    pickPlayerCount: function(n) {
        const sel = document.getElementById('j-pcount');
        if (sel) sel.value = String(n);
        const card = document.getElementById('j-pcount-card');
        if (card) card.querySelectorAll('.option-tile').forEach(t => { t.classList.toggle('selected', parseInt(t.getAttribute('data-value'), 10) === n); });
        this.togglePlayerNames();
    },

    togglePlayerNames: function() {
        const n = parseInt(document.getElementById('j-pcount').value) || 1;
        const card = document.getElementById('j-pcount-card');
        if (card) card.querySelectorAll('.option-tile').forEach(t => { t.classList.toggle('selected', parseInt(t.getAttribute('data-value'), 10) === n); });
        for (let i = 1; i <= 4; i++) {
            const row = document.getElementById('j-name-row-' + i);
            if (row) row.style.display = i <= n ? 'block' : 'none';
        }
    },

    startNameInput: function(playerNum) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech input is not supported in this browser. Try Chrome or Edge.');
            return;
        }
        const input = document.getElementById('j-name' + playerNum);
        if (!input) return;
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';
        rec.onresult = function(e) {
            const transcript = (e.results[0][0].transcript || '').trim();
            if (transcript) input.value = transcript;
        };
        rec.onerror = function() { /* ignore */ };
        rec.start();
    },

    start: function() {
        const count = Math.min(4, Math.max(1, parseInt(document.getElementById('j-pcount').value) || 1));
        GameManager.players = [];
        for (let i = 1; i <= count; i++) {
            const nameEl = document.getElementById('j-name' + i);
            const name = (nameEl && nameEl.value) ? nameEl.value.trim() : '';
            GameManager.players.push({
                name: name || ('Player ' + i),
                score: 0
            });
        }

        // Use only topics that have multiple-choice questions in the database; pick 6 at random each game
        const topicSet = {};
        BibleDatabase.filter(q => q.type === 'multiple').forEach(q => { topicSet[q.topic] = true; });
        let allTopics = Object.keys(topicSet);
        if (allTopics.length === 0) {
            alert("No trivia questions in the database.");
            return;
        }
        allTopics = shuffleArray(allTopics);
        this.topics = allTopics.length > 6 ? allTopics.slice(0, 6) : allTopics;

        // Pre-assign one clue per (category, value) so this game uses a fixed set and the next game gets different ones
        this.boardClues = {};
        const values = [200, 400, 600, 800, 1000];
        this.topics.forEach(cat => {
            const pool = BibleDatabase.filter(q => q.topic === cat && q.type === 'multiple');
            const shuffled = shuffleArray(pool);
            values.forEach((val, idx) => {
                const q = shuffled[idx % shuffled.length];
                if (q) this.boardClues[cat + '-' + val] = q;
            });
        });

        this.currentPlayerIndex = 0;
        this.boardData = {};
        this.selectedCategory = null;

        document.getElementById('setup-screen').classList.add('hidden');

        const videoCont = document.getElementById('video-intro-container');
        const video = document.getElementById('intro-video');
        const introSpeech = document.getElementById('jeopardy-intro-speech');

        video.onended = () => { this.skipVideo(); };
        video.onerror = () => { this.skipVideo(); }; // no video file? go straight to board
        video.ontimeupdate = function() {
            if (video.duration && !isNaN(video.duration) && video.currentTime >= video.duration - 3) {
                video.ontimeupdate = null;
                JeopardyGame.skipVideo();
            }
        };

        videoCont.classList.remove('hidden');
        video.volume = 0.65;
        video.play().catch(() => { this.skipVideo(); });

        if (introSpeech && document.getElementById('sound-on') && document.getElementById('sound-on').checked) {
            introSpeech.currentTime = 0;
            introSpeech.volume = 1;
            setTimeout(function() {
                introSpeech.play().catch(function() {});
            }, 1000);
        }
    },

    skipVideo: function() {
        const videoCont = document.getElementById('video-intro-container');
        const video = document.getElementById('intro-video');
        const introSpeech = document.getElementById('jeopardy-intro-speech');
        video.pause();
        if (introSpeech) {
            introSpeech.pause();
            introSpeech.currentTime = 0;
        }
        videoCont.classList.add('hidden');
        
        // Show board with fade-in effect
        const board = document.getElementById('jeopardy-board');
        board.classList.remove('hidden');
        board.classList.add('fade-in');
        
        this.renderBoard();

        // Go straight to the first player: "[Name], you can choose a category."
        const firstName = GameManager.players[0] && GameManager.players[0].name ? GameManager.players[0].name : 'Player 1';
        GameManager.speakTurn(firstName + ', you can choose a category.', function() {});
    },

    renderBoard: function() {
        const scoreboard = document.getElementById('j-turn-display');
        scoreboard.innerHTML = GameManager.players.map((p, i) => `
            <div class="player-score-box ${i === this.currentPlayerIndex ? 'active-player' : ''}">
                <span class="p-name">${(p.name || ('Player ' + (i + 1)))}</span>
                <span class="p-amount">$${p.score}</span>
            </div>
        `).join('');

        const chooseRow = document.getElementById('j-choose-row');
        if (chooseRow) {
            chooseRow.innerHTML = `
                <p class="j-choose-hint">You could say: &ldquo;I would like Miracles for \$200, please.&rdquo; Or click a category, then a dollar amount.</p>
                <div class="j-choose-mic-row">
                    <button type="button" class="j-choose-mic-btn" title="Click to speak your choice" onclick="JeopardyGame.startBoardChoiceVoice()">🎤 Click to speak</button>
                    <span id="j-listening-indicator" class="j-listening-indicator hidden">Listening…</span>
                    <span id="j-heard-text" class="j-heard-text hidden"></span>
                </div>
            `;
        }

        const grid = document.getElementById('j-grid');
        grid.innerHTML = '';
        const self = this;

        this.topics.forEach(cat => {
            const head = document.createElement('div');
            head.className = 'j-header' + (this.selectedCategory === cat ? ' j-header-selected' : '');
            head.innerText = cat;
            head.onclick = function() {
                JeopardyGame.selectedCategory = JeopardyGame.selectedCategory === cat ? null : cat;
                JeopardyGame.renderBoard();
            };
            grid.appendChild(head);
        });

        for (let row = 1; row <= 5; row++) {
            const val = row * 200;
            this.topics.forEach(cat => {
                const cell = document.createElement('div');
                const key = `${cat}-${val}`;
                const used = this.boardData[key];
                const inSelectedCol = this.selectedCategory === cat;
                const canClick = !used && (!this.selectedCategory || inSelectedCol);
                cell.className = 'j-cell' + (inSelectedCol ? ' j-cell-in-selected-column' : '') + (used ? ' used' : '');
                if (used) {
                    cell.innerText = '';
                } else {
                    cell.innerText = `$${val}`;
                    if (canClick) {
                        cell.onclick = function() {
                            JeopardyGame.ask(cat, val, key);
                        };
                    }
                }
                grid.appendChild(cell);
            });
        }
    },

    _clueSplashVal: null,

    startBoardChoiceVoice: function() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech input is not supported in this browser. Try Chrome or Edge.');
            return;
        }
        const indicator = document.getElementById('j-listening-indicator');
        if (indicator) { indicator.classList.remove('hidden'); indicator.textContent = 'Listening…'; }
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';
        rec.onresult = function(e) {
            const transcript = (e.results[0][0].transcript || '').trim();
            if (indicator) { indicator.classList.add('hidden'); }
            JeopardyGame._showHeard(transcript);
            if (transcript && transcript.length >= 3) JeopardyGame.tryPickClueFromSpeech(transcript);
        };
        rec.onerror = rec.onend = function() {
            if (indicator) indicator.classList.add('hidden');
        };
        rec.start();
    },

    _showHeard: function(text) {
        const el = document.getElementById('j-heard-text');
        if (!el) return;
        if (!text) { el.classList.add('hidden'); el.textContent = ''; return; }
        el.textContent = 'Heard: ' + text;
        el.classList.remove('hidden');
    },

    tryPickClueFromSpeech: function(raw) {
        const lowerWithSpace = raw.toLowerCase().replace(/\s+/g, ' ').trim();
        let foundCat = null;
        for (let i = 0; i < this.topics.length; i++) {
            const t = this.topics[i];
            const tLower = t.toLowerCase();
            if (lowerWithSpace.includes(tLower)) { foundCat = t; break; }
            if (tLower.endsWith('s') && lowerWithSpace.includes(tLower.slice(0, -1))) { foundCat = t; break; }
            const first4 = tLower.slice(0, 4);
            if (first4.length >= 4 && lowerWithSpace.includes(first4)) { foundCat = t; break; }
        }
        const valuePatterns = [
            [200, ['200', 'two hundred', '2 hundred', 'for 200', 'for two hundred', '$200']],
            [400, ['400', 'four hundred', '4 hundred', 'for 400', 'for four hundred', '$400']],
            [600, ['600', 'six hundred', '6 hundred', 'for 600', 'for six hundred', '$600']],
            [800, ['800', 'eight hundred', '8 hundred', 'for 800', 'for eight hundred', '$800']],
            [1000, ['1000', 'one thousand', 'a thousand', '1 thousand', 'for 1000', 'for one thousand', '$1000']]
        ];
        let foundVal = null;
        for (let i = 0; i < valuePatterns.length; i++) {
            const pair = valuePatterns[i];
            const v = pair[0];
            const patterns = pair[1];
            for (let j = 0; j < patterns.length; j++) {
                if (lowerWithSpace.includes(patterns[j])) { foundVal = v; break; }
            }
            if (foundVal != null) break;
        }
        if (!foundCat || !foundVal) {
            if (window.speechSynthesis) {
                const u = new SpeechSynthesisUtterance('Can you say that again? I couldn\'t quite hear you.');
                u.rate = 0.9;
                const voices = GameManager.getVoices();
                const preferred = GameManager.getPreferredVoice(voices);
                if (preferred) u.voice = preferred;
                speechSynthesis.speak(u);
            }
            return;
        }
        const heardEl = document.getElementById('j-heard-text');
        if (heardEl) heardEl.classList.add('hidden');
        const key = foundCat + '-' + foundVal;
        if (this.boardData[key]) {
            if (window.speechSynthesis) {
                const u = new SpeechSynthesisUtterance('That\'s not available. Choose another one.');
                u.rate = 0.9;
                const voices = GameManager.getVoices();
                const preferred = GameManager.getPreferredVoice(voices);
                if (preferred) u.voice = preferred;
                speechSynthesis.speak(u);
            }
            return;
        }
        this.ask(foundCat, foundVal, key);
    },

    ask: function(cat, val, key) {
        this.activeClue = this.boardClues[key];
        if (!this.activeClue) return;
        this.selectedCategory = null;
        this.boardData[key] = true;
        this._clueSplashVal = val;

        const clueText = this.activeClue.clue || this.activeClue.q;
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        document.getElementById('jeopardy-board').classList.add('hidden');
        document.getElementById('j-clue-splash-text').innerText = clueText;
        document.getElementById('j-clue-splash').classList.remove('hidden');
        GameManager.readQuestion(clueText);

        if (this._clueSplashTimeout) clearTimeout(this._clueSplashTimeout);
        this._clueSplashTimeout = setTimeout(function() { JeopardyGame.dismissClueSplash(); }, 6000);
    },

    dismissClueSplash: function() {
        if (this._clueSplashTimeout) {
            clearTimeout(this._clueSplashTimeout);
            this._clueSplashTimeout = null;
        }
        const splash = document.getElementById('j-clue-splash');
        if (!splash || splash.classList.contains('hidden')) return;
        splash.classList.add('hidden');

        const val = this._clueSplashVal;
        if (val == null) return;
        this._clueSplashVal = null;
        this._currentClueVal = val;

        document.getElementById('game-play').classList.remove('hidden');
        const cur = GameManager.players[this.currentPlayerIndex];
        const curName = cur.name || ('Player ' + (this.currentPlayerIndex + 1));
        const cat = this.activeClue && this.activeClue.topic ? this.activeClue.topic : '';
        document.getElementById('display-player-name').innerText = `${curName}: ${cat} for $${val}`;
        const clueText = this.activeClue.clue || this.activeClue.q;
        document.getElementById('question-box').innerText = clueText;
        document.getElementById('feedback').innerText = '';

        const optCont = document.getElementById('options-container');
        optCont.innerHTML = `
            <p class="j-answer-hint">Answer in the form: <strong>Who is ___ ?</strong> or <strong>What is ___ ?</strong></p>
            <div class="j-answer-row">
                <input type="text" id="j-ans" class="btn j-ans-input" placeholder="e.g. Who is Moses? or What is Bethlehem?">
                <button type="button" class="btn j-mic-btn" id="j-mic-btn" title="Speak your answer" onclick="JeopardyGame.startVoiceInput()">🎤 Speak</button>
            </div>
            <button class="btn" onclick="JeopardyGame.check(${val})">Submit Answer</button>
        `;

        // After splash: announcer says the player's name, then "you can answer"
        GameManager.speakTurn(curName + ', you can answer.', function() {});
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
            if (transcript && JeopardyGame._currentClueVal != null) {
                document.getElementById('feedback').innerText = 'Submitting…';
                JeopardyGame.check(JeopardyGame._currentClueVal);
            } else {
                document.getElementById('feedback').innerText = transcript ? 'Got it. Submit when ready.' : '';
            }
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
            const cur = GameManager.players[this.currentPlayerIndex];
            const name = cur && cur.name ? cur.name : ('Player ' + (this.currentPlayerIndex + 1));
            GameManager.speakTurn(name + ', you can choose a category and a dollar amount.', function() {});
        }, 4000);
    }
};

GameManager.registerGame('jeopardy', JeopardyGame);