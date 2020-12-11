// Pokemon class
class Pokemon {
  constructor(level, name, imagePath, height, width) {
    this.level = level;
    this.name = name;
    this.imagePath = imagePath;
    this.height = height;
    this.width = width;
  }
}

// Levels
const levels = {
  EASY: 'easy',
  NORMAL: 'normal',
  HARD: 'hard',
};

// Variables
let validNumber = Math.ceil(Math.random() * 100);
const pokemonsList = [
  new Pokemon(
    levels.EASY,
    'bulbasaur',
    './images/pokemons/bulbasaur.gif',
    200,
    200,
  ),
  new Pokemon(
    levels.EASY,
    'charmander',
    './images/pokemons/charmander.gif',
    220,
    220,
  ),
  new Pokemon(
    levels.EASY,
    'squirtle',
    './images/pokemons/squirtle.gif',
    200,
    200,
  ),
  new Pokemon(levels.NORMAL, 'evee', './images/pokemons/evee.webp', 200, 200),
  new Pokemon(
    levels.NORMAL,
    'pikachu',
    './images/pokemons/pikachu.gif',
    200,
    200,
  ),
  new Pokemon(levels.NORMAL, 'gasly', './images/pokemons/gasly.gif', 400, 400),
  new Pokemon(
    levels.HARD,
    'charizard',
    './images/pokemons/charizard.gif',
    400,
    400,
  ),
  new Pokemon(
    levels.HARD,
    'lucario',
    './images/pokemons/lucario.gif',
    300,
    300,
  ),
  new Pokemon(
    levels.HARD,
    'solageo',
    './images/pokemons/solageo.gif',
    300,
    300,
  ),
];
let initialLives = 0;
let lives = 0;
let currentPokemonImage;
let currentPokemon;
let currentLevel;

// Elements
const numberSubmitButton = document.getElementById('number-submit-button');

// ********************************
// ********* User actions *********
// ********************************

const contentElements = document.getElementsByClassName('menuBox-content');
const menuBoxButton = document.getElementById('menuBoxButton');
let currentMenuBoxElementNumber = 1;
contentElements[0].style.display = 'flex';

function menuBoxBtnClicked() {
  if (currentMenuBoxElementNumber < contentElements.length) {
    if (currentMenuBoxElementNumber != 0) {
      contentElements[currentMenuBoxElementNumber - 1].style.display = null;
    }
    const currentMenuBoxElement = contentElements[currentMenuBoxElementNumber];
    currentMenuBoxElement.style.display = 'flex';
    if (currentMenuBoxElement.id === 'levels') {
      menuBoxButton.disabled = true;
    }
    currentMenuBoxElementNumber += 1;
  } else {
    const menuBox = document.getElementById('menuBox');
    const game = document.getElementById('game');
    game.style.display = 'block';
    menuBox.style.display = 'none';
    start();
  }
}

// When number is submitted by user
async function submit() {
  const number = document.getElementById('number').value;
  numberSubmitButton.disabled = true;
  if (number == '' || number < 1 || number > 100) {
    putMessage('Entrez un nombre entre 1 et 100!');
  } else {
    lives -= 1;
    if (number == validNumber) {
      await launchBall(currentPokemonImage, true);
      numberSubmitButton.disabled = false;
      putMessage('Bravo!');
      win(true);
    } else if (number > validNumber) {
      await launchBall(currentPokemonImage, false);
      numberSubmitButton.disabled = false;
      if (lives > 0) {
        putMessage('Plus bas! Réessayez!');
      } else {
        putMessage('Vous avez perdu!');
        win(false);
      }
    } else if (number < validNumber) {
      await launchBall(currentPokemonImage, false);
      numberSubmitButton.disabled = false;
      if (lives > 0) {
        putMessage('Plus haut! Réessayez!');
      } else {
        putMessage('Vous avez perdu!');
        win(false);
      }
    }
  }
}

function selectLevel(selectedLevel) {
  const easyCheckmark = document.getElementById('easy-checkmark');
  const normalCheckmark = document.getElementById('normal-checkmark');
  const hardCheckmark = document.getElementById('hard-checkmark');
  easyCheckmark.style.display = null;
  normalCheckmark.style.display = null;
  hardCheckmark.style.display = null;
  currentLevel = selectedLevel;
  switch (selectedLevel) {
    case levels.EASY:
      easyCheckmark.style.display = 'block';
      lives = 10;
      break;
    case levels.NORMAL:
      normalCheckmark.style.display = 'block';
      lives = 7;
      break;
    case levels.HARD:
      hardCheckmark.style.display = 'block';
      lives = 4;
      break;
    default:
      break;
  }
  initialLives = lives;
  menuBoxButton.disabled = false;
}

function restartGame() {
  window.location.reload();
}

// ************************************
// ********* Helper functions *********
// ************************************

// Start game
async function start() {
  setInterval(() => {
    reloadLives();
  }, 1);
  const pokemon = await getRandomPokemon(currentLevel);
  console.log(pokemon);
  currentPokemonImage = spawnPokemon(pokemon);
  currentPokemon = pokemon;
  console.log(`Valid number: ${validNumber}`);
}

function putMessage(message) {
  const messageBox = document.getElementById('message');
  messageBox.textContent = message;
}

