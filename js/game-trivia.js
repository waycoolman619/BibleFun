/* Bible Fun - Trivia Quest (Solo default, Battle Mode: Individuals or Teams) */
const TRIVIA_COLORS = [
    { hex: '#e74c3c', label: 'Red' }, { hex: '#e67e22', label: 'Orange' }, { hex: '#f1c40f', label: 'Gold' },
    { hex: '#2ecc71', label: 'Green' }, { hex: '#1abc9c', label: 'Teal' }, { hex: '#3498db', label: 'Sky' },
    { hex: '#2980b9', label: 'Blue' }, { hex: '#9b59b6', label: 'Violet' }, { hex: '#8e44ad', label: 'Purple' },
    { hex: '#e91e63', label: 'Pink' }, { hex: '#00bcd4', label: 'Cyan' }, { hex: '#ff5722', label: 'Rust' },
    { hex: '#795548', label: 'Brown' }, { hex: '#607d8b', label: 'Slate' }, { hex: '#009688', label: 'Mint' },
    { hex: '#ffeb3b', label: 'Yellow' }, { hex: '#4caf50', label: 'Lime' }, { hex: '#2196f3', label: 'Ocean' },
    { hex: '#ff9800', label: 'Amber' }, { hex: '#f44336', label: 'Scarlet' }
];

