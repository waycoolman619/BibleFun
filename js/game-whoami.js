/* Bible Fun - Who Am I? (Solo default, Battle Mode: Individuals or Teams) */
const WhoAmIGame = {
    activeQuestions: [],
    currentIndex: 0,
    currentPlayerIndex: 0,
    currentTeamIndex: 0,
    playMode: 'solo',
    teams: [],

    getSetupHTML: function() {
        let playerRows = '';
        for (let n = 1; n <= 20; n++) {
            const iconOpts = GAME_ICONS.map((ic, i) => `<option value="${i}"${i === (n - 1) % GAME_ICONS.length ? ' selected' : ''}>${ic.emoji} ${ic.label}</option>`).join('');
            playerRows += `
                <div class="t-player-row" id="w-row-${n}" style="display:none; align-items:center; gap:10px; margin-bottom:10px;">
                    <span class="t-player-num">${n}.</span>
                    <select id="w-icon-${n}" class="t-icon-select" title="Pick your icon">${iconOpts}</select>
                </div>`;
        }
        return `
            <p style="font-size: 0.9rem; color: rgba(255,255,255,0.7); margin-bottom: 15px;">Guess the Biblical character from the clue!</p>
            <div class="global-settings">
                <div class="setting-item">
                    <label>How many characters to guess?</label>
                    <select id="w-count">
                        <option value="5">5 Characters</option>
                        <option value="10">10 Characters</option>
                        <option value="20">20 Characters</option>
                        <option value="99">All Available</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label class="t-toggle-label">
                        <input type="checkbox" id="w-battle-mode" onchange="WhoAmIGame.toggleBattleMode()">
                        Battle Mode
                    </label>
                    <p class="t-hint">Play with others: individuals or teams.</p>
                </div>
                <div id="w-battle-options" class="t-battle-options" style="display:none;">
                    <div class="setting-item">
                        <label>Battle as</label>
                        <select id="w-battle-type" onchange="WhoAmIGame.toggleBattleType()">
                            <option value="individuals">Individuals</option>
                            <option value="teams">Teams</option>
                        </select>
                    </div>
                    <div id="w-individuals-block" class="t-battle-block">
                        <div class="setting-item">
                            <label>Number of Players</label>
                            <select id="w-pcount" onchange="WhoAmIGame.togglePlayerRows()">${Array.from({ length: 20 }, (_, i) => `<option value="${i + 1}"${i === 1 ? ' selected' : ''}>${i + 1} Player${i !== 0 ? 's' : ''}</option>`).join('')}</select>
                        </div>
                        <div class="setting-item">
                            <label>Pick an icon for each player</label>
                            <div id="w-players-container" class="t-players-container">${playerRows}</div>
                        </div>
                    </div>
                    <div id="w-teams-block" class="t-battle-block" style="display:none;">
                        <div class="setting-item">
                            <label>Number of Teams</label>
                            <select id="w-teams-count" onchange="WhoAmIGame.toggleBattleType()">
                                <option value="2">2 Teams</option>
                                <option value="3">3 Teams</option>
                                <option value="4">4 Teams</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label>Choose a clan for each team</label>
                            <div class="t-clan-picks">
                                <div class="t-clan-row"><span class="t-clan-label">Team 1</span><select id="w-clan1" class="t-clan-select">${GAME_CLANS.map((c, i) => `<option value="${i}"${i === 0 ? ' selected' : ''}>${c.emoji} ${c.name}</option>`).join('')}</select></div>
                                <div class="t-clan-row"><span class="t-clan-label">Team 2</span><select id="w-clan2" class="t-clan-select">${GAME_CLANS.map((c, i) => `<option value="${i}"${i === 1 ? ' selected' : ''}>${c.emoji} ${c.name}</option>`).join('')}</select></div>
                                <div class="t-clan-row" id="w-clan-row-3" style="display:none;"><span class="t-clan-label">Team 3</span><select id="w-clan3" class="t-clan-select">${GAME_CLANS.map((c, i) => `<option value="${i}"${i === 2 ? ' selected' : ''}>${c.emoji} ${c.name}</option>`).join('')}</select></div>
                                <div class="t-clan-row" id="w-clan-row-4" style="display:none;"><span class="t-clan-label">Team 4</span><select id="w-clan4" class="t-clan-select">${GAME_CLANS.map((c, i) => `<option value="${i}"${i === 3 ? ' selected' : ''}>${c.emoji} ${c.name}</option>`).join('')}</select></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button class="btn" onclick="WhoAmIGame.start()">Start Guessing</button>
        `;
    },

    toggleBattleMode: function() {
        const on = document.getElementById('w-battle-mode').checked;
        document.getElementById('w-battle-options').style.display = on ? 'block' : 'none';
        if (on) this.toggleBattleType();
    },

    toggleBattleType: function() {
        const type = document.getElementById('w-battle-type').value;
        document.getElementById('w-individuals-block').style.display = type === 'individuals' ? 'block' : 'none';
        document.getElementById('w-teams-block').style.display = type === 'teams' ? 'block' : 'none';
        const n = parseInt(document.getElementById('w-teams-count').value) || 2;
        const r3 = document.getElementById('w-clan-row-3');
        const r4 = document.getElementById('w-clan-row-4');
        if (r3) r3.style.display = n >= 3 ? 'flex' : 'none';
        if (r4) r4.style.display = n >= 4 ? 'flex' : 'none';
        if (type === 'individuals') this.togglePlayerRows();
    },

    togglePlayerRows: function() {
        const n = parseInt(document.getElementById('w-pcount').value) || 1;
        for (let i = 1; i <= 20; i++) {
            const row = document.getElementById('w-row-' + i);
            if (row) row.style.display = i <= n ? 'flex' : 'none';
        }
    },

    start: function() {
        const countVal = document.getElementById('w-count').value;
        const count = countVal === '99' ? 99 : parseInt(countVal) || 5;
        let pool = BibleDatabase.filter(q => q.type === 'multiple').sort(() => Math.random() - 0.5);
        this.activeQuestions = pool.slice(0, count);
        this.currentIndex = 0;

        const battleMode = document.getElementById('w-battle-mode').checked;
        if (!battleMode) {
            this.playMode = 'solo';
            GameManager.players = [{ icon: '📖', name: '📖', score: 0 }];
            this.currentPlayerIndex = 0;
            this.teams = [];
        } else if (document.getElementById('w-battle-type').value === 'individuals') {
            this.playMode = 'individuals';
            this.teams = [];
            const pcount = Math.min(20, Math.max(1, parseInt(document.getElementById('w-pcount').value) || 1));
            GameManager.players = [];
            for (let i = 1; i <= pcount; i++) {
                const iconEl = document.getElementById('w-icon-' + i);
                const idx = iconEl ? parseInt(iconEl.value, 10) : (i - 1) % GAME_ICONS.length;
                const choice = GAME_ICONS[Math.min(idx, GAME_ICONS.length - 1)] || GAME_ICONS[0];
                GameManager.players.push({ icon: choice.emoji, name: choice.label, score: 0 });
            }
            this.currentPlayerIndex = 0;
        } else {
            this.playMode = 'teams';
            const nTeams = Math.min(4, Math.max(2, parseInt(document.getElementById('w-teams-count').value) || 2));
            this.teams = [];
            for (let i = 1; i <= nTeams; i++) {
                const clanEl = document.getElementById('w-clan' + i);
                const idx = clanEl ? parseInt(clanEl.value, 10) : i - 1;
                const clan = GAME_CLANS[Math.min(idx, GAME_CLANS.length - 1)] || GAME_CLANS[0];
                this.teams.push({ name: clan.name, icon: clan.emoji, score: 0 });
            }
            GameManager.players = this.teams.map(t => ({ name: t.icon + ' ' + t.name, score: t.score, icon: t.icon }));
            this.currentTeamIndex = 0;
        }

        document.getElementById('setup-screen').classList.add('hidden');
        GameManager.showGameIntroSplash('Welcome to Who Am I?', 'Uncover the Bible character.');
        const self = this;
        GameManager.announceGame('whoami', function() {
            GameManager.hideGameIntroSplash();
            document.getElementById('game-play').classList.remove('hidden');
            self.loadQuestion();
        });
    },

    loadQuestion: function() {
        const qData = this.activeQuestions[this.currentIndex];
        const progress = `(${this.currentIndex + 1}/${this.activeQuestions.length})`;

        if (this.playMode === 'solo') {
            document.getElementById('display-player-name').innerText = `Character ${this.currentIndex + 1} of ${this.activeQuestions.length}`;
            document.getElementById('score').innerText = GameManager.players[0].score;
        } else if (this.playMode === 'individuals') {
            const p = GameManager.players[this.currentPlayerIndex];
            document.getElementById('display-player-name').innerText = `${p.icon} ${p.name}'s turn ${progress}`;
            document.getElementById('score').innerText = GameManager.players.map(pl => `${pl.icon} ${pl.name}: ${pl.score}`).join('  ·  ');
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
        const points = 10;
        choices.forEach(opt => {
            const b = document.createElement('button');
            b.className = 'btn';
            b.innerText = opt;
            b.onclick = () => {
                document.querySelectorAll('#options-container .btn').forEach(btn => btn.disabled = true);
                if (opt === qData.a) {
                    if (this.playMode === 'solo') {
                        GameManager.players[0].score += points;
                    } else if (this.playMode === 'teams') {
                        this.teams[this.currentTeamIndex].score += points;
                        GameManager.players[this.currentTeamIndex].score = this.teams[this.currentTeamIndex].score;
                    } else {
                        GameManager.players[this.currentPlayerIndex].score += points;
                    }
                    document.getElementById('feedback').innerText = "✅ That's right!";
                    GameManager.playSound('correct', this.advanceAfterSound.bind(this));
                } else {
                    document.getElementById('feedback').innerText = `❌ No, the answer is ${qData.a}`;
                    GameManager.playSound('wrong', this.advanceAfterSound.bind(this));
                }
                this.currentIndex++;
                if (this.playMode === 'individuals') this.currentPlayerIndex = (this.currentPlayerIndex + 1) % GameManager.players.length;
                else if (this.playMode === 'teams') this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teams.length;
            };
            optCont.appendChild(b);
        });

        const quitBtn = document.createElement('button');
        quitBtn.className = 'btn-outline';
        quitBtn.style.marginTop = '20px';
        quitBtn.innerText = 'Quit Game';
        quitBtn.onclick = () => { if (confirm('Exit to main menu?')) GameManager.goToMenu(); };
        optCont.appendChild(quitBtn);
    },

    advanceAfterSound: function() {
        if (this.currentIndex >= this.activeQuestions.length) GameManager.showFinish();
        else this.loadQuestion();
    }
};

GameManager.registerGame('whoami', WhoAmIGame);