// Get random pokemon
async function getRandomPokemon(inputLevel) {
  return new Promise((resolve, reject) => {
    if (Object.values(levels).includes(inputLevel)) {
      const selectPokemons = new Promise((resolve, reject) => {
        let selectedPokemons = [];
        pokemonsList.forEach((pokemon, index) => {
          if (pokemon.level === inputLevel) {
            selectedPokemons.push(pokemon);
          }
          index === pokemonsList.length - 1 && resolve(selectedPokemons);
        });
      });
      selectPokemons.then((selectedPokemons) => {
        resolve(
          selectedPokemons[Math.floor(Math.random() * selectedPokemons.length)],
        );
      });
    } else {
      throw new Error('Level is not valid');
    }
  });
}

// Launch ball
function launchBall(pokemonImage, capture) {
  return new Promise((resolve, reject) => {
    const pokeball = document.getElementById('pokeball');
    let leftPos = 0;
    let speed = 5;
    var moveInterval = setInterval(() => {
      leftPos += speed;
      pokeball.style.left = leftPos + 'px';
      if (leftPos >= pokemonImage.offsetLeft) {
        clearInterval(moveInterval);
        pokemonImage.style.display = 'none';
        setTimeout(() => {
          pokeball.style.bottom = '140px';
        }, 100);
        pokeball.style.animation = 'wiggle 1s linear';
        if (capture) {
          // Capture pokemon
          pokeball.style.animationIterationCount = '3';
          const tryingToGetOutAudio = new Audio('sounds/trying-to-get-out.mp3');
          tryingToGetOutAudio.play();
          setTimeout(() => {
            tryingToGetOutAudio.pause();
            tryingToGetOutAudio.currentTime = 0;
            const caughtAudio = new Audio('sounds/caught.mp3');
            caughtAudio.play();
            resolve();
          }, 4000);
        } else {
          // Does not capture pokemon
          pokeball.style.animationIterationCount = '1';
          const tryingToGetOutAudio = new Audio('sounds/trying-to-get-out.mp3');
          tryingToGetOutAudio.play();
          setTimeout(() => {
            pokemonImage.style.display = null;
            pokeball.style.animation = null;
            pokeball.style.left = null;
            pokeball.style.bottom = null;
            tryingToGetOutAudio.pause();
            tryingToGetOutAudio.currentTime = 0;
            resolve();
          }, 2000);
        }
      }
    }, 1);
  });
}

// Spawn pokemon
function spawnPokemon(pokemon) {
  const pokemonImage = document.getElementById('pokemon');
  pokemonImage.style.backgroundImage = `url(${pokemon.imagePath})`;
  pokemonImage.style.height = pokemon.height + 'px';
  pokemonImage.style.width = pokemon.width + 'px';
  return pokemonImage;
}

// Reload lives
function reloadLives() {
  const livebar = document.getElementById('livebar');
  const liveHTML = '<div class="live"></div>';
  if (lives >= 0) {
    livebar.innerHTML = liveHTML.repeat(lives);
    console.log(`Lives left: ${lives}`);
  }
}

// Win
async function win(hasWon) {
  const endScreen = document.getElementById('end');
  const endStatus = document.getElementById('end-status');
  const correctNumber = document.getElementById('correctNumber');
  const usedLives = document.getElementById('usedLives');
  const levelName = document.getElementById('levelName');
  const bestscore1 = document.getElementById('bestscore1');
  const bestscore2 = document.getElementById('bestscore2');
  const bestscore3 = document.getElementById('bestscore3');
  numberSubmitButton.disabled = true;
  endScreen.style.display = 'flex';
  correctNumber.textContent = validNumber;
  usedLives.textContent = initialLives - lives;

  switch (currentLevel) {
    case levels.EASY:
      levelName.textContent = 'facile';
      break;
    case levels.NORMAL:
      levelName.textContent = 'normal';
      break;
    case levels.HARD:
      levelName.textContent = 'difficile';
      break;
    default:
      break;
  }
  let bestscores;

  // bestscores = [10, 3, 7];
  // localStorage[currentLevel] = JSON.stringify(bestscores);

  // Read local data
  const storedBestScores = localStorage[currentLevel];
  if (storedBestScores) bestscores = JSON.parse(storedBestScores);
  bestscores.sort();
  if (initialLives - lives < bestscores[2]) {
    bestscores[2] = initialLives - lives;
    bestscores.sort();
    localStorage[currentLevel] = JSON.stringify(bestscores);
    console.log(localStorage[currentLevel]);
  }
  // const newBestScoreIndex = await isNewBestScore;
  // console.log(newBestScoreIndex);
  // if (
  //   newBestScoreIndex === 0 ||
  //   newBestScoreIndex === 1 ||
  //   newBestScoreIndex === 2
  // ) {
  //   // Write local data
  //   bestscores[newBestScoreIndex] = initialLives - lives;
  //   localStorage[currentLevel] = JSON.stringify(bestscores);
  //   console.log(localStorage[currentLevel]);
  //   bestscores.sort();
  //   console.log('New best score');
  // }

  // if (await newBestScoreIndex) {
  //   // Write local data
  //   bestscores[newBestScoreIndex] = usedLives;
  //   localStorage[currentLevel] = JSON.stringify(bestscores);
  //   console.log(localStorage[currentLevel]);
  //   console.log('New best score');
  // }

  bestscore1.textContent = bestscores[0] ?? '-';
  bestscore2.textContent = bestscores[1] ?? '-';
  bestscore3.textContent = bestscores[2] ?? '-';

  if (hasWon) {
    endStatus.textContent = '🏆 Victoire! 🏆';
  } else {
    endStatus.textContent = '☹️ Défaite! ☹️';
  }
}
