const langButtons = document.querySelectorAll('.lang-button');
const textInput = document.querySelector('.text-input');
const translationText = document.querySelector('.translation-text');
const translationFlag = document.querySelector('.translation-flag');
const resetButton = document.querySelector('.reset-button');
const favoriteButton = document.querySelector('.favorites');
const randomButton = document.querySelector('.random-button');
const lang = 'it';
let originBackground = '';

//Creo una chiave per il local storage
const STORAGE_KEY = '__bool_todo__';

//Array per memorizzare le traduzioni preferite
let saveTranslations = [];

//Funzione per aggiornare la lista delle traduzioni preferite
function updateFavoriteList(translation) {
  const translateFavorite = document.querySelector('.translate-favorites');
  translateFavorite.innerHTML = '';
  translation.forEach(function(translateTexts) {
    const li = document.createElement('li');
    li.textContent = translateTexts;
    translateFavorite.appendChild(li);
  });
}

//funzione per caricare le traduzione preferite dal Local storage
function loadTranslationsFromLocalStorage() {
  const savedTranslationsJSON = localStorage.getItem(STORAGE_KEY);
  if (savedTranslationsJSON) {
    saveTranslation = JSON.parse(savedTranslationsJSON);
    updateFavoriteList(saveTranslation);
  }
}

//Funzione per salvare la traduzione preferita
function saveTranslation() {
  const translation = document.querySelector('.translation-text').innerText;
  //Verifico se il testo è "Traduzione"
  if (translation.trim() == "Traduzione") {
    //Esco dalla funzione
    return;
  }
  //Aggiungo la traduzione preferita all'array
  saveTranslations.push(translation);
  //Salvo l'array nel local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saveTranslations));
  //Aggiorno la lista delle traduzioni preferite visualizzate sulla pagina
  updateFavoriteList(saveTranslations);
}

//Funzione per gestire il click sull'icona e salvare le traduzioni preferite
favoriteButton.addEventListener('click', function() {
  saveTranslation();
});

//Funzione per inserire la bandiera come sfondo 
function changeBackground(lang) {
  const translation = document.querySelector('.translation');
  //rimuovo le classi relative alle bandiere
  translation.classList.remove("en-bg", "fr-bg", "es-bg");
  //aggiungo le classi relative alle bandiere
  translation.classList.add(lang + "-bg");
}

function reset(lang) {
  textInput.value = '';
  translationText.innerText = 'Traduzione';
  translationFlag.innerText = '';
  // Rimuovo lo sfondo
  const translation = document.querySelector('.translation');
  translation.style.backgroundImage = "none";

  changeBackground(lang);
}

//funzione per ripristinare lo sfondo originale
function restoreBackground() {
  const translation = document.querySelector('.translation');
  translation.style.backgroundImage = originBackground;
}

async function translate(text, lang, flag) {
  const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=it|${lang}`;
  const response = await fetch(url);
  const jsonData = await response.json();
  const result = jsonData.responseData.translatedText;
  console.log(result);

  translationText.innerText = result;
  translationFlag.innerText = flag;

  restoreBackground();
}

langButtons.forEach(function(langButton) {
  langButton.addEventListener('click', function() {

    // recupero il testo dal campo di input e rimuovo eventuali spazi extra
    // all'inizio e alla fine della stringa inserita con il metodo .trim()
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
    const text = textInput.value.trim();

    // recupero il codice lingua dal data-attribute del pulsante
    const lang = langButton.dataset.lang;
    // recupero la bandierina dalla testo del pulsante
    const flag = langButton.innerText;

    //recupero lo sfondo
    const backgroundLang = this.getAttribute("data-lange");
    changeBackground(lang);

    // se il campo di input ha effettvamente del testo
    // invoco la funzione e faccio partire la chiamata alle API
    if(text.length > 0) {
      translate(text, lang, flag);
    }
  });
});

//funzione per inserire frasi random
async function randomString() {
  const response = await fetch('https://random-word-api.herokuapp.com/word?lang=it');
  const work = await response.json();
  console.log(work);
  textInput.value = work;
}

randomButton.addEventListener('click', function() {
  randomString();
});


resetButton.addEventListener('click', reset);
