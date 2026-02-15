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
  } else if (section === 'practice-mult') {
    generatePracticeExample();
    renderPracticeMenu();
  } else if (section === 'learn-div') {
    document.getElementById('content').innerHTML = `<p class="text-purple-700 text-xl">Division learning coming next! 🚌</p>`;
  } else if (section === 'practice-div') {
    document.getElementById('content').innerHTML = `<p class="text-pink-700 text-xl">Division practice coming next! ✏️</p>`;
  }
}

// -------------------- LEARN MULTIPLICATION --------------------
function generateLearnExample() {
  const a = Math.floor(Math.random() * 50) + 10;
  const b = Math.floor(Math.random() * 90) + 10;
  currentExample = { a, b };
  learnStep = 0;
}

function renderLearnMultiplication() {
  const { a, b } = currentExample;

  const aTens = Math.floor(a/10);
  const aOnes = a % 10;
  const bTens = Math.floor(b/10);
  const bOnes = b % 10;

  // Compute step results
  const stepResults = {
    step1: bOnes * aOnes,
    step2: bOnes * aTens,
    step3: bTens * aOnes,
    step4: bTens * aTens
  };

  // Combine partial products (adding correct zeros)
  const onesRow = stepResults.step1 + stepResults.step2*10;
  const tensRow = stepResults.step3 + stepResults.step4*10;
  const finalAnswer = a * b;

  const html = `
    <h2 class="text-2xl font-bold text-green-600 mb-3">Learn Multiplication Step by Step ✨</h2>

    <div class="text-3xl mb-4 leading-tight text-right">
      <div>${a}</div>
      <div>× ${b}</div>
      <div>────────</div>
      
      ${learnStep >= 1 ? `<div class="text-blue-600">1️⃣ Ones digit × Ones digit: ${aOnes}×${bOnes} = ${stepResults.step1}</div>` : `<div class="text-gray-300">____</div>`}
      ${learnStep >= 2 ? `<div class="text-purple-600">2️⃣ Ones × Tens: ${aTens}×${bOnes} = ${stepResults.step2}</div>` : `<div class="text-gray-300">____</div>`}
      ${learnStep >= 3 ? `<div class="text-blue-600">3️⃣ Tens × Ones: ${aOnes}×${bTens} = ${stepResults.step3}</div>` : `<div class="text-gray-300">____</div>`}
      ${learnStep >= 4 ? `<div class="text-purple-600">4️⃣ Tens × Tens: ${aTens}×${bTens} = ${stepResults.step4}</div>` : `<div class="text-gray-300">____</div>`}

      <div>────────</div>
      ${learnStep >= 5 ? `<div class="text-green-700 font-bold">${finalAnswer}</div>` : `<div class="text-gray-300">____</div>`}
    </div>

    <div class="text-lg mb-4 min-h-[100px]">
      ${getLearnExplanation(a,b,aTens,aOnes,bTens,bOnes,stepResults)}
    </div>

    <div class="flex gap-3 justify-center">
      ${learnStep < 5 ? `<button onclick="nextLearnStep()" class="bg-blue-500 text-white px-6 py-2 rounded-xl">Next Step ➡️</button>` : ''}
      <button onclick="generateLearnExample(); learnStep=0; renderLearnMultiplication();" class="bg-gray-500 text-white px-6 py-2 rounded-xl">Next Example 🔄</button>
    </div>
  `;

  document.getElementById('content').innerHTML = html;
}

function getLearnExplanation(a,b,aTens,aOnes,bTens,bOnes,steps) {
  switch(learnStep) {
    case 0: return `Look at the bottom number ${b}. Start with the ones digit: ${bOnes}.`;
    case 1: return `Step 1: Multiply ones digits: ${bOnes} × ${aOnes} = ${steps.step1}`;
    case 2: return `Step 2: Multiply ones digit × tens digit: ${bOnes} × ${aTens} = ${steps.step2} (shift left one column)`;
    case 3: return `Step 3: Multiply tens digit × ones digit: ${bTens} × ${aOnes} = ${steps.step3}`;
    case 4: return `Step 4: Multiply tens × tens: ${bTens} × ${aTens} = ${steps.step4} (shift left one column)`;
    case 5: return `Finally, sum all partial products to get the total: ${a} × ${b} = ${a*b}`;
    default: return '';
  }
}

