/* Bible Fun - Fill in the Blank (Solo default, Battle Mode: Individuals or Teams) */
const BlanksGame = {
    questions: [],
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
                <div class="t-player-row" id="b-row-${n}" style="display:none; align-items:center; gap:10px; margin-bottom:10px;">
                    <span class="t-player-num">${n}.</span>
                    <select id="b-icon-${n}" class="t-icon-select" title="Pick your icon">${iconOpts}</select>
                </div>`;
        }
        return `
            <p style="margin-bottom:15px; color: rgba(255,255,255,0.7); font-size: 0.9rem;">Test your knowledge of Bible verses and facts.</p>
            <div class="global-settings">
                <div class="setting-item">
                    <label>Number of Questions</label>
                    <select id="b-count">
                        <option value="5">5 Questions</option>
                        <option value="10">10 Questions</option>
                        <option value="15">15 Questions</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label class="t-toggle-label">
                        <input type="checkbox" id="b-battle-mode" onchange="BlanksGame.toggleBattleMode()">
                        Battle Mode
                    </label>
                    <p class="t-hint">Play with others: individuals or teams.</p>
                </div>
                <div id="b-battle-options" class="t-battle-options" style="display:none;">
                    <div class="setting-item">
                        <label>Battle as</label>
                        <select id="b-battle-type" onchange="BlanksGame.toggleBattleType()">
                            <option value="individuals">Individuals</option>
                            <option value="teams">Teams</option>
                        </select>
                    </div>
                    <div id="b-individuals-block" class="t-battle-block">
                        <div class="setting-item">
                            <label>Number of Players</label>
                            <select id="b-pcount" onchange="BlanksGame.togglePlayerRows()">${Array.from({ length: 20 }, (_, i) => `<option value="${i + 1}">${i + 1} Player${i !== 0 ? 's' : ''}</option>`).join('')}</select>
                        </div>
                        <div class="setting-item">
                            <label>Pick an icon for each player</label>
                            <div id="b-players-container" class="t-players-container">${playerRows}</div>
                        </div>
                    </div>
                    <div id="b-teams-block" class="t-battle-block" style="display:none;">
                        <div class="setting-item">
                            <label>Number of Teams</label>
                            <select id="b-teams-count" onchange="BlanksGame.toggleBattleType()">
                                <option value="2">2 Teams</option>
                                <option value="3">3 Teams</option>
                                <option value="4">4 Teams</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label>Choose a clan for each team</label>
                            <div class="t-clan-picks">
                                <div class="t-clan-row"><span class="t-clan-label">Team 1</span><select id="b-clan1" class="t-clan-select">${GAME_CLANS.map((c, i) => `<option value="${i}"${i === 0 ? ' selected' : ''}>${c.emoji} ${c.name}</option>`).join('')}</select></div>
                                <div class="t-clan-row"><span class="t-clan-label">Team 2</span><select id="b-clan2" class="t-clan-select">${GAME_CLANS.map((c, i) => `<option value="${i}"${i === 1 ? ' selected' : ''}>${c.emoji} ${c.name}</option>`).join('')}</select></div>
                                <div class="t-clan-row" id="b-clan-row-3" style="display:none;"><span class="t-clan-label">Team 3</span><select id="b-clan3" class="t-clan-select">${GAME_CLANS.map((c, i) => `<option value="${i}"${i === 2 ? ' selected' : ''}>${c.emoji} ${c.name}</option>`).join('')}</select></div>
                                <div class="t-clan-row" id="b-clan-row-4" style="display:none;"><span class="t-clan-label">Team 4</span><select id="b-clan4" class="t-clan-select">${GAME_CLANS.map((c, i) => `<option value="${i}"${i === 3 ? ' selected' : ''}>${c.emoji} ${c.name}</option>`).join('')}</select></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button class="btn" onclick="BlanksGame.start()">Start Game</button>
        `;
    },

    toggleBattleMode: function() {
        const on = document.getElementById('b-battle-mode').checked;
        document.getElementById('b-battle-options').style.display = on ? 'block' : 'none';
        if (on) this.toggleBattleType();
    },

    toggleBattleType: function() {
        const type = document.getElementById('b-battle-type').value;
        document.getElementById('b-individuals-block').style.display = type === 'individuals' ? 'block' : 'none';
        document.getElementById('b-teams-block').style.display = type === 'teams' ? 'block' : 'none';
        const n = parseInt(document.getElementById('b-teams-count').value) || 2;
        const r3 = document.getElementById('b-clan-row-3');
        const r4 = document.getElementById('b-clan-row-4');
        if (r3) r3.style.display = n >= 3 ? 'flex' : 'none';
        if (r4) r4.style.display = n >= 4 ? 'flex' : 'none';
        if (type === 'individuals') this.togglePlayerRows();
    },

    togglePlayerRows: function() {
        const n = parseInt(document.getElementById('b-pcount').value) || 1;
        for (let i = 1; i <= 20; i++) {
            const row = document.getElementById('b-row-' + i);
            if (row) row.style.display = i <= n ? 'flex' : 'none';
        }
    },

    start: function() {
        const count = parseInt(document.getElementById('b-count').value);
        const pool = BibleDatabase.filter(q => q.type === 'multiple').sort(() => 0.5 - Math.random());
        this.questions = pool.slice(0, count);
        this.currentIndex = 0;

        const battleMode = document.getElementById('b-battle-mode').checked;
        if (!battleMode) {
            this.playMode = 'solo';
            GameManager.players = [{ icon: '📖', name: '📖', score: 0 }];
            this.currentPlayerIndex = 0;
            this.teams = [];
        } else if (document.getElementById('b-battle-type').value === 'individuals') {
            this.playMode = 'individuals';
            this.teams = [];
            const pcount = Math.min(20, Math.max(1, parseInt(document.getElementById('b-pcount').value) || 1));
            GameManager.players = [];
            for (let i = 1; i <= pcount; i++) {
                const iconEl = document.getElementById('b-icon-' + i);
                const idx = iconEl ? parseInt(iconEl.value, 10) : (i - 1) % GAME_ICONS.length;
                const choice = GAME_ICONS[Math.min(idx, GAME_ICONS.length - 1)] || GAME_ICONS[0];
                GameManager.players.push({ icon: choice.emoji, name: choice.label, score: 0 });
            }
            this.currentPlayerIndex = 0;
        } else {
            this.playMode = 'teams';
            const nTeams = Math.min(4, Math.max(2, parseInt(document.getElementById('b-teams-count').value) || 2));
            this.teams = [];
            for (let i = 1; i <= nTeams; i++) {
                const clanEl = document.getElementById('b-clan' + i);
                const idx = clanEl ? parseInt(clanEl.value, 10) : i - 1;
                const clan = GAME_CLANS[Math.min(idx, GAME_CLANS.length - 1)] || GAME_CLANS[0];
                this.teams.push({ name: clan.name, icon: clan.emoji, score: 0 });
            }
            GameManager.players = this.teams.map(t => ({ name: t.icon + ' ' + t.name, score: t.score, icon: t.icon }));
            this.currentTeamIndex = 0;
        }

        document.getElementById('setup-screen').classList.add('hidden');
        GameManager.showGameIntroSplash('Welcome to Fill in the Blank', 'Let the words be revealed.');
        const self = this;
        GameManager.announceGame('blank', function() {
            GameManager.hideGameIntroSplash();
            document.getElementById('game-play').classList.remove('hidden');
            self.renderQuestion();
        });
    },

    renderQuestion: function() {
        const q = this.questions[this.currentIndex];
        const progress = `(${this.currentIndex + 1}/${this.questions.length})`;

        if (this.playMode === 'solo') {
            document.getElementById('display-player-name').innerText = 'Question ' + (this.currentIndex + 1) + ' of ' + this.questions.length;
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

        document.getElementById('question-box').innerText = q.q;
        document.getElementById('feedback').innerText = '';
        if (this.playMode === 'individuals') {
            const p = GameManager.players[this.currentPlayerIndex];
            GameManager.speakTurn(p.name + "'s turn", () => GameManager.readQuestion(q.q));
        } else if (this.playMode === 'teams') {
            const t = this.teams[this.currentTeamIndex];
            GameManager.speakTurn(t.name + "'s turn", () => GameManager.readQuestion(q.q));
        } else {
            GameManager.readQuestion(q.q);
        }
        const optCont = document.getElementById('options-container');
        optCont.innerHTML = `
            <input type="text" id="b-ans" class="btn" style="background:rgba(255,255,255,0.95); color:#1a1a2e; border:2px solid rgba(241,196,16,0.5);" placeholder="Type answer here..." autocomplete="off">
            <button class="btn" onclick="BlanksGame.check()">Submit Answer</button>
        `;
        const quitBtn = document.createElement('button');
        quitBtn.className = 'btn-outline';
        quitBtn.style.marginTop = '20px';
        quitBtn.innerText = 'Quit Game';
        quitBtn.onclick = () => { if (confirm('Quit and return to menu? Your progress will be lost.')) GameManager.goToMenu(); };
        optCont.appendChild(quitBtn);
        const input = document.getElementById('b-ans');
        input.focus();
        input.onkeyup = (e) => { if (e.key === 'Enter') BlanksGame.check(); };
    },

    check: function() {
        const guess = document.getElementById('b-ans').value.toLowerCase().trim();
        const correct = this.questions[this.currentIndex].a.toLowerCase().trim();
        const points = 100;

        if (guess === correct) {
            if (this.playMode === 'teams') {
                this.teams[this.currentTeamIndex].score += points;
                GameManager.players[this.currentTeamIndex].score = this.teams[this.currentTeamIndex].score;
            } else {
                GameManager.players[this.currentPlayerIndex].score += points;
            }
            document.getElementById('feedback').innerText = '✅ Correct!';
            document.getElementById('feedback').style.color = 'green';
            GameManager.playSound('correct', this.advanceAfterSound.bind(this));
        } else {
            document.getElementById('feedback').innerText = `❌ Incorrect. It was: ${this.questions[this.currentIndex].a}`;
            document.getElementById('feedback').style.color = 'red';
            GameManager.playSound('wrong', this.advanceAfterSound.bind(this));
        }

        this.currentIndex++;
        if (this.playMode === 'individuals') this.currentPlayerIndex = (this.currentPlayerIndex + 1) % GameManager.players.length;
        else if (this.playMode === 'teams') this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teams.length;
    },

    advanceAfterSound: function() {
        if (this.currentIndex < this.questions.length) this.renderQuestion();
        else GameManager.showFinish();
    },
};

GameManager.registerGame('blank', BlanksGame);
