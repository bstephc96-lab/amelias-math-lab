// -------------------- GLOBAL STATE --------------------
let currentExample = null;
let learnStep = 0;
let practiceStep = 0;
let practiceExample = null;
let guidedMode = true;

// -------------------- SECTION SELECTION --------------------
function setSection(section) {
  learnStep = 0;
  practiceStep = 0;

  if(section==='learn-mult'){
    generateLearnExample();
    renderLearnMultiplication();
  }
  else if(section==='practice-mult'){
    generatePracticeExample();
    renderPracticeMultiplicationMenu();
  }
}

// -------------------- LEARN MULTIPLICATION --------------------
function generateLearnExample(){
  const a = Math.floor(Math.random()*50)+10;
  const b = Math.floor(Math.random()*50)+2;
  currentExample = {a,b};
  learnStep=0;
}

function renderLearnMultiplication(){
  const {a,b} = currentExample;
  const aDigits = a.toString().split('').map(Number);
  const bDigits = b.toString().split('').map(Number);
  const rows = [];
  const carries = [];

  // Only single-step for each digit multiplication
  let carry = 0;
  for(let i=aDigits.length-1;i>=0;i--){
    const partial = aDigits[i]*b + carry;
    const digit = partial%10;
    carry = Math.floor(partial/10);
    rows.unshift({digit, carry});
  }
  if(carry>0) rows.unshift({digit:carry, carry:0});

  // HTML
  let html = `<h2 class="text-2xl font-bold text-green-600 mb-3">Learn Multiplication Step by Step ✨</h2>`;
  html += `<div class="inline-block text-right mb-4">`;

  // Display carry row
  html += `<div class="text-red-600 mb-1">`;
  for(let i=0;i<rows.length;i++){
    html += `${i<learnStep ? rows[i].carry||' ' : ' '} `;
  }
  html += `</div>`;

  // Display original number
  html += `<div>${' '.repeat(rows.length-aDigits.length)}${a}</div>`;
  html += `<div>× ${b}</div>`;
  html += `<div>${'─'.repeat(rows.length+2)}</div>`;

  // Display each step
  for(let i=0;i<rows.length;i++){
    if(i<learnStep){
      html += `<div class="text-blue-600">${rows[i].digit}</div>`;
    } else {
      html += `<div class="text-gray-300">_</div>`;
    }
  }

  // Instructions
  let instruction = '';
  if(learnStep<rows.length){
    instruction = `Step ${learnStep+1}: Multiply the active digit and add the carry.`;
  } else {
    instruction = `Done! Final answer: ${a*b}`;
  }

  html += `</div><div class="mb-4 text-lg">${instruction}</div>`;
  html += `<div class="flex gap-3 justify-center">`;
  if(learnStep<rows.length) html += `<button onclick="learnStep++; renderLearnMultiplication()" class="bg-blue-500 text-white px-6 py-2 rounded-xl">Next Step ➡️</button>`;
  html += `<button onclick="generateLearnExample(); learnStep=0; renderLearnMultiplication();" class="bg-gray-500 text-white px-6 py-2 rounded-xl">Next Example 🔄</button>`;
  html += `</div>`;

  document.getElementById('content').innerHTML = html;
}

// -------------------- PRACTICE MULTIPLICATION --------------------
function generatePracticeExample(){
  const a = Math.floor(Math.random()*50)+10;
  const b = Math.floor(Math.random()*50)+2;
  practiceExample = {a,b};
  practiceStep = 0;
}

function renderPracticeMultiplicationMenu(){
  document.getElementById('content').innerHTML = `
    <h2 class="text-2xl font-bold text-yellow-600 mb-4">Practice Multiplication ✏️</h2>
    <div class="flex gap-4 justify-center">
      <button onclick="guidedMode=true; renderPracticeMultiplication();" class="bg-blue-500 text-white px-4 py-2 rounded-xl">Guided Steps</button>
      <button onclick="guidedMode=false; renderPracticeMultiplication();" class="bg-green-500 text-white px-4 py-2 rounded-xl">Free Entry</button>
    </div>
  `;
}

function renderPracticeMultiplication(){
  const {a,b} = practiceExample;
  const aDigits = a.toString().split('').map(Number);
  const bDigits = b.toString().split('').map(Number);

  // Prepare rows and carries like learn
  const rows = [];
  let carry=0;
  for(let i=aDigits.length-1;i>=0;i--){
    const partial = aDigits[i]*b + carry;
    const digit = partial%10;
    carry = Math.floor(partial/10);
    rows.unshift({digit, carry});
  }
  if(carry>0) rows.unshift({digit:carry, carry:0});

  // HTML
  let html = `<h2 class="text-2xl font-bold text-yellow-600 mb-3">Practice Multiplication 💪</h2>`;
  html += `<div class="inline-block text-right mb-4">`;

  // Carry row input
  html += `<div class="text-red-600 mb-1">`;
  for(let i=0;i<rows.length;i++){
    html += `<input id="carry-${i}" class="border w-6 text-center ${i===practiceStep?'bg-yellow-100':'bg-gray-100'}" maxlength="1" ${guidedMode && i!==practiceStep?'disabled':''}/>`;
  }
  html += `</div>`;

  // Number rows
  html += `<div>${' '.repeat(rows.length-aDigits.length)}${a}</div>`;
  html += `<div>× ${b}</div>`;
  html += `<div>${'─'.repeat(rows.length+2)}</div>`;

  // Partial product row input
  html += `<div>`;
  for(let i=0;i<rows.length;i++){
    html += `<input id="partial-${i}" class="border w-6 text-center ${i===practiceStep?'bg-yellow-100':'bg-gray-100'}" maxlength="2" ${guidedMode && i!==practiceStep?'disabled':''}/>`;
  }
  html += `</div></div>`;

  // Instructions
  let instruction = guidedMode ? `Step ${practiceStep+1}: Multiply the active digit and add carry. Enter the number.` : 'Fill in all digits and carry.';
  html += `<div class="mb-4 text-lg">${instruction}</div>`;

  // Buttons
  html += `<div class="flex gap-3 justify-center">
    <button onclick="checkPracticeStep()" class="bg-blue-500 text-white px-6 py-2 rounded-xl">Check Step ✔️</button>
    <button onclick="generatePracticeExample(); renderPracticeMultiplicationMenu();" class="bg-gray-500 text-white px-6 py-2 rounded-xl">New Problem 🔄</button>
  </div>`;

  document.getElementById('content').innerHTML = html;
}

function checkPracticeStep(){
  const {a,b} = practiceExample;
  const aDigits = a.toString().split('').map(Number);
  const bDigits = b.toString().split('').map(Number);

  let carry=0;
  const rows = [];
  for(let i=aDigits.length-1;i>=0;i--){
    const partial = aDigits[i]*b + carry;
    const digit = partial%10;
    carry = Math.floor(partial/10);
    rows.unshift({digit, carry});
  }
  if(carry>0) rows.unshift({digit:carry, carry:0});

  const inputDigit = parseInt(document.getElementById(`partial-${practiceStep}`).value.trim());
  if(inputDigit===rows[practiceStep].digit){
    alert('Correct! ✅');
    practiceStep++;
    if(practiceStep>=rows.length){
      alert(`Well done! Final answer: ${a*b}`);
    }
    renderPracticeMultiplication();
  } else {
    alert('Try again! Check your multiplication and carry.');
  }
}
