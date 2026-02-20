let mode = null;
let difficulty = "easy";

function setMode(newMode) {
  mode = newMode;
  renderDifficultySelector();
  loadNewProblem();
}

function renderDifficultySelector(){
  document.getElementById("difficulty-controls").innerHTML = `
    <div style="text-align:center;margin-bottom:10px;">
      Difficulty:
      <select onchange="setDifficulty(this.value)">
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
  `;
}

function setDifficulty(level){
  difficulty = level;
  loadNewProblem();
}

function loadNewProblem(){
  if(mode === 'learn-mult') renderLearnMultiplication();
  if(mode === 'practice-mult') renderPracticeMultiplication();
  if(mode === 'learn-div') renderLearnDivision();
  if(mode === 'practice-div') renderPracticeDivision();
}
