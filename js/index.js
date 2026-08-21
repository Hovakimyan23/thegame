const MIN_NUM = 1;
const MAX_NUM = 100;
const BEST_KEY = 'numberGuess_bestScore';

const elements = {
    attempts: document.getElementById('attempts'),
    best: document.getElementById('best'),
    feedback: document.getElementById('feedback'),
    feedbackText: document.querySelector('.feedback__text'),
    form: document.getElementById('guessForm'),
    input: document.getElementById('guessInput'),
    guessBtn: document.getElementById('guessBtn'),
    resetBtn: document.getElementById('resetBtn'),
    rangeMin: document.getElementById('rangeMin'),
    rangeMax: document.getElementById('rangeMax'),
};

let answer;
let attempts;
let running;
let currentMin = MIN_NUM;
let currentMax = MAX_NUM;

function loadBest() {
    const best = localStorage.getItem(BEST_KEY);
    if (best) {
        elements.best.textContent = best;
    }
}

function saveBest(score) {
    const current = parseInt(localStorage.getItem(BEST_KEY), 10);
    if (isNaN(current) || score < current) {
        localStorage.setItem(BEST_KEY, String(score));
        elements.best.textContent = String(score);
    }
}

function startGame() {
    answer = Math.floor(Math.random() * (MAX_NUM - MIN_NUM + 1)) + MIN_NUM;
    attempts = 0;
    running = true;
    currentMin = MIN_NUM;
    currentMax = MAX_NUM;

    elements.attempts.textContent = '0';
    elements.rangeMin.textContent = String(MIN_NUM);
    elements.rangeMax.textContent = String(MAX_NUM);
    elements.feedback.className = 'game__feedback';
    elements.feedbackText.textContent = 'Start guessing!';
    elements.input.value = '';
    elements.input.disabled = false;
    elements.guessBtn.disabled = false;
    elements.resetBtn.hidden = true;
    elements.input.focus();
}

function setFeedback(type, message) {
    elements.feedback.className = 'game__feedback ' + type;
    elements.feedbackText.textContent = message;
}

function handleGuess(e) {
    e.preventDefault();
    if (!running) return;

    const raw = elements.input.value.trim();
    const guess = Number(raw);

    if (raw === '' || isNaN(guess)) {
        setFeedback('invalid', 'Please enter a valid number');
        return;
    }
    if (guess < MIN_NUM || guess > MAX_NUM || !Number.isInteger(guess)) {
        setFeedback('invalid', `Enter a whole number from ${MIN_NUM} to ${MAX_NUM}`);
        return;
    }

    attempts++;
    elements.attempts.textContent = String(attempts);

    if (guess < answer) {
        if (guess > currentMin) currentMin = guess;
        elements.rangeMin.textContent = String(currentMin);
        setFeedback('low', 'Too low! Try higher');
    } else if (guess > answer) {
        if (guess < currentMax) currentMax = guess;
        elements.rangeMax.textContent = String(currentMax);
        setFeedback('high', 'Too high! Try lower');
    } else {
        setFeedback('win', `Correct! The answer was ${answer}. It took you ${attempts} attempt${attempts === 1 ? '' : 's'}.`);
        saveBest(attempts);
        running = false;
        elements.input.disabled = true;
        elements.guessBtn.disabled = true;
        elements.resetBtn.hidden = false;
        elements.resetBtn.focus();
    }

    elements.input.value = '';
    if (running) elements.input.focus();
}

elements.form.addEventListener('submit', handleGuess);
elements.resetBtn.addEventListener('click', startGame);

loadBest();
startGame();
