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
                <div class="setting-item">
                    <label>Difficulty</label>
                    <select id="t-diff">
                        <option value="1">Easy</option>
                        <option value="3">Medium</option>
                        <option value="5">Hard</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label>Number of Questions</label>
                    <select id="t-count">
                        <option value="5">5 Questions</option>
                        <option value="10">10 Questions</option>
                        <option value="20">20 Questions</option>
                        <option value="50">All Available</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label class="t-toggle-label">
                        <input type="checkbox" id="t-battle-mode" onchange="TriviaGame.toggleBattleMode()">
                        Battle Mode
                    </label>
                    <p class="t-hint">Play with others: individuals or teams.</p>
                </div>
                <div id="t-battle-options" class="t-battle-options" style="display:none;">
                    <div class="setting-item">
                        <label>Battle as</label>
                        <select id="t-battle-type" onchange="TriviaGame.toggleBattleType()">
                            <option value="individuals">Individuals</option>
                            <option value="teams">Teams</option>
                        </select>
                    </div>
                    <div id="t-individuals-block" class="t-battle-block">
                        <div class="setting-item">
                            <label>Number of Players</label>
                            <select id="t-pcount" onchange="TriviaGame.togglePlayerRows()">${Array.from({ length: 20 }, (_, i) => `<option value="${i + 1}"${i === 1 ? ' selected' : ''}>${i + 1} Player${i !== 0 ? 's' : ''}</option>`).join('')}</select>
                        </div>
                        <div class="setting-item">
                            <label>Pick an icon for each player (that's their name)</label>
                            <div id="t-players-container" class="t-players-container">${playerRows}</div>
                        </div>
                    </div>
                    <div id="t-teams-block" class="t-battle-block" style="display:none;">
                        <div class="setting-item">
                            <label>Number of Teams</label>
                            <select id="t-teams-count" onchange="TriviaGame.toggleBattleType()">
                                <option value="2">2 Teams</option>
                                <option value="3">3 Teams</option>
                                <option value="4">4 Teams</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label>Choose a clan (logo + name) for each team</label>
                            <div class="t-clan-picks">
                                <div class="t-clan-row">
                                    <span class="t-clan-label">Team 1</span>
                                    <select id="t-clan1" class="t-clan-select">${GAME_CLANS.map((c, i) => `<option value="${i}"${i === 0 ? ' selected' : ''}>${c.emoji} ${c.name}</option>`).join('')}</select>
                                </div>
                                <div class="t-clan-row">
                                    <span class="t-clan-label">Team 2</span>
                                    <select id="t-clan2" class="t-clan-select">${GAME_CLANS.map((c, i) => `<option value="${i}"${i === 1 ? ' selected' : ''}>${c.emoji} ${c.name}</option>`).join('')}</select>
                                </div>
                                <div class="t-clan-row" id="t-clan-row-3" style="display:none;">
                                    <span class="t-clan-label">Team 3</span>
                                    <select id="t-clan3" class="t-clan-select">${GAME_CLANS.map((c, i) => `<option value="${i}"${i === 2 ? ' selected' : ''}>${c.emoji} ${c.name}</option>`).join('')}</select>
                                </div>
                                <div class="t-clan-row" id="t-clan-row-4" style="display:none;">
                                    <span class="t-clan-label">Team 4</span>
                                    <select id="t-clan4" class="t-clan-select">${GAME_CLANS.map((c, i) => `<option value="${i}"${i === 3 ? ' selected' : ''}>${c.emoji} ${c.name}</option>`).join('')}</select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button class="btn" onclick="TriviaGame.start()">Start Quest</button>
        `;
    },

    toggleBattleMode: function() {
        const on = document.getElementById('t-battle-mode').checked;
        document.getElementById('t-battle-options').style.display = on ? 'block' : 'none';
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
        pool.sort(() => Math.random() - 0.5);
        this.activeQuestions = pool.slice(0, countRequest);
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
        const choices = [qData.a, ...qData.distractors].sort(() => Math.random() - 0.5);
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
