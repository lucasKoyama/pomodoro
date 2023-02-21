window.onload = () => {
  if (localStorage.getItem('focusTimer')) {
    focusTimer.value = localStorage.getItem('focusTimer');
    smallBreakTimer.value = localStorage.getItem('smallBreakTimer');
    breakTimer.value = localStorage.getItem('breakTimer');
    cycle.value = localStorage.getItem('cycle');
  }
};
const getById = id => { return document.getElementById(id); };
// Global variables
let fullCycle = 0;
let doneCycles = 0;
const focusTimer = getById('focus');
const smallBreakTimer = getById('smallBreak');
const breakTimer = getById('breakTimer');
const randomPhrase = getById('phrase');
const cycle = getById('cycle');
const recommend = getById('recommend');
const cycleBar = document.getElementsByClassName('cycle')[0];
const totalTime = getById('totalTime');
let countdown;
let phrases = [];
// buttons
const buttonOne = getById('buttonOne'); // focus or break
const reset = getById('reset');
const addPhraseBtn = getById('addPhrase');

// phrases
if (!localStorage.getItem('phrases')) {
  const initPhrase = ['As pessoas costumam dizer que a motivação não dura sempre. Bem, nem o efeito do banho, por isso recomenda-se diariamente'];
  localStorage.setItem('phrases', JSON.stringify(initPhrase));
  phrases = [...initPhrase];
} else {
  const savedPhrases = JSON.parse(localStorage.getItem('phrases'));
  phrases = [...savedPhrases];
}
addPhraseBtn.addEventListener('click', (event) => {
  const inputPhrase = getById('phrases');
  phrases.push(inputPhrase.value);
  localStorage.setItem('phrases', JSON.stringify(phrases));
  inputPhrase.value = '';
});

const disableAll = (boolean) => {
  const inputs = document.getElementsByTagName('input');
  buttonOne.toggleAttribute('disabled', boolean);
  addPhraseBtn.toggleAttribute('disabled', boolean);
  for (let i = 0; i < inputs.length; i += 1) {
    inputs[i].toggleAttribute('disabled', boolean)
  }
};

// pomodoro functions
const timer = (barType, time) => {
  const resetBars = () => {
    clearInterval(countdown);
    timerBar.style.width = '0px';
    timerBar.textContent = '';
    timerBar.classList.remove('activeBar');
    cycleBar.style.width = `${cycleBarPiece * doneCycles}px`;
    cycleBar.textContent = doneCycles;
    disableAll(false);
  };
  disableAll(true);
  const fullBar = parseInt(getComputedStyle(focusTimer).width) + 4;
  const oneSec = fullBar / time;
  let timePassed = 0;
  let secs = 0;
  let mins = 0;
  const cycleBarPiece = fullBar / cycle.value;
  const timerBar = document.getElementsByClassName(barType)[0];
  timerBar.classList.add('activeBar');
  timerBar.style.display = 'flex';
  timerBar.style.width = '0px';
  cycleBar.classList.add('activeBar');
  cycleBar.style.display = 'flex';
  const running = () => {
    time--;
    secs = time % 60;
    mins = Math.floor(time/ 60);
    if (timePassed < fullBar) { // filling bar
      timePassed += oneSec;
      timerBar.style.width = `${timePassed}px`;
      timerBar.textContent = `${mins}.${secs}`
    } else if (doneCycles < fullCycle) { // bar filled
      resetBars();
      buttonOne.textContent = 'Pausa';
      if (barType !== 'focus') {
        buttonOne.textContent = 'Focar';
      }
    } else {
      resetBars();
      buttonOne.textContent = 'Descanso';
    }
  };
  countdown = setInterval(running, 1);
};

const seconds = time => time.value * 60;
buttonOne.addEventListener('click', (event) => {
  event.preventDefault();
  // saving values
  localStorage.setItem('focusTimer', focusTimer.value);
  localStorage.setItem('smallBreakTimer', smallBreakTimer.value);
  localStorage.setItem('breakTimer', breakTimer.value);
  localStorage.setItem('cycle', cycle.value);
  // start pomodoro
  fullCycle = cycle.value;
  const timeOf = buttonOne.textContent;
  switch (timeOf) {
    case 'Focar':
      timer('focus', seconds(focusTimer));
      recommend.innerHTML = '<label for="check">Notificações do celular desligadas &nbsp<input type="checkbox" name="checked" id="check" checked></label>' +
                            '<label for="check">tela virada para baixo &nbsp<input type="checkbox" name="checked" id="check" checked></label> <br>' +
                            '<i class="fa-solid fa-bullseye fa-3x"></i>';
      doneCycles += 1;
      break;
    case 'Pausa':
      timer('smallBreak', seconds(smallBreakTimer));
      recommend.innerHTML = '<label for="check">Encher a garrafa de água &nbsp<input type="checkbox" name="checked" id="check" checked></label>' +
                            '<label for="check">Ir ao banheiro &nbsp<input type="checkbox" name="checked" id="check" checked></label> <br>' +
                            '<i class="fa-sharp fa-solid fa-droplet fa-3x"></i> <br>' +
                            '<h5>Beba 2L de água ao longo do dia</h5>';
      break;
    case 'Descanso':
      timer('break', seconds(breakTimer));
      doneCycles = 0;
      cycleBar.classList.remove('activeBar');
      cycleBar.style.width = '0px'
      cycleBar.style.display = 'none';
      recommend.innerHTML = '<label for="check">Lanchar &nbsp<input type="checkbox" name="checked" id="check" checked></label>' +
                            '<label for="check">Pegar um café &nbsp<input type="checkbox" name="checked" id="check" checked></label> <br>' + 
                            '<i class="fa-solid fa-mug-hot fa-3x"></i>';
      break;
  }
  randomPhrase.innerText = phrases[Math.floor(Math.random() * phrases.length)]
});

reset.addEventListener('click', (event) => {
  event.preventDefault();
  clearInterval(countdown);
  disableAll(false);
  focusTimer.value = localStorage.getItem('focusTimer');
  smallBreakTimer.value = localStorage.getItem('smallBreakTimer');
  breakTimer.value = localStorage.getItem('breakTimer');
  cycle.value = localStorage.getItem('cycle');
  buttonOne.textContent = 'Focar';
  randomPhrase.innerText = '';
  const bars = document.getElementsByClassName('bar');
  for (let i = 0; i < bars.length; i += 1) {
    bars[i].style.display = 'none';
  }
  recommend.innerHTML = '';
});