function nextLearnStep() { learnStep++; renderLearnMultiplication(); }

// -------------------- PRACTICE MULTIPLICATION --------------------
function generatePracticeExample() {
  const a = Math.floor(Math.random()*50)+10;
  const b = Math.floor(Math.random()*90)+10;
  practiceExample = {a,b};
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
  const {a,b} = practiceExample;
  const onesB = b%10, tensB = Math.floor(b/10);
  const onesProduct = a*onesB;
  const tensProduct = a*tensB;
  const finalAnswer = a*b;

  const html = `
    <h2 class="text-2xl font-bold text-yellow-600 mb-3">Your Turn! 💪</h2>

    <div class="text-3xl mb-4 leading-tight text-right">
      <div>${a}</div>
      <div>× ${b}</div>
      <div>────────</div>

      <div><input id="onesRow" class="border w-32 text-right text-2xl mb-2" placeholder="First line" ${practiceMode==='guided' && practiceStep!==0?'disabled':''}/></div>
      <div><input id="tensRow" class="border w-32 text-right text-2xl mb-2" placeholder="Second line (type zero!)" ${practiceMode==='guided' && practiceStep!==1?'disabled':''}/></div>

      <div>────────</div>
      <div><input id="finalRow" class="border w-32 text-right text-2xl" placeholder="Final answer" ${practiceMode==='guided' && practiceStep!==2?'disabled':''}/></div>
    </div>

    <div id="practiceHint" class="mb-3 text-lg min-h-[50px]"></div>

    <div class="flex gap-3 justify-center">
      <button onclick="checkPractice(${a},${b},${onesProduct},${tensProduct},${finalAnswer})" class="bg-blue-500 text-white px-6 py-2 rounded-xl">Check Answer ✔️</button>
      <button onclick="generatePracticeExample(); renderPracticeMenu();" class="bg-gray-500 text-white px-6 py-2 rounded-xl">New Problem 🔄</button>
    </div>
  `;

  document.getElementById('content').innerHTML = html;
  if(practiceMode==='guided') updatePracticeHint(a,b,onesB,tensB);
}

function updatePracticeHint(a,b,onesB,tensB) {
  if(practiceStep===0) document.getElementById('practiceHint').innerText = `Step 1: Multiply ones digit ${onesB} × ${a} and write FIRST line`;
  else if(practiceStep===1) document.getElementById('practiceHint').innerText = `Step 2: Multiply tens digit ${tensB} × ${a} and write SECOND line. Type the zero manually!`;
  else document.getElementById('practiceHint').innerText = `Step 3: Add both lines to get FINAL answer`;
}

function checkPractice(a,b,onesProduct,tensProduct,finalAnswer){
  const onesInput = document.getElementById('onesRow').value.trim();
  const tensInput = document.getElementById('tensRow').value.trim();
  const finalInput = document.getElementById('finalRow').value.trim();

  if(practiceMode==='guided'){
    if(practiceStep===0){
      if(parseInt(onesInput)===onesProduct){ practiceStep=1; updatePracticeHint(a,b,b%10,Math.floor(b/10)); alert('Great! Now do the tens row 🎉'); }
      else alert('Try again! Multiply ones digit carefully 😊'); return;
    }
    if(practiceStep===1){
      if(parseInt(tensInput)===tensProduct*10){ practiceStep=2; updatePracticeHint(a,b,b%10,Math.floor(b/10)); alert('Awesome! Now add both rows ✨'); }
      else alert('Remember to type the zero for tens row!'); return;
    }
    if(practiceStep===2){
      if(parseInt(finalInput)===finalAnswer) alert('Correct!!! 🌟 You did the full column multiplication!');
      else alert('Almost! Add the two rows carefully 😊');
    }
  } else {
    if(parseInt(onesInput)===onesProduct && parseInt(tensInput)===tensProduct*10 && parseInt(finalInput)===finalAnswer) alert('Perfect! 🎉');
    else alert('Check each row again 👍');
  }
}
