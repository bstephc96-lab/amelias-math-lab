// Global state
let currentMode = 'learnMul';
let currentExample = {};
let currentStep = 0;
let isGuided = true;

// DOM elements
const contentEl = document.getElementById('content');
const learnMulBtn = document.getElementById('learnMulBtn');
const practiceMulBtn = document.getElementById('practiceMulBtn');
const learnDivBtn = document.getElementById('learnDivBtn');
const practiceDivBtn = document.getElementById('practiceDivBtn');

// Mode switching
learnMulBtn.addEventListener('click', () => switchMode('learnMul'));
practiceMulBtn.addEventListener('click', () => switchMode('practiceMul'));
learnDivBtn.addEventListener('click', () => switchMode('learnDiv'));
practiceDivBtn.addEventListener('click', () => switchMode('practiceDiv'));

function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = {
        'learnMul': learnMulBtn,
        'practiceMul': practiceMulBtn,
        'learnDiv': learnDivBtn,
        'practiceDiv': practiceDivBtn
    }[mode];
    if (activeBtn) activeBtn.classList.add('active');
    
    if (mode.includes('practice')) {
        isGuided = true;
    }
    generateNewExample();
}

// Generate random example
function generateNewExample() {
    if (currentMode.startsWith('learnMul') || currentMode.startsWith('practiceMul')) {
        // Easy: 1-digit (2-9) × 2-digit (10-99)
        const num1 = Math.floor(Math.random() * 90) + 10; // 10-99 (multiplicand)
        const num2 = Math.floor(Math.random() * 8) + 2;   // 2-9 (multiplier)
        
        currentExample = {
            multiplicand: num1,
            multiplier: num2,
            product: num1 * num2,
            steps: calculateMultiplicationSteps(num1, num2)
        };
    } else {
        // Division stub
        const divisor = Math.floor(Math.random() * 8) + 2;
        const quotient = Math.floor(Math.random() * 9) + 1;
        const dividend = divisor * quotient;
        
        currentExample = {
            dividend: dividend,
            divisor: divisor,
            quotient: quotient,
            remainder: 0
        };
    }
    currentStep = 0;
    renderCurrentView();
}

// Fixed multiplication steps calculation
function calculateMultiplicationSteps(multiplicand, multiplier) {
    const steps = [];
    const multiplicandStr = multiplicand.toString();
    
    if (multiplicandStr.length === 2) {
        // Two-digit × one-digit
        const tens = parseInt(multiplicandStr[0]);
        const ones = parseInt(multiplicandStr[1]);
        
        // Step 1: ones × multiplier
        const onesProduct = ones * multiplier;
        const onesDigit = onesProduct % 10;
        const carry1 = Math.floor(onesProduct / 10);
        
        steps.push({
            description: `${ones} × ${multiplier} = ${onesProduct}`,
            digit: onesDigit,
            carry: carry1,
            position: 'ones'
        });
        
        // Step 2: tens × multiplier + carry
        const tensProduct = tens * multiplier + carry1;
        const tensDigit = tensProduct % 10;
        const carry2 = Math.floor(tensProduct / 10);
        
        steps.push({
            description: `${tens} × ${multiplier} + ${carry1} (carry) = ${tensProduct}`,
            digit: tensDigit,
            carry: carry2,
            position: 'tens'
        });
        
        if (carry2 > 0) {
            steps.push({
                description: `Final carry`,
                digit: carry2,
                carry: 0,
                position: 'hundreds'
            });
        }
    }
    
    return steps;
}