const TriviaGame = {
    activeQuestions: [],
    currentIndex: 0,
    totalToPlay: 0,
    currentPlayerIndex: 0,
    currentTeamIndex: 0,
    playMode: 'solo',   // 'solo' | 'individuals' | 'teams'
    teams: [],          // used when playMode === 'teams'

    getSetupHTML: function() {
        let playerRows = '';
        for (let n = 1; n <= 20; n++) {
            const iconOpts = GAME_ICONS.map((ic, i) => `<option value="${i}"${i === (n - 1) % GAME_ICONS.length ? ' selected' : ''}>${ic.emoji} ${ic.label}</option>`).join('');
            playerRows += `
                <div class="t-player-row" id="t-row-${n}" style="display:none; align-items:center; gap:10px; margin-bottom:10px;">
                    <span class="t-player-num">${n}.</span>
                    <select id="t-icon-${n}" class="t-icon-select" title="Pick your icon (that's your name)">${iconOpts}</select>
                </div>`;
        }
        return `
            <div class="global-settings">
                <div class="trivia-setup-row">
                    <div class="trivia-setup-card">
                        <span class="trivia-setup-card-label">Difficulty</span>
                        <div class="trivia-option-tiles" id="t-diff-tiles">
                            <button type="button" class="trivia-option-tile selected" data-value="1" onclick="TriviaGame.pickDiff(1)">Easy</button>
                            <button type="button" class="trivia-option-tile" data-value="3" onclick="TriviaGame.pickDiff(3)">Medium</button>
                            <button type="button" class="trivia-option-tile" data-value="5" onclick="TriviaGame.pickDiff(5)">Hard</button>
                        </div>
                        <select id="t-diff" aria-hidden="true" style="position:absolute;opacity:0;pointer-events:none;height:0;width:0"><option value="1">Easy</option><option value="3">Medium</option><option value="5">Hard</option></select>
                    </div>
                    <div class="trivia-setup-card">
                        <span class="trivia-setup-card-label">Number of Questions</span>
                        <div class="trivia-option-tiles" id="t-count-tiles">
                            <button type="button" class="trivia-option-tile selected" data-value="5" onclick="TriviaGame.pickCount(5)">5</button>
                            <button type="button" class="trivia-option-tile" data-value="10" onclick="TriviaGame.pickCount(10)">10</button>
                            <button type="button" class="trivia-option-tile" data-value="20" onclick="TriviaGame.pickCount(20)">20</button>
                            <button type="button" class="trivia-option-tile" data-value="50" onclick="TriviaGame.pickCount(50)">All</button>
                        </div>
                        <select id="t-count" aria-hidden="true" style="position:absolute;opacity:0;pointer-events:none;height:0;width:0"><option value="5" selected>5</option><option value="10">10</option><option value="20">20</option><option value="50">50</option></select>
                    </div>
                </div>
                <div class="battle-mode-card">
                    <span class="setup-card-label">Play mode</span>
                    <div class="option-tiles">
                        <button type="button" class="option-tile selected" id="t-solo-tile" onclick="TriviaGame.setPlayMode(false)">Solo</button>
                        <button type="button" class="option-tile" id="t-battle-tile" onclick="TriviaGame.setPlayMode(true)">Battle</button>
                    </div>
                    <input type="checkbox" id="t-battle-mode" onchange="TriviaGame.toggleBattleMode()" aria-hidden="true" style="position:absolute;opacity:0;pointer-events:none;height:0;width:0">
                    <div id="t-battle-options" class="battle-options-inner t-battle-options" style="display:none;">
                        <div class="setup-card" id="t-battle-type-card">
                            <span class="setup-card-label">Battle as</span>
                            <div class="option-tiles">
                                <button type="button" class="option-tile selected" onclick="TriviaGame.pickBattleType('individuals')">Individuals</button>
                                <button type="button" class="option-tile" onclick="TriviaGame.pickBattleType('teams')">Teams</button>
                            </div>
                            <select id="t-battle-type" aria-hidden="true" style="position:absolute;opacity:0;height:0;width:0"><option value="individuals">Individuals</option><option value="teams">Teams</option></select>
                        </div>
                        <div id="t-individuals-block" class="t-battle-block">
                            <div class="setup-card">
                                <span class="setup-card-label">Number of Players</span>
                                <div class="option-tiles" id="t-pcount-tiles">${[2,3,4,5,6].map((n) => `<button type="button" class="option-tile${n === 2 ? ' selected' : ''}" data-value="${n}" onclick="TriviaGame.pickPcount(${n})">${n}</button>`).join('')}</div>
                                <select id="t-pcount" onchange="TriviaGame.syncPcountFromSelect()" style="position:absolute;opacity:0;height:0;width:0;pointer-events:none">${Array.from({ length: 20 }, (_, i) => `<option value="${i + 1}"${i === 1 ? ' selected' : ''}>${i + 1} Player${i !== 0 ? 's' : ''}</option>`).join('')}</select>
                            </div>
                            <div class="setting-item">
                                <label>Pick an icon for each player (that's their name)</label>
                                <div id="t-players-container" class="t-players-container">${playerRows}</div>
                            </div>
                        </div>
                        <div id="t-teams-block" class="t-battle-block" style="display:none;">
                            <div class="setup-card">
                                <span class="setup-card-label">Number of Teams</span>
                                <div class="option-tiles">
                                    <button type="button" class="option-tile selected" data-value="2" onclick="TriviaGame.pickTeamsCount(2)">2</button>
                                    <button type="button" class="option-tile" data-value="3" onclick="TriviaGame.pickTeamsCount(3)">3</button>
                                    <button type="button" class="option-tile" data-value="4" onclick="TriviaGame.pickTeamsCount(4)">4</button>
                                </div>
                                <select id="t-teams-count" aria-hidden="true" style="position:absolute;opacity:0;height:0;width:0"><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option></select>
                            </div>
                            <div class="setting-item">
                                <label>Choose a clan (logo + name) for each team</label>
                                <div class="t-clan-picks">
                                    <div class="t-clan-row"><span class="t-clan-label">Team 1</span><select id="t-clan1" class="t-clan-select">${GAME_CLANS.map((c, i) => `<option value="${i}"${i === 0 ? ' selected' : ''}>${c.emoji} ${c.name}</option>`).join('')}</select></div>
                                    <div class="t-clan-row"><span class="t-clan-label">Team 2</span><select id="t-clan2" class="t-clan-select">${GAME_CLANS.map((c, i) => `<option value="${i}"${i === 1 ? ' selected' : ''}>${c.emoji} ${c.name}</option>`).join('')}</select></div>
                                    <div class="t-clan-row" id="t-clan-row-3" style="display:none;"><span class="t-clan-label">Team 3</span><select id="t-clan3" class="t-clan-select">${GAME_CLANS.map((c, i) => `<option value="${i}"${i === 2 ? ' selected' : ''}>${c.emoji} ${c.name}</option>`).join('')}</select></div>
                                    <div class="t-clan-row" id="t-clan-row-4" style="display:none;"><span class="t-clan-label">Team 4</span><select id="t-clan4" class="t-clan-select">${GAME_CLANS.map((c, i) => `<option value="${i}"${i === 3 ? ' selected' : ''}>${c.emoji} ${c.name}</option>`).join('')}</select></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button class="btn" onclick="TriviaGame.start()">Start Quest</button>
        `;
    },

    pickDiff: function(value) {
        const sel = document.getElementById('t-diff');
        if (sel) sel.value = String(value);
        document.querySelectorAll('#t-diff-tiles .trivia-option-tile').forEach(t => {
            t.classList.toggle('selected', parseInt(t.getAttribute('data-value'), 10) === value);
        });
    },
    pickCount: function(value) {
        const sel = document.getElementById('t-count');
        if (sel) sel.value = String(value);
        document.querySelectorAll('#t-count-tiles .trivia-option-tile').forEach(t => {
            t.classList.toggle('selected', parseInt(t.getAttribute('data-value'), 10) === value);
        });
    },

    setPlayMode: function(battle) {
        const cb = document.getElementById('t-battle-mode');
        if (cb) cb.checked = battle;
        document.getElementById('t-solo-tile').classList.toggle('selected', !battle);
        document.getElementById('t-battle-tile').classList.toggle('selected', battle);
        document.getElementById('t-battle-options').style.display = battle ? 'block' : 'none';
        if (battle) this.toggleBattleType();
    },
    pickBattleType: function(type) {
        const sel = document.getElementById('t-battle-type');
        if (sel) sel.value = type;
        const card = document.getElementById('t-battle-type-card');
        if (card) card.querySelectorAll('.option-tile').forEach(t => {
            t.classList.toggle('selected', (type === 'individuals' && t.textContent.trim() === 'Individuals') || (type === 'teams' && t.textContent.trim() === 'Teams'));
        });
        this.toggleBattleType();
    },
    pickPcount: function(n) {
        const sel = document.getElementById('t-pcount');
        if (sel) sel.value = String(n);
        document.querySelectorAll('#t-pcount-tiles .option-tile').forEach(t => {
            t.classList.toggle('selected', parseInt(t.getAttribute('data-value'), 10) === n);
        });
        this.togglePlayerRows();
    },
    syncPcountFromSelect: function() {
        const n = parseInt(document.getElementById('t-pcount').value, 10);
        document.querySelectorAll('#t-pcount-tiles .option-tile').forEach(t => {
            t.classList.toggle('selected', parseInt(t.getAttribute('data-value'), 10) === n);
        });
        this.togglePlayerRows();
    },
    pickTeamsCount: function(n) {
        const sel = document.getElementById('t-teams-count');
        if (sel) sel.value = String(n);
        document.querySelectorAll('#t-teams-block .option-tiles .option-tile').forEach(t => {
            t.classList.toggle('selected', parseInt(t.getAttribute('data-value'), 10) === n);
        });
        this.toggleBattleType();
    },

    toggleBattleMode: function() {
        const on = document.getElementById('t-battle-mode').checked;
        document.getElementById('t-battle-options').style.display = on ? 'block' : 'none';
        if (document.getElementById('t-solo-tile')) document.getElementById('t-solo-tile').classList.toggle('selected', !on);
        if (document.getElementById('t-battle-tile')) document.getElementById('t-battle-tile').classList.toggle('selected', on);
        if (on) this.toggleBattleType();
    },

    toggleBattleType: function() {
        const type = document.getElementById('t-battle-type').value;
        document.getElementById('t-individuals-block').style.display = type === 'individuals' ? 'block' : 'none';
        document.getElementById('t-teams-block').style.display = type === 'teams' ? 'block' : 'none';
        const n = parseInt(document.getElementById('t-teams-count').value) || 2;
        const row3 = document.getElementById('t-clan-row-3');
        const row4 = document.getElementById('t-clan-row-4');
        if (row3) row3.style.display = n >= 3 ? 'flex' : 'none';
        if (row4) row4.style.display = n >= 4 ? 'flex' : 'none';
        if (type === 'individuals') this.togglePlayerRows();
    },

    togglePlayerRows: function() {
        const n = parseInt(document.getElementById('t-pcount').value) || 1;
        for (let i = 1; i <= 20; i++) {
            const row = document.getElementById('t-row-' + i);
            if (row) row.style.display = i <= n ? 'flex' : 'none';
        }
    },

    start: function() {
        const battleMode = document.getElementById('t-battle-mode').checked;
        const diff = parseInt(document.getElementById('t-diff').value);
        const countRequest = parseInt(document.getElementById('t-count').value);

        let pool = BibleDatabase.filter(q => q.type === 'multiple' && q.difficulty === diff);
        // Dedupe by question text so the same question never appears twice in one game.
        const seen = new Set();
        pool = pool.filter(q => {
            const key = (q.q || '').trim().toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
        // Shuffle with Fisher-Yates for truly random order; then take the requested count.
        pool = shuffleArray(pool);
        const take = Math.min(countRequest, pool.length);
        this.activeQuestions = pool.slice(0, take);
        this.totalToPlay = this.activeQuestions.length;
        this.currentIndex = 0;

        if (!battleMode) {
            this.playMode = 'solo';
            GameManager.players = [{ icon: '📖', color: '#f1c40f', score: 0, name: '📖' }];
            this.currentPlayerIndex = 0;
            this.teams = [];
        } else {
            const battleType = document.getElementById('t-battle-type').value;
            if (battleType === 'individuals') {
                this.playMode = 'individuals';
                this.teams = [];
                const pcount = Math.min(20, Math.max(1, parseInt(document.getElementById('t-pcount').value) || 1));
                GameManager.players = [];
                for (let i = 1; i <= pcount; i++) {
                    const iconEl = document.getElementById('t-icon-' + i);
                    const idx = iconEl ? parseInt(iconEl.value, 10) : (i - 1) % GAME_ICONS.length;
                    const choice = GAME_ICONS[Math.min(idx, GAME_ICONS.length - 1)] || GAME_ICONS[0];
                    GameManager.players.push({
                        icon: choice.emoji,
                        name: choice.label,
                        score: 0
                    });
                }
                this.currentPlayerIndex = 0;
            } else {
                this.playMode = 'teams';
                const nTeams = Math.min(4, Math.max(2, parseInt(document.getElementById('t-teams-count').value) || 2));
                this.teams = [];
                for (let i = 1; i <= nTeams; i++) {
                    const clanEl = document.getElementById('t-clan' + i);
                    const idx = clanEl ? parseInt(clanEl.value, 10) : i - 1;
                    const clan = GAME_CLANS[Math.min(idx, GAME_CLANS.length - 1)] || GAME_CLANS[0];
                    this.teams.push({ name: clan.name, icon: clan.emoji, score: 0 });
                }
                GameManager.players = this.teams.map(t => ({ name: t.icon + ' ' + t.name, score: t.score, icon: t.icon }));
                this.currentTeamIndex = 0;
            }
        }

        document.getElementById('setup-screen').classList.add('hidden');
        GameManager.showGameIntroSplash('Welcome to Trivia Quest', 'Your quest starts now.');
        const self = this;
        GameManager.announceGame('multiple', function() {
            GameManager.hideGameIntroSplash();
            document.getElementById('game-play').classList.remove('hidden');
            self.loadQuestion();
        });
    },

    loadQuestion: function() {
        const qData = this.activeQuestions[this.currentIndex];
        const progress = `(${this.currentIndex + 1}/${this.totalToPlay})`;

        if (this.playMode === 'solo') {
            const p = GameManager.players[0];
            document.getElementById('display-player-name').innerText = 'Your turn ' + progress;
            document.getElementById('score').innerText = p.score;
        } else if (this.playMode === 'individuals') {
            const p = GameManager.players[this.currentPlayerIndex];
            document.getElementById('display-player-name').innerText = `${p.icon} ${p.name}'s turn ${progress}`;
            const scoreLine = GameManager.players.map(pl => `${pl.icon} ${pl.name}: ${pl.score}`).join('  ·  ');
            document.getElementById('score').innerText = scoreLine;
        } else {
            const t = this.teams[this.currentTeamIndex];
            document.getElementById('display-player-name').innerHTML = `<span class="t-clan-turn">${t.icon} ${t.name}</span>'s turn ${progress}`;
            document.getElementById('score').innerText = this.teams.map(te => `${te.icon} ${te.name}: ${te.score}`).join('  ·  ');
        }

        document.getElementById('question-box').innerText = qData.q;
        document.getElementById('feedback').innerText = '';

        if (this.playMode === 'individuals') {
            const p = GameManager.players[this.currentPlayerIndex];
            GameManager.speakTurn(p.name + "'s turn", () => GameManager.readQuestion(qData.q));
        } else if (this.playMode === 'teams') {
            const t = this.teams[this.currentTeamIndex];
            GameManager.speakTurn(t.name + "'s turn", () => GameManager.readQuestion(qData.q));
        } else {
            GameManager.readQuestion(qData.q);
        }

        const optCont = document.getElementById('options-container');
        optCont.innerHTML = '';
        const choices = shuffleArray([qData.a, ...qData.distractors]);
        choices.forEach(opt => {
            const b = document.createElement('button');
            b.className = 'btn';
            b.innerText = opt;
            b.onclick = () => this.check(opt, qData.a);
            optCont.appendChild(b);
        });

        const quitBtn = document.createElement('button');
        quitBtn.className = 'btn-outline';
        quitBtn.style.marginTop = '20px';
        quitBtn.innerText = 'Quit Game';
        quitBtn.onclick = () => {
            if (confirm('Are you sure you want to quit? Your progress will be lost.')) GameManager.goToMenu();
        };
        optCont.appendChild(quitBtn);
    },

    check: function(guess, correct) {
        document.querySelectorAll('#options-container .btn').forEach(b => b.disabled = true);

        if (guess === correct) {
            if (this.playMode === 'teams') {
                this.teams[this.currentTeamIndex].score += 10;
                GameManager.players[this.currentTeamIndex].score = this.teams[this.currentTeamIndex].score;
            } else {
                GameManager.players[this.currentPlayerIndex].score += 10;
            }
            document.getElementById('feedback').innerText = '✅ Well done!';
            document.getElementById('feedback').style.color = 'green';
            GameManager.playSound('correct', this.advanceAfterSound.bind(this));
        } else {
            document.getElementById('feedback').innerText = `❌ Oops! It was ${correct}`;
            document.getElementById('feedback').style.color = 'red';
            GameManager.playSound('wrong', this.advanceAfterSound.bind(this));
        }

        this.currentIndex++;
        if (this.playMode === 'individuals') {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % GameManager.players.length;
        } else if (this.playMode === 'teams') {
            this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teams.length;
        }
    },

    advanceAfterSound: function() {
        if (this.currentIndex >= this.activeQuestions.length) {
            GameManager.showFinish();
        } else {
            this.loadQuestion();
        }
    },
};

GameManager.registerGame('multiple', TriviaGame);
