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
                <div class="setup-row setup-row-single">
                    <div class="setup-card">
                        <span class="setup-card-label">Number of Questions</span>
                        <div class="option-tiles" id="b-count-tiles">
                            <button type="button" class="option-tile selected" data-value="5" onclick="BlanksGame.pickCount(5)">5</button>
                            <button type="button" class="option-tile" data-value="10" onclick="BlanksGame.pickCount(10)">10</button>
                            <button type="button" class="option-tile" data-value="15" onclick="BlanksGame.pickCount(15)">15</button>
                        </div>
                        <select id="b-count" aria-hidden="true" style="position:absolute;opacity:0;height:0;width:0"><option value="5" selected>5</option><option value="10">10</option><option value="15">15</option></select>
                    </div>
                </div>
                <div class="battle-mode-card">
                    <span class="setup-card-label">Play mode</span>
                    <div class="option-tiles">
                        <button type="button" class="option-tile selected" id="b-solo-tile" onclick="BlanksGame.setPlayMode(false)">Solo</button>
                        <button type="button" class="option-tile" id="b-battle-tile" onclick="BlanksGame.setPlayMode(true)">Battle</button>
                    </div>
                    <input type="checkbox" id="b-battle-mode" onchange="BlanksGame.toggleBattleMode()" aria-hidden="true" style="position:absolute;opacity:0;height:0;width:0">
                    <div id="b-battle-options" class="battle-options-inner t-battle-options" style="display:none;">
                        <div class="setup-card" id="b-battle-type-card">
                            <span class="setup-card-label">Battle as</span>
                            <div class="option-tiles">
                                <button type="button" class="option-tile selected" onclick="BlanksGame.pickBattleType('individuals')">Individuals</button>
                                <button type="button" class="option-tile" onclick="BlanksGame.pickBattleType('teams')">Teams</button>
                            </div>
                            <select id="b-battle-type" aria-hidden="true" style="position:absolute;opacity:0;height:0;width:0"><option value="individuals">Individuals</option><option value="teams">Teams</option></select>
                        </div>
                        <div id="b-individuals-block" class="t-battle-block">
                            <div class="setup-card">
                                <span class="setup-card-label">Number of Players</span>
                                <div class="option-tiles" id="b-pcount-tiles">${[2,3,4,5,6].map((n) => `<button type="button" class="option-tile${n===2?' selected':''}" data-value="${n}" onclick="BlanksGame.pickPcount(${n})">${n}</button>`).join('')}</div>
                                <select id="b-pcount" onchange="BlanksGame.syncPcountFromSelect()" style="position:absolute;opacity:0;height:0;width:0">${Array.from({ length: 20 }, (_, i) => `<option value="${i + 1}"${i === 1 ? ' selected' : ''}>${i + 1}</option>`).join('')}</select>
                            </div>
                            <div class="setting-item">
                                <label>Pick an icon for each player</label>
                                <div id="b-players-container" class="t-players-container">${playerRows}</div>
                            </div>
                        </div>
                        <div id="b-teams-block" class="t-battle-block" style="display:none;">
                            <div class="setup-card">
                                <span class="setup-card-label">Number of Teams</span>
                                <div class="option-tiles">
                                    <button type="button" class="option-tile selected" data-value="2" onclick="BlanksGame.pickTeamsCount(2)">2</button>
                                    <button type="button" class="option-tile" data-value="3" onclick="BlanksGame.pickTeamsCount(3)">3</button>
                                    <button type="button" class="option-tile" data-value="4" onclick="BlanksGame.pickTeamsCount(4)">4</button>
                                </div>
                                <select id="b-teams-count" aria-hidden="true" style="position:absolute;opacity:0;height:0;width:0"><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option></select>
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
            </div>
            <button class="btn" onclick="BlanksGame.start()">Start Game</button>
        `;
    },

    pickCount: function(n) {
        const sel = document.getElementById('b-count');
        if (sel) sel.value = String(n);
        const tiles = document.getElementById('b-count-tiles');
        if (tiles) tiles.querySelectorAll('.option-tile').forEach(t => { t.classList.toggle('selected', parseInt(t.getAttribute('data-value'), 10) === n); });
    },
    setPlayMode: function(battle) {
        const cb = document.getElementById('b-battle-mode');
        if (cb) cb.checked = battle;
        const s = document.getElementById('b-solo-tile');
        const b = document.getElementById('b-battle-tile');
        if (s) s.classList.toggle('selected', !battle);
        if (b) b.classList.toggle('selected', battle);
        document.getElementById('b-battle-options').style.display = battle ? 'block' : 'none';
        if (battle) this.toggleBattleType();
    },
    pickBattleType: function(type) {
        const sel = document.getElementById('b-battle-type');
        if (sel) sel.value = type;
        const card = document.getElementById('b-battle-type-card');
        if (card) card.querySelectorAll('.option-tile').forEach(t => {
            t.classList.toggle('selected', (type === 'individuals' && t.textContent.trim() === 'Individuals') || (type === 'teams' && t.textContent.trim() === 'Teams'));
        });
        this.toggleBattleType();
    },
    pickPcount: function(n) {
        const sel = document.getElementById('b-pcount');
        if (sel) sel.value = String(n);
        document.querySelectorAll('#b-pcount-tiles .option-tile').forEach(t => { t.classList.toggle('selected', parseInt(t.getAttribute('data-value'), 10) === n); });
        this.togglePlayerRows();
    },
    syncPcountFromSelect: function() {
        const n = parseInt(document.getElementById('b-pcount').value, 10);
        document.querySelectorAll('#b-pcount-tiles .option-tile').forEach(t => { t.classList.toggle('selected', parseInt(t.getAttribute('data-value'), 10) === n); });
        this.togglePlayerRows();
    },
    pickTeamsCount: function(n) {
        const sel = document.getElementById('b-teams-count');
        if (sel) sel.value = String(n);
        document.querySelectorAll('#b-teams-block .option-tiles .option-tile').forEach(t => { t.classList.toggle('selected', parseInt(t.getAttribute('data-value'), 10) === n); });
        this.toggleBattleType();
    },

    toggleBattleMode: function() {
        const on = document.getElementById('b-battle-mode').checked;
        document.getElementById('b-battle-options').style.display = on ? 'block' : 'none';
        if (document.getElementById('b-solo-tile')) document.getElementById('b-solo-tile').classList.toggle('selected', !on);
        if (document.getElementById('b-battle-tile')) document.getElementById('b-battle-tile').classList.toggle('selected', on);
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
        let pool = BibleDatabase.filter(q => q.type === 'multiple');
        const seen = new Set();
        pool = pool.filter(q => {
            const key = (q.q || '').trim().toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
        pool = shuffleArray(pool);
        this.questions = pool.slice(0, Math.min(count, pool.length));
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