// Fixed rendering with proper alignment
function renderLearnMultiplication() {
    const { multiplicand, multiplier, product, steps } = currentExample;
    const step = steps[currentStep];
    
    let html = `
        <div class="instructions">
            ${step ? `Step ${currentStep + 1}: ${step.description}. Write ${step.digit} and carry ${step.carry || 0}.` : 'Click Next Step to begin!'}
        </div>
    `;
    
    // Create aligned math display
    html += '<div class="math-display">';
    
    // Line 1: Multiplicand (right-aligned)
    html += `<div class="math-line">`;
    html += `<span class="number-part">${multiplicand.toString().padStart(4)}</span>`;
    html += `</div>`;
    
    // Line 2: × Multiplier
    html += `<div class="math-line">`;
    html += `<span class="operator">×</span><span class="number-part">${multiplier.toString().padStart(3)}</span>`;
    html += `</div>`;
    
    // Line 3: Divider
    html += `<div class="math-line">`;
    html += `<span class="divider">────</span>`;
    html += `</div>`;
    
    // Show carries above the answer line
    if (currentStep > 0) {
        let carryLine = '    '; // Start with spaces
        for (let i = 0; i < currentStep; i++) {
            if (steps[i].carry > 0) {
                carryLine = steps[i].carry + carryLine.slice(1);
            }
        }
        html += `<div class="math-line carry-row">`;
        html += `<span class="number-part">${carryLine}</span>`;
        html += `</div>`;
    }
    
    // Answer line (build progressively)
    let answerDisplay = '';
    if (currentStep === steps.length) {
        // Show final answer
        answerDisplay = product.toString();
    } else if (currentStep > 0) {
        // Show partial answer
        let partial = '';
        for (let i = 0; i < currentStep; i++) {
            partial = steps[i].digit + partial;
        }
        // Add carries
        for (let i = currentStep; i < steps.length && steps[i].carry > 0; i++) {
            partial = steps[i].carry + partial;
        }
        answerDisplay = partial;
    }
    
    if (answerDisplay) {
        html += `<div class="math-line ${currentStep === steps.length ? 'final-answer' : ''}">`;
        html += `<span class="number-part">${answerDisplay.padStart(4)}</span>`;
        html += `</div>`;
    }
    
    html += '</div>'; // Close math-display
    
    // Controls
    html += `<div class="controls">`;
    if (currentStep < steps.length) {
        html += `<button onclick="nextStep()">Next Step</button>`;
    }
    html += `<button onclick="generateNewExample()">New Example</button>`;
    html += `</div>`;
    
    html += `<div id="feedback" class="feedback"></div>`;
    
    contentEl.innerHTML = html;
}

function renderPracticeMultiplication() {
    contentEl.innerHTML = `
        <div class="instructions">Practice Mode - Enter each digit as you calculate</div>
        <div class="math-display">
            <div class="math-line">
                <span class="number-part">${currentExample.multiplicand.toString().padStart(4)}</span>
            </div>
            <div class="math-line">
                <span class="operator">×</span><span class="number-part">${currentExample.multiplier.toString().padStart(3)}</span>
            </div>
            <div class="math-line">
                <span class="divider">────</span>
            </div>
            <div class="math-line">
                <input type="text" class="answer-input" maxlength="4" placeholder="Answer" oninput="checkPracticeAnswer()">
            </div>
        </div>
        <div class="controls">
            <button onclick="checkPracticeAnswer()">Check Answer</button>
            <button onclick="generateNewExample()">New Problem</button>
        </div>
        <div id="feedback" class="feedback"></div>
    `;
}

function renderLearnDivision() {
    const { dividend, divisor, quotient } = currentExample;
    contentEl.innerHTML = `
        <div class="instructions">Learn Division: ${dividend} ÷ ${divisor}</div>
        <div class="math-display">
            <div class="math-line">
                <span class="number-part">${quotient}</span>
            </div>
            <div class="math-line">
                <span class="number-part">${divisor}│${dividend}</span>
            </div>
        </div>
        <div class="controls">
            <button onclick="generateNewExample()">New Example</button>
        </div>
        <div id="feedback" class="feedback"></div>
    `;
}

function renderPracticeDivision() {
    contentEl.innerHTML = `
        <div class="instructions">Practice Division</div>
        <div class="math-display">
            <div class="math-line">
                <input type="text" class="answer-input" maxlength="3" placeholder="Answer">
            </div>
            <div class="math-line">
                <span class="number-part">${currentExample.divisor}│${currentExample.dividend}</span>
            </div>
        </div>
        <div class="controls">
            <button onclick="generateNewExample()">New Problem</button>
        </div>
        <div id="feedback" class="feedback"></div>
    `;
}

function nextStep() {
    if (currentMode === 'learnMul') {
        if (currentStep < currentExample.steps.length) {
            currentStep++;
            renderCurrentView();
        }
    }
}

function checkPracticeAnswer() {
    const input = document.querySelector('.answer-input');
    if (input && parseInt(input.value) === currentExample.product) {
        showFeedback('correct', `Correct! ${currentExample.multiplicand} × ${currentExample.multiplier} = ${currentExample.product}`);
    } else {
        showFeedback('incorrect', 'Try again!');
    }
}

function renderCurrentView() {
    if (currentMode === 'learnMul') renderLearnMultiplication();
    else if (currentMode === 'practiceMul') renderPracticeMultiplication();
    else if (currentMode === 'learnDiv') renderLearnDivision();
    else if (currentMode === 'practiceDiv') renderPracticeDivision();
}

function showFeedback(type, message) {
    const feedbackEl = document.getElementById('feedback');
    if (feedbackEl) {
        feedbackEl.textContent = message;
        feedbackEl.className = `feedback ${type}`;
    }
}

// Initialize
switchMode('learnMul');
