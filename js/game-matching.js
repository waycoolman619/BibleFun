/* Bible Fun v2.0.2 - Prophetic Pairs */
const MatchingGame = {
    selectedLeft: null,
    pairs: {},
    matchesFound: 0,
    activeQuestion: null,

    getSetupHTML: function() {
        return `
            <p class="setup-hint">Select one item from the left column, then its partner on the right. Correct pairs disappear.</p>
            <button class="btn" onclick="MatchingGame.start()">Start Matching</button>
        `;
    },

    start: function() {
    const pool = BibleDatabase.filter(q => q.type === 'match');
    if (!pool.length) {
        alert('No matching questions in the database.');
        return;
    }
    // Pick a random one, but try not to pick the same one twice
    let newSelection;
    do {
        newSelection = pool[Math.floor(Math.random() * pool.length)];
    } while (pool.length > 1 && newSelection === this.activeQuestion);

    this.activeQuestion = newSelection;
    this.pairs = this.activeQuestion.a;
    this.matchesFound = 0;
    this.selectedLeft = null;

    document.getElementById('setup-screen').classList.add('hidden');
    GameManager.showGameIntroSplash('Welcome to Prophetic Pairs', 'Two columns. One perfect match!');
    const self = this;
    GameManager.announceGame('match', function() {
        GameManager.hideGameIntroSplash();
        document.getElementById('game-play').classList.remove('hidden');
        self.render();
    });
    },

    render: function() {
        document.getElementById('display-player-name').innerText = "Prophetic Pairs";
        document.getElementById('question-box').innerText = this.activeQuestion.q;
        document.getElementById('feedback').innerText = "Choose an item to start...";
        GameManager.readQuestion(this.activeQuestion.q);
        
        const container = document.getElementById('options-container');
        container.innerHTML = `
            <div class="match-grid" id="match-grid">
                <div id="l-col" class="match-col"></div>
                <div class="match-divider" aria-hidden="true"><span class="match-arrow">←</span> <span class="match-label">Match</span> <span class="match-arrow">→</span></div>
                <div id="r-col" class="match-col"></div>
            </div>
            <button class="btn-outline" onclick="if(confirm('Quit game?')) GameManager.goToMenu()">Quit Game</button>
        `;

        const left = Object.keys(this.pairs).sort(() => Math.random() - 0.5);
        const right = Object.values(this.pairs).sort(() => Math.random() - 0.5);

        left.forEach(val => {
            const b = document.createElement('button');
            b.className = 'btn match-btn'; 
            b.innerText = val;
            b.onclick = () => {
                this.selectedLeft = val;
                document.querySelectorAll('#l-col .match-btn').forEach(x => x.classList.remove('match-btn-selected'));
                b.classList.add('match-btn-selected');
                document.getElementById('feedback').innerText = `Matching: ${val} + ...`;
            };
            document.getElementById('l-col').appendChild(b);
        });

        right.forEach(val => {
            const b = document.createElement('button');
            b.className = 'btn match-btn'; 
            b.innerText = val;
            b.onclick = () => this.checkMatch(val, b);
            document.getElementById('r-col').appendChild(b);
        });
    },

    checkMatch: function(rightVal, rightBtn) {
        if (!this.selectedLeft) {
            document.getElementById('feedback').innerText = "⚠️ Pick from the left column first!";
            return;
        }

        const leftBtn = [...document.getElementById('l-col').children].find(x => x.innerText === this.selectedLeft);

        if (this.pairs[this.selectedLeft] === rightVal) {
            GameManager.playSound('correct');
            leftBtn.style.visibility = 'hidden';
            rightBtn.style.visibility = 'hidden';
            this.matchesFound++;
            this.selectedLeft = null;
            document.getElementById('feedback').innerText = "✅ Correct Link!";

            if (this.matchesFound === Object.keys(this.pairs).length) {
                setTimeout(() => GameManager.showFinish(), 800);
            }
        } else {
            GameManager.playSound('wrong');
            rightBtn.style.background = '#e74c3c';
            leftBtn.style.background = '#e74c3c';
            document.getElementById('feedback').innerText = "❌ Not a match!";
            
            setTimeout(() => {
                rightBtn.style.background = '';
                leftBtn.style.background = '';
                leftBtn.classList.remove('match-btn-selected');
                this.selectedLeft = null;
            }, 600);
        }
    }
};

GameManager.registerGame('match', MatchingGame);