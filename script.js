// -------------------- GLOBAL STATE --------------------
let currentExample = null;
let learnStep = 0;
let practiceMode = 'guided';
let practiceStep = 0;
let practiceExample = null;

// -------------------- SECTION SELECTION --------------------
function setSection(section) {
  learnStep = 0;
  practiceStep = 0;

  if (section === 'learn-mult') {
    generateLearnExample();
    renderLearnMultiplication();
  }
  else if (section === 'practice-mult') {
    generatePracticeExample();
    renderPracticeMenu();
  }
  else if (section === 'learn-div') {
    document.getElementById('content').innerHTML = `<p class="text-purple-700 text-xl">Division learning coming next! 🚌</p>`;
  }
  else if (section === 'practice-div') {
    document.getElementById('content').innerHTML = `<p class="text-pink-700 text-xl">Division practice coming next! ✏️</p>`;
  }
}

// -------------------- LEARN MULTIPLICATION --------------------
function generateLearnExample() {
  const a = Math.floor(Math.random() * 50) + 10; // 10–59
  const b = Math.floor(Math.random() * 90) + 10; // 10–99
  currentExample = { a, b };
}

function renderLearnMultiplication() {
  const { a, b } = currentExample;
  const onesB = b % 10;
  const tensB = Math.floor(b / 10);
  const onesProduct = a * onesB;
  const tensProduct = a * tensB;
  const finalAnswer = a * b;

  const html = `
    <h2 class="text-2xl font-bold text-green-600 mb-3">Let’s Learn Multiplication 🎓</h2>

    <div class="text-3xl font-mono mb-4 leading-tight text-right">
      <div> ${a} </div>
      <div>× ${b} </div>
      <div>────────</div>

      ${learnStep >= 2 ? `<div class="text-blue-600">${onesProduct}</div>` : `<div class="text-gray-300">____</div>`}
      ${learnStep >= 4 ? `<div class="text-purple-600">${tensProduct}0</div>` : `<div class="text-gray-300">____0</div>`}

      <div>────────</div>
      ${learnStep >= 5 ? `<div class="text-green-700 font-bold">${finalAnswer}</div>` : `<div class="text-gray-300">____</div>`}
    </div>

    <div class="text-lg mb-4 min-h-[80px]">
      ${getLearnExplanation(a, b, onesB, tensB, onesProduct, tensProduct, finalAnswer)}
    </div>

    <div class="flex gap-3 justify-center">
      ${learnStep < 5 ? `<button onclick="nextLearnStep()" class="bg-blue-500 text-white px-6 py-2 rounded-xl">Next Step ➡️</button>` : ''}
      <button onclick="generateLearnExample(); learnStep=0; renderLearnMultiplication();" class="bg-gray-500 text-white px-6 py-2 rounded-xl">Next Example 🔄</button>
    </div>
  `;

  document.getElementById('content').innerHTML = html;
}

function getLearnExplanation(a, b, onesB, tensB, onesProduct, tensProduct, finalAnswer) {
  switch (learnStep) {
    case 0: return `Look at the bottom number ${b}. The ones digit is ${onesB}. We start with that.`;
    case 1: return `Now multiply the ones digit: ${onesB} × ${a}`;
    case 2: return `${onesB} × ${a} = ${onesProduct}. Write this as the FIRST line.`;
    case 3: return `Next, move to the tens digit ${tensB}. This is really ${tensB} tens, so we need to add a zero at the end.`;
    case 4: return `${tensB} × ${a} = ${tensProduct}. Write ${tensProduct}0 as the SECOND line.`;
    case 5: return `Finally, add the two rows: ${onesProduct} + ${tensProduct}0 = ${finalAnswer}`;
    default: return '';
  }
}

function nextLearnStep() {
  learnStep++;
  renderLearnMultiplication();
}

// -------------------- PRACTICE MULTIPLICATION --------------------
function generatePracticeExample() {
  const a = Math.floor(Math.random() * 50) + 10;
  const b = Math.floor(Math.random() * 90) + 10;
  practiceExample = { a, b };
  practiceStep = 0;
}

function renderPracticeMenu() {
  document.getElementById('content').innerHTML = `
    <h2 class="text-2xl font-bold text-yellow-600 mb-4">Practice Multiplication ✏️</h2>
    <p class="mb-4">Choose how you want to practice:</p>
    <div class="flex gap-4 justify-center">
      <button onclick="practiceMode='guided'; renderPracticeMultiplication();" class="bg-blue-500 text-white px-4 py-2 rounded-xl">Guided Steps</button>
      <button onclick="practiceMode='free'; renderPracticeMultiplication();" class="bg-green-500 text-white px-4 py-2 rounded-xl">Fill All & Check</button>
    </div>
  `;
}

function renderPracticeMultiplication() {
  const { a, b } = practiceExample;
  const onesB = b % 10;
  const tensB = Math.floor(b / 10);
  const onesProduct = a * onesB;
  const tensProduct = a * tensB;
  const finalAnswer = a * b;

  document.getElementById('content').innerHTML = `
    <h2 class="text-2xl font-bold text-yellow-600 mb-3">Your Turn! 💪</h2>

    <div class="text-3xl font-mono mb-4 leading-tight text-right">
      <div> ${a} </div>
      <div>× ${b} </div>
      <div>────────</div>

      <input id="onesRow" class="border w-32 text-right text-2xl mb-1" placeholder="First line" ${practiceMode==='guided' && practiceStep!==0?'disabled':''} />
      <input id="tensRow" class="border w-32 text-right text-2xl mb-1" placeholder="Second line" ${practiceMode==='guided' && practiceStep!==1?'disabled':''} />

      <div>────────</div>
      <input id="finalRow" class="border w-32 text-right text-2xl" placeholder="Final answer" ${practiceMode==='guided' && practiceStep!==2?'disabled':''} />
    </div>

    <div id="practiceHint" class="mb-3 text-lg"></div>

    <div class="flex gap-3 justify-center">
      <button onclick="checkPractice(${a}, ${b}, ${onesProduct}, ${tensProduct}, ${finalAnswer})" class="bg-blue-500 text-white px-6 py-2 rounded-xl">Check Answer ✔️</button>
      <button onclick="generatePracticeExample(); renderPracticeMenu();" class="bg-gray-500 text-white px-6 py-2 rounded-xl">New Problem 🔄</button>
    </div>
  `;

  if (practiceMode === 'guided') updatePracticeHint(a, b, onesB, tensB);
}

function updatePracticeHint(a, b, onesB, tensB) {
  if (practiceStep === 0) {
    document.getElementById('practiceHint').innerText = `Step 1: Multiply the ones digit: ${onesB} × ${a} and write the FIRST line.`;
  } else if (practiceStep === 1) {
    document.getElementById('practiceHint').innerText = `Step 2: Multiply the tens digit: ${tensB} × ${a} and write the SECOND line. Type the zero yourself!`;
  } else {
    document.getElementById('practiceHint').innerText = `Step 3: Add the two rows to get the FINAL answer.`;
  }
}

function checkPractice(a, b, onesProduct, tensProduct, finalAnswer) {
  const onesInput = document.getElementById('onesRow').value.trim();
  const tensInput = document.getElementById('tensRow').value.trim();
  const finalInput = document.getElementById('finalRow').value.trim();

  if (practiceMode === 'guided') {
    if (practiceStep === 0) {
      if (parseInt(onesInput) === onesProduct) { practiceStep = 1; updatePracticeHint(a,b,b%10,Math.floor(b/10)); alert('Great! Now do the tens row 🎉'); }
      else { alert('Try again! Multiply the ones digit carefully 😊'); }
      return;
    }
    if (practiceStep === 1) {
      if (parseInt(tensInput) === tensProduct*10) { practiceStep = 2; updatePracticeHint(a,b,b%10,Math.floor(b/10)); alert('Awesome! Now add both rows ✨'); }
      else { alert('Remember: multiply then type the zero for the tens row!'); }
      return;
    }
    if (practiceStep === 2) {
      if (parseInt(finalInput) === finalAnswer) { alert('Correct!!! 🌟 You did the full column multiplication!'); }
      else { alert('Almost! Add the two rows carefully 😊'); }
    }
  } else {
    if (parseInt(onesInput)===onesProduct && parseInt(tensInput)===tensProduct*10 && parseInt(finalInput)===finalAnswer) { alert('Perfect! 🎉'); }
    else { alert('Check each row again 👍'); }
  }
}
