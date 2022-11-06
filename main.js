import './style.css'
import words from './2000_words.json'

const MODES = {
  DUTCH: 'nl',
  ENGLISH: 'en'
};

const STATE_IDENTIFIER = "2000_state";
const INITIAL_STATE = {index: 0, total: 0, correct: 0, mode: MODES.DUTCH, history: []};
let state;
try {
  const savedValue = localStorage.getItem(STATE_IDENTIFIER);
  if(savedValue !== null)
    state = JSON.parse(savedValue);
  else
    state = INITIAL_STATE
} catch(e){
  state = INITIAL_STATE;
}
let WORD = words[state.index];

function getHistoryTile(index, correct){
  return `<span class="history ${correct ? 'correct' : 'wrong'}" data-index="${index}"></span>`
}
function render(){
  document.querySelector('#app').innerHTML = `
    <header>
    ${state.history.map(([index, correct]) => getHistoryTile(index, correct)).join("")}
    </header>
    <main>
      <div id=word>${WORD.word}</div>
      <div id=dutch class="${state.mode === MODES.DUTCH ? 'blurred' : ''}">${WORD.dutch}</div>
      <div id=english class="${state.mode === MODES.ENGLISH ? 'blurred' : ''}">${WORD.english}</div>
    </main>
    <footer>
      <button class="outcome correct">🔥</button>
      <button class="outcome wrong">❌</button>
    </footer>
  `;
}

function nextWord(){
  WORD = words[state.index];
}

function persistState(){
  localStorage.setItem(STATE_IDENTIFIER, JSON.stringify(state))
}

function updateState(correct){
  state.total++
  state.index++
  state.correct += correct ? 1 : 0;
  state.history.push([state.index, correct]);
  persistState();
}

document.body.addEventListener("click", function(ev){
  if(ev.target.matches("button")){
    const correct = ev.target.classList.contains("correct");
    updateState(correct);
    nextWord();
    render();
  }

  if(ev.target.matches(".blurred")){
    ev.target.classList.toggle('blurred')
  }
})

function addEvents(){}
function init(){
  render();
  addEvents();
}

init();
