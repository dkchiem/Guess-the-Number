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
  new Pokemon(
    levels.NORMAL,
    'pikachu',
    './images/pokemons/pikachu.gif',
    200,
    200,
  ),
  new Pokemon(
    levels.HARD,
    'solageo',
    './images/pokemons/solageo.gif',
    300,
    300,
  ),
];

let lives = 0;
let currentPokemonImage;
let currentPokemon;
let currentLevel;

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
  if (number == '' || number < 1 || number > 100) {
    putMessage('Entrez un nombre entre 1 et 100!');
  } else {
    lives -= 1;
    if (number == validNumber) {
      await launchBall(currentPokemonImage, true);
      putMessage('Bravo!');
      win(true);
    } else if (number > validNumber) {
      await launchBall(currentPokemonImage, false);
      if (lives > 0) {
        putMessage('Plus bas! Réessayez!');
      } else {
        putMessage('GAME OVER');
        win(false);
      }
    } else if (number < validNumber) {
      await launchBall(currentPokemonImage, false);
      if (lives > 0) {
        putMessage('Plus haut! Réessayez!');
      } else {
        putMessage('GAME OVER');
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
function win(hasWon) {
  const endScreen = document.getElementById('end');
  const numberSubmitButton = document.getElementById('number-submit-button');
  numberSubmitButton.disabled = true;
  endScreen.style.display = 'flex';
  if (hasWon) {
    console.log('Won');
  } else {
    console.log('Has not won');
  }
}
