// Global state
let currentMode = 'learnMul';
let currentExample = {};
let currentStep = 0;
let isGuided = true; // Default to guided mode for practice

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
    // Update active button
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(mode + 'Btn')?.classList.add('active');
    // Toggle guided/free for practice modes (add radio buttons later if needed)
    if (mode.includes('practice')) {
        isGuided = true; // Default
    }
    generateNewExample();
}

// Generate random example (easy level for now)
function generateNewExample() {
    if (currentMode.startsWith('learnMul') || currentMode.startsWith('practiceMul')) {
        // Easy: 1-digit (2-9) × 2-digit (10-99)
        const multiplier = Math.floor(Math.random() * 8) + 2; // 2-9
        const multiplicand = Math.floor(Math.random() * 90) + 10; // 10-99
        currentExample = {
            multiplier: multiplicand.toString(),
            multiplicand: multiplier.toString(),
            product: (multiplicand * multiplier).toString(),
            steps: calculateMultiplicationSteps(multiplicand, multiplier)
        };
    } else if (currentMode.startsWith('learnDiv') || currentMode.startsWith('practiceDiv')) {
        // Easy: 2-digit dividend ÷ 1-digit divisor (exact, no remainder)
        const divisor = Math.floor(Math.random() * 8) + 2; // 2-9
        const quotient = Math.floor(Math.random() * 9) + 1; // 1-9
        const dividend = divisor * quotient * 10 + Math.floor(Math.random() * 10) * divisor; // Makes 3-digit for practice
        currentExample = {
            dividend: dividend.toString(),
            divisor: divisor.toString(),
            quotient: quotient.toString(),
            remainder: '0',
            steps: calculateDivisionSteps(dividend, divisor) // Stub: implement full logic
        };
    }
    currentStep = 0;
    renderCurrentView();
}

// Multiplication steps calculation (for learn mode visuals)
function calculateMultiplicationSteps(multiplicand, multiplier) {
    const steps = [];
    // For 2-digit multiplicand (AB) × 1-digit (C): steps for B×C, then A×C with carry
    const a = parseInt(multiplicand[0]); // Tens
    const b = parseInt(multiplicand[1]); // Ones
    const c = parseInt(multiplier);

    // Step 1: Ones × multiplier (b * c)
    let onesProduct = b * c;
    let carry1 = Math.floor(onesProduct / 10);
    onesProduct %= 10;
    steps.push({ type: 'partial', value: onesProduct.toString(), carry: carry1, position: 'ones' });

    // Step 2: Tens × multiplier (a * c) + carry
    let tensProduct = a * c + carry1;
    let carry2 = Math.floor(tensProduct / 10);
    tensProduct %= 10;
    steps.push({ type: 'partial', value: tensProduct.toString(), carry: carry2, position: 'tens' });

    // Final hundreds (if any)
    steps.push({ type: 'final', value: carry2.toString() });
    return steps;
}

// Render for Learn Multiplication (step-by-step)
function renderLearnMultiplication() {
    const { multiplier, multiplicand, steps } = currentExample;
    const step = steps[currentStep];

    let html = `
        <div class="instructions">Step ${currentStep + 1}: Multiply the ${step.position} digit by ${multiplier}. Write the units digit below and carry the tens above.</div>
        <div class="math-container">
    `;

    // Top: Multiplicand (e.g., 12)
    html += `  ${multiplicand.padStart(2, ' ')}\n`;
    // Middle line
    html += `× ${multiplier.padStart(2, ' ')}\n`;
    html += `-${'─'.repeat(multiplicand.length + 1)}\n`;

    // Partial products (incremental)
    for (let i = 0; i < currentStep; i++) {
        const prevStep = steps[i];
        const partial = prevStep.value.padStart(2, ' ') + (i > 0 ? '0' : ''); // Shift for tens
        if (prevStep.carry) {
            html += `<span class="carry-row"> ${prevStep.carry} </span>\n`; // Carry row (only if needed)
        }
        html += ` ${partial.padStart(3, ' ')}\n`;
    }

    // Current active step highlight
    if (step.type === 'partial') {
        const activePartial = step.value.padStart(2, ' ') + (currentStep > 0 ? '0' : '');
        html += ` <span class="active-highlight">${activePartial}</span>\n`;
        if (step.carry) {
            html += `<span class="carry-row"> ${step.carry} </span>\n`;
        }
    }

    // Bottom line for partials
    if (currentStep > 0) {
        html += `-${'─'.repeat(multiplicand.length + 2)}\n`;
    }

    // Final answer (only after all steps)
    if (currentStep === steps.length - 1) {
        html += `<span class="final-answer">= ${currentExample.product}</span>\n`;
    }

    html += `</div>`;
    html += `<div class="controls">
        <button id="nextStepBtn" onclick="nextStep()">Next Step</button>
        <button onclick="generateNewExample()">New Example</button>
    </div>`;

    // Feedback area (stub for now)
    html += `<div id="feedback" class="feedback"></div>`;

    contentEl.innerHTML = html;
}

