/* Bible Fun v2.0.3 - Timeline/Sequence Cartridge */
const SequenceGame = {
    questions: [],
    currentIndex: 0,
    score: 0,
    currentUserOrder: [],

    getSetupHTML: function() {
        return `
            <p class="setup-hint">Drag or click the events into the correct chronological order.</p>
            <div class="global-settings">
                <div class="setting-item">
                    <label>Number of Rounds</label>
                    <select id="s-count">
                        <option value="1">1 Round</option>
                        <option value="2">2 Rounds</option>
                        <option value="3">3 Rounds</option>
                    </select>
                </div>
            </div>
            <button class="btn" onclick="SequenceGame.start()">Start Timeline</button>
        `;
    },

    start: function() {
        const count = parseInt(document.getElementById('s-count').value);
        
        // This is the fix: Specifically filtering for 'sequence' type questions
        const pool = BibleDatabase.filter(q => q.type === 'sequence');
        
        if (pool.length === 0) {
            alert("No sequence questions found in the database! Please check questions.js.");
            GameManager.goToMenu();
            return;
        }

        this.questions = pool.sort(() => 0.5 - Math.random()).slice(0, count);
        this.currentIndex = 0;
        this.score = 0;
        GameManager.players = [{ name: "Player 1", score: 0 }];

        document.getElementById('setup-screen').classList.add('hidden');
        GameManager.showGameIntroSplash('Welcome to Testament Timeline', 'From creation to the cross—in order.');
        const self = this;
        GameManager.announceGame('sequence', function() {
            GameManager.hideGameIntroSplash();
            document.getElementById('game-play').classList.remove('hidden');
            self.renderQuestion();
        });
    },

    renderQuestion: function() {
        const q = this.questions[this.currentIndex];
        document.getElementById('display-player-name').innerText = `Timeline Round ${this.currentIndex + 1}`;
        document.getElementById('score').innerText = this.score;
        document.getElementById('question-box').innerText = q.q;
        const feedbackEl = document.getElementById('feedback');
        feedbackEl.innerText = '';
        feedbackEl.style.color = '';
        GameManager.readQuestion(q.q);
        
        this.currentUserOrder = [];
        // Shuffle the options so they aren't in the right order to start
        const shuffledOptions = [...q.a].sort(() => 0.5 - Math.random());
        
        const optCont = document.getElementById('options-container');
        optCont.innerHTML = `
            <p class="timeline-instruction">Click each item in the order it should appear.</p>
            <div id="timeline-slots" class="timeline-slots"></div>
            <div id="user-sequence-preview" class="timeline-preview"></div>
            <button class="btn" onclick="SequenceGame.resetTurn()">Reset Order</button>
            <button class="btn" onclick="SequenceGame.check()">Check Order</button>
            <button class="btn-outline" onclick="if(confirm('Quit game?')) GameManager.goToMenu()">Quit Game</button>
        `;
        const slotDiv = document.getElementById('timeline-slots');
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-outline timeline-option-btn';
            btn.textContent = opt;
            btn.dataset.option = opt;
            btn.onclick = function() { SequenceGame.selectOption(this, this.dataset.option); };
            slotDiv.appendChild(btn);
        });
    },

    selectOption: function(btn, val) {
        if (this.currentUserOrder.includes(val)) return;
        this.currentUserOrder.push(val);
        btn.style.opacity = "0.3";
        btn.disabled = true;
        document.getElementById('user-sequence-preview').innerText = this.currentUserOrder.join(" ➔ ");
    },

    resetTurn: function() {
        this.renderQuestion();
    },

    check: function() {
        const q = this.questions[this.currentIndex];
        const isCorrect = JSON.stringify(this.currentUserOrder) === JSON.stringify(q.a);
        
        if (isCorrect) {
            this.score += 500;
            document.getElementById('feedback').innerText = "✅ Perfect Timeline!";
            document.getElementById('feedback').style.color = "#f1c40f";
            GameManager.playSound('correct', this.advanceAfterSound.bind(this));
        } else {
            document.getElementById('feedback').innerText = `❌ Order should be: ${q.a.join(', ')}`;
            document.getElementById('feedback').style.color = "#e74c3c";
            GameManager.playSound('wrong', this.advanceAfterSound.bind(this));
        }

        this.currentIndex++;
    },

    advanceAfterSound: function() {
        if (this.currentIndex < this.questions.length) {
            this.renderQuestion();
        } else {
            GameManager.players[0].score = this.score;
            GameManager.showFinish();
        }
    }
};

GameManager.registerGame('sequence', SequenceGame);