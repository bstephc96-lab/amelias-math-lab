// Global state
let currentMode = 'learnMul';
let currentExample = {};
let currentStep = 0;
let isGuided = true;
let difficultyLevel = 'medium'; // easy, medium, hard

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

// Generate random example with different difficulty levels
function generateNewExample() {
    if (currentMode.startsWith('learnMul') || currentMode.startsWith('practiceMul')) {
        let num1, num2;
        
        // Mix of difficulty levels for variety
        const difficulties = ['easy', 'medium'];
        const selectedDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        
        if (selectedDifficulty === 'easy') {
            // Single digit × two digit: 23 × 4
            num1 = Math.floor(Math.random() * 90) + 10; // 10-99
            num2 = Math.floor(Math.random() * 8) + 2;   // 2-9
        } else {
            // Two digit × two digit: 87 × 34
            num1 = Math.floor(Math.random() * 90) + 10; // 10-99
            num2 = Math.floor(Math.random() * 90) + 10; // 10-99
        }
        
        currentExample = {
            multiplicand: num1,
            multiplier: num2,
            product: num1 * num2,
            difficulty: selectedDifficulty,
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

// Enhanced multiplication steps for multi-digit
function calculateMultiplicationSteps(multiplicand, multiplier) {
    const steps = [];
    const multiplicandStr = multiplicand.toString();
    const multiplierStr = multiplier.toString();
    
    if (multiplierStr.length === 1) {
        // Single digit multiplier (like 87 × 4)
        return calculateSingleDigitSteps(multiplicand, multiplier);
    } else {
        // Multi-digit multiplier (like 87 × 34)
        return calculateMultiDigitSteps(multiplicand, multiplier);
    }
}

function calculateSingleDigitSteps(multiplicand, multiplier) {
    const steps = [];
    const multiplicandStr = multiplicand.toString();
    
    // Work from right to left
    let carry = 0;
    let result = '';
    
    for (let i = multiplicandStr.length - 1; i >= 0; i--) {
        const digit = parseInt(multiplicandStr[i]);
        const product = digit * multiplier + carry;
        const resultDigit = product % 10;
        carry = Math.floor(product / 10);
        
        const position = i === multiplicandStr.length - 1 ? 'ones' : 
                        i === multiplicandStr.length - 2 ? 'tens' : 'hundreds';
        
        steps.push({
            description: `${digit} × ${multiplier}${carry > resultDigit ? ` + ${carry - Math.floor((digit * multiplier)/10)} (carry)` : ''} = ${product}`,
            digit: resultDigit,
            carry: carry,
            position: position,
            type: 'multiply'
        });
        
        result = resultDigit + result;
    }
    
    if (carry > 0) {
        steps.push({
            description: `Write final carry: ${carry}`,
            digit: carry,
            carry: 0,
            position: 'final',
            type: 'carry'
        });
    }
    
    return steps;
}

function calculateMultiDigitSteps(multiplicand, multiplier) {
    const steps = [];
    const multiplierStr = multiplier.toString();
    const partialProducts = [];
    
    // Calculate each partial product
    for (let i = multiplierStr.length - 1; i >= 0; i--) {
        const digit = parseInt(multiplierStr[i]);
        const position = multiplierStr.length - 1 - i; // 0 for ones, 1 for tens, etc.
        const partialProduct = multiplicand * digit * Math.pow(10, position);
        
        partialProducts.push({
            digit: digit,
            position: position === 0 ? 'ones' : position === 1 ? 'tens' : 'hundreds',
            product: partialProduct,
            displayProduct: partialProduct.toString()
        });
        
        steps.push({
            description: `${multiplicand} × ${digit} (${position === 0 ? 'ones' : position === 1 ? 'tens' : 'hundreds'} place) = ${multiplicand * digit}${position > 0 ? ` × ${Math.pow(10, position)} = ${partialProduct}` : ''}`,
            type: 'partial',
            partialProduct: partialProduct,
            multiplierDigit: digit,
            position: position === 0 ? 'ones' : position === 1 ? 'tens' : 'hundreds'
        });
    }
    
    // Final addition step
    steps.push({
        description: `Add partial products: ${partialProducts.map(p => p.product).join(' + ')} = ${multiplicand * multiplier}`,
        type: 'addition',
        partialProducts: partialProducts,
        finalAnswer: multiplicand * multiplier
    });
    
    return steps;
}

// Enhanced rendering for multi-digit
function renderLearnMultiplication() {
    const { multiplicand, multiplier, product, steps, difficulty } = currentExample;
    
    if (!steps[currentStep]) {
        currentStep = 0;
    }
    
    const step = steps[currentStep];
    
    let html = `
        <div class="instructions">
            <strong>${difficulty === 'easy' ? 'Single-digit' : 'Multi-digit'} Multiplication:</strong><br>
            ${step ? `Step ${currentStep + 1}: ${step.description}` : 'Click Next Step to begin!'}
        </div>
    `;
    
    html += '<div class="math-display">';
    
    // Problem setup
    const maxWidth = Math.max(multiplicand.toString().length, multiplier.toString().length, product.toString().length) + 2;
    
    html += `<div class="math-line">`;
    html += `<span class="number-part" style="min-width: ${maxWidth * 15}px;">${multiplicand.toString().padStart(maxWidth)}</span>`;
    html += `</div>`;
    
    html += `<div class="math-line">`;
    html += `<span class="operator">×</span><span class="number-part" style="min-width: ${maxWidth * 15}px;">${multiplier.toString().padStart(maxWidth - 1)}</span>`;
    html += `</div>`;
    
    html += `<div class="math-line">`;
    html += `<span class="divider">${'─'.repeat(maxWidth + 1)}</span>`;
    html += `</div>`;
    
    // Show progression based on step type
    if (difficulty === 'easy') {
        // Single digit multiplication - show carries and building answer
        renderSingleDigitSteps(html, steps, currentStep, maxWidth);
    } else {
        // Multi-digit multiplication - show partial products
        renderMultiDigitSteps(html, steps, currentStep, maxWidth);
    }
    
    html += '</div>'; // Close math-display
    
    // Controls
    html += `<div class="controls">`;
    if (currentStep < steps.length) {
        html += `<button onclick="nextStep()">Next Step</button>`;
    }
    if (currentStep === steps.length) {
        html += `<span class="final-result">Final Answer: <strong>${product}</strong></span>`;
    }
    html += `<button onclick="generateNewExample()">New Example</button>`;
    html += `</div>`;
    
    html += `<div id="feedback" class="feedback"></div>`;
    
    contentEl.innerHTML = html;
}

function renderSingleDigitSteps(html, steps, currentStep, maxWidth) {
    // Show carries
    if (currentStep > 0) {
        let carryDisplay = '';
        for (let i = 0; i < currentStep; i++) {
            if (steps[i].carry > 0) {
                carryDisplay = steps[i].carry + ' ' + carryDisplay;
            }
        }
        if (carryDisplay.trim()) {
            html += `<div class="math-line carry-row">`;
            html += `<span class="number-part" style="min-width: ${maxWidth * 15}px; color: #FF9800;">${carryDisplay.padStart(maxWidth)}</span>`;
            html += `</div>`;
        }
    }
    
    // Build answer progressively
    if (currentStep > 0) {
        let answerSoFar = '';
        for (let i = 0; i < Math.min(currentStep, steps.length); i++) {
            if (steps[i].type === 'multiply') {
                answerSoFar = steps[i].digit + answerSoFar;
            } else if (steps[i].type === 'carry') {
                answerSoFar = steps[i].digit + answerSoFar;
            }
        }
        
        html += `<div class="math-line ${currentStep === steps.length ? 'final-answer' : ''}">`;
        html += `<span class="number-part" style="min-width: ${maxWidth * 15}px;">${answerSoFar.padStart(maxWidth)}</span>`;
        html += `</div>`;
    }
}

function renderMultiDigitSteps(html, steps, currentStep, maxWidth) {
    // Show partial products as they're calculated
    let partialsShown = 0;
    
    for (let i = 0; i <= currentStep && i < steps.length; i++) {
        if (steps[i].type === 'partial') {
            html += `<div class="math-line partial-product">`;
            html += `<span class="number-part" style="min-width: ${maxWidth * 15}px;">${steps[i].partialProduct.toString().padStart(maxWidth)}</span>`;
            html += `</div>`;
            partialsShown++;
        }
    }
    
    // Show addition line if we're at the addition step
    if (currentStep === steps.length - 1 && steps[currentStep].type === 'addition') {
        html += `<div class="math-line">`;
        html += `<span class="divider">${'─'.repeat(maxWidth + 1)}</span>`;
        html += `</div>`;
        
        html += `<div class="math-line final-answer">`;
        html += `<span class="number-part" style="min-width: ${maxWidth * 15}px;">${steps[currentStep].finalAnswer.toString().padStart(maxWidth)}</span>`;
        html += `</div>`;
    }
}

function renderPracticeMultiplication() {
    const { multiplicand, multiplier, product } = currentExample;
    const maxWidth = Math.max(multiplicand.toString().length, multiplier.toString().length, product.toString().length) + 2;
    
    let html = `
        <div class="instructions">Practice Mode - Calculate: ${multiplicand} × ${multiplier}</div>
        <div class="math-display">
            <div class="math-line">
                <span class="number-part" style="min-width: ${maxWidth * 15}px;">${multiplicand.toString().padStart(maxWidth)}</span>
            </div>
            <div class="math-line">
                <span class="operator">×</span><span class="number-part" style="min-width: ${maxWidth * 15}px;">${multiplier.toString().padStart(maxWidth - 1)}</span>
            </div>
            <div class="math-line">
                <span class="divider">${'─'.repeat(maxWidth + 1)}</span>
            </div>
            <div class="math-line">
                <input type="text" class="answer-input" style="width: ${maxWidth * 15}px;" maxlength="${product.toString().length + 1}" placeholder="Your answer" oninput="checkPracticeAnswer()">
            </div>
        </div>
        <div class="controls">
            <button onclick="checkPracticeAnswer()">Check Answer</button>
            <button onclick="generateNewExample()">New Problem</button>
        </div>
        <div id="feedback" class="feedback"></div>
    `;
    
    contentEl.innerHTML = html;
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
        showFeedback('correct', `Excellent! ${currentExample.multiplicand} × ${currentExample.multiplier} = ${currentExample.product}`);
    } else {
        showFeedback('incorrect', `Not quite right. Try again! Hint: Break it down step by step.`);
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