// Stub for Practice Multiplication (guided input)
function renderPracticeMultiplication() {
    // Similar to learn, but with input fields for partials
    // Only active input editable in guided mode
    const { multiplicand, multiplier, steps } = currentExample;
    let html = `
        <div class="instructions">Practice mode: Enter the ${steps[currentStep]?.position || 'next'} partial product.</div>
        <div class="math-container">
    `;
    // Problem setup (similar to learn)
    html += `  ${multiplicand.padStart(2, ' ')}\n× ${multiplier.padStart(2, ' ')}\n-${'─'.repeat(multiplicand.length + 1)}\n`;

    // Inputs for partials (use <input> with type="text" maxlength="1" for digits)
    // For simplicity, stub with one active input; expand to full grid
    for (let i = 0; i < steps.length - 1; i++) { // Partials only
        const isActive = i === currentStep;
        const inputValue = isActive ? `<input type="text" maxlength="3" id="partial${i}" class="${isActive ? 'active-highlight' : ''}" oninput="checkStep()">` : steps[i].value;
        html += ` ${inputValue.padStart(3, ' ')}\n`;
    }

    html += `</div>`;
    html += `<div class="controls">
        <button onclick="checkAnswer()">Check Answer</button>
        <button onclick="generateNewExample()">New Problem</button>
        <label><input type="checkbox" id="guidedToggle" checked onchange="toggleGuided()"> Guided Mode</label>
    </div>`;
    html += `<div id="feedback" class="feedback"></div>`;

    contentEl.innerHTML = html;
    if (isGuided) {
        // Disable non-active inputs (implement via JS)
        document.querySelectorAll('input:not(.active-highlight)').forEach(input => input.disabled = true);
    }
}

// Next step handler
function nextStep() {
    if (currentMode === 'learnMul' && currentStep < currentExample.steps.length - 1) {
        currentStep++;
        renderCurrentView();
    } else if (currentMode === 'practiceMul') {
        // Advance in guided mode after check
        if (isGuided && validateCurrentStep()) {
            currentStep++;
            if (currentStep >= currentExample.steps.length - 1) {
                showFeedback('correct', 'Great job! Final answer: ' + currentExample.product);
            } else {
                renderCurrentView();
            }
        }
    }
}

// Validate current step (for practice)
function validateCurrentStep() {
    const input = document.getElementById(`partial${currentStep}`);
    if (input && input.value == currentExample.steps[currentStep].value) {
        showFeedback('correct', 'Correct!');
        return true;
    } else {
        showFeedback('incorrect', 'Try again!');
        return false;
    }
}

// Check full answer (for free mode)
function checkAnswer() {
    // Collect all inputs and compare to expected
    let allCorrect = true;
    currentExample.steps.slice(0, -1).forEach((step, i) => { // Partials
        const input = document.getElementById(`partial${i}`);
        if (input && input.value != step.value) allCorrect = false;
    });
    if (allCorrect) {
        showFeedback('correct', 'Perfect! The product is ' + currentExample.product);
    } else {
        showFeedback('incorrect', 'Some steps are wrong. Try again!');
    }
}

function toggleGuided() {
    isGuided = document.getElementById('guidedToggle').checked;
    renderCurrentView(); // Re-render to enable/disable inputs
}

// Stub for division (implement similar step-by-step logic)
function calculateDivisionSteps(dividend, divisor) {
    // Placeholder: full long division steps (e.g., how many times divisor goes into partial dividend)
    return [{ type: 'quotient', value: '1', position: 'first' }, { type: 'subtract', value: '2' }, { type: 'final', remainder: '0' }];
}

function renderLearnDivision() {
    const { dividend, divisor, steps } = currentExample;
    contentEl.innerHTML = `
        <div class="instructions">Division steps: How many times does ${divisor} go into the first part of ${dividend}?</div>
        <div class="math-container">
            <span class="active-highlight">${dividend}</span> ÷ ${divisor} = ${steps[currentStep]?.value || ''} (remainder ${currentExample.remainder})
        </div>
        <div class="controls">
            <button onclick="nextStep()">Next Step</button>
            <button onclick="generateNewExample()">New Example</button>
        </div>
        <div id="feedback" class="feedback"></div>
    `;
    // Expand: Draw long division bracket with visuals
}

function renderPracticeDivision() {
    contentEl.innerHTML = `
        <div class="instructions">Enter the quotient digit.</div>
        <div class="math-container">
            <input type="text" maxlength="1" id="quotientInput" class="active-highlight" oninput="checkStep()"> (for current step)
        </div>
        <div class="controls">
            <button onclick="checkAnswer()">Check Answer</button>
            <button onclick="generateNewExample()">New Problem</button>
        </div>
        <div id="feedback" class="feedback"></div>
    `;
    // Expand: Full inputs for quotient and remainders
}

// Render based on current mode
function renderCurrentView() {
    if (currentMode === 'learnMul') renderLearnMultiplication();
    else if (currentMode === 'practiceMul') renderPracticeMultiplication();
    else if (currentMode === 'learnDiv') renderLearnDivision();
    else if (currentMode === 'practiceDiv') renderPracticeDivision();
}

// Feedback display
function showFeedback(type, message) {
    const feedbackEl = document.getElementById('feedback');
    feedbackEl.textContent = message;
    feedbackEl.className = `feedback ${type}`;
    // Optional: Add animation (e.g., fade in)
    feedbackEl.style.opacity = '0';
    setTimeout(() => { feedbackEl.style.transition = 'opacity 0.5s'; feedbackEl.style.opacity = '1'; }, 10);
}

// Initialize
switchMode('learnMul'); // Start with Learn Multiplication
