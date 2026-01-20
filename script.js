const languageSelectFrom = document.getElementById('languageFrom');
const languageSelectTo = document.getElementById('languageTo');
const textIn = document.querySelector('.textIn');
const fromText = document.querySelector('.from-text');
const toText = document.querySelector('.to-text');
const textInput = document.querySelector('.text-input');
const translateFlagFrom = document.querySelector('.flag-from');
const translateFlagTo = document.querySelector('.flag-to');
const translationTextFrom = document.querySelector('.text-from');
const translationsTextTo = document.querySelector('.text-to');
const resetButton = document.querySelector('.reset-button');
const favoriteButtonFrom = document.querySelector('.favorites-from');
const favoriteButtonTo = document.querySelector('.favorites-to');
const randomButton = document.querySelector('.random-button');
const swapButton = document.querySelector('.fa-arrow-right-arrow-left');
const removeSelectedButton = document.getElementById('remove-selected-button');
let originBackground = '';

//Creo una chiave per il local storage
const STORAGE_KEY = '__bool_todo__';

//Array per memorizzare le traduzioni preferite
let saveTranslations = [];

//Funzione per aggiornare la lista delle traduzioni preferite
function updateFavoriteList(translations) {
  const translateFavorite = document.querySelector('.translate-favorites');
  translateFavorite.innerHTML = '';
  translations.forEach(function(translateTexts) {
    const li = document.createElement('li');
    li.textContent = `${translateTexts.fromText} → ${translateTexts.toText}`;
    translateFavorite.appendChild(li);
  });
}

//Seleziono l'elemento UL delle traduzioni preferite
const translateFavorite = document.querySelector('.translate-favorites');
//evento selezionare le traduzioni preferite
translateFavorite.addEventListener('click', function(event) {
  if(event.target.tagName === 'LI') {
    event.target.classList.toggle('selected');
  }
});

//funzione per caricare le traduzione preferite dal Local storage
function loadTranslationsFromLocalStorage() {
  const savedTranslationsJSON = localStorage.getItem(STORAGE_KEY);
  if (savedTranslationsJSON) {
    saveTranslations = JSON.parse(savedTranslationsJSON);
    updateFavoriteList(saveTranslations);
  }
}

//Funzione per salvare la traduzione preferita
function saveTranslation(type) {
  const translateFrom = translationTextFrom.innerText;
  const translateTo = translationsTextTo.innerText;

  // Se non c'è traduzione, esci
  if (translateFrom.trim() === "Traduzione" || translateTo.trim() === "Traduzione") {
    return;
  }

  const fromLang = languageSelectFrom.value;
  const toLang = languageSelectTo.value;

  const favorite = {
    fromText: translateFrom,
    toText: translateTo,
    fromLang,
    toLang,
    type // "from" o "to" se vuoi distinguere
  };

  // Evita duplicati
  const exists = saveTranslations.some(item =>
    item.fromText === favorite.fromText &&
    item.toText === favorite.toText &&
    item.fromLang === favorite.fromLang &&
    item.toLang === favorite.toLang
  );

  if(exists) {
    translationTextFrom.value = 'Traduzione già salvata';
    return;
  }

  if (!exists) {
    saveTranslations.push(favorite);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveTranslations));
    updateFavoriteList(saveTranslations);
  }
}

favoriteButtonFrom.addEventListener('click', () => {
  saveTranslation("from");
});

favoriteButtonTo.addEventListener('click', () => {
  saveTranslation("to");
});


//Eseguo il caricamento delle traduzioni salvate quando la pagina viene caricata
window.addEventListener('load', function() {
  loadTranslationsFromLocalStorage();
});

//Funzione per cambiare lo sfondo delle bandiere
function changeBackground() {
  const fromLang = languageSelectFrom.value;
  const toLang = languageSelectTo.value;

  if (fromLang && countries[fromLang]) {
    translateFlagFrom.style.backgroundImage =
      `url(images/flags/${countries[fromLang].flag}.svg)`;
  }

  if (toLang && countries[toLang]) {
    translateFlagTo.style.backgroundImage =
      `url('images/flags/${countries[toLang].flag}.svg')`;
  }
}

languageSelectFrom.addEventListener('change', changeBackground);
languageSelectTo.addEventListener('change', changeBackground);


//Funzione per resettare i campi
function reset() {
  fromText.value = '';
  toText.value = '';
  languageSelectFrom.value = '';
  languageSelectTo.value = '';
  // Rimuovo lo sfondo
  translateFlagFrom.style.backgroundImage = "none";
  translateFlagTo.style.backgroundImage = "none";
  translationTextFrom.innerText = 'Traduzione';
  translationsTextTo.innerText = 'Traduzione';
}

//funzione per ripristinare lo sfondo originale
function restoreBackground() {
  const translation = document.querySelector('.translation');
  translation.style.backgroundImage = originBackground;
}

//Funzione per cambiare la traduzione
swapButton.addEventListener('click', function() {
  const currentText = languageSelectFrom.value;
  const currentTranslation = languageSelectTo.value;

  languageSelectFrom.value = currentTranslation;
  languageSelectTo.value = currentText;

  // Scambio il testo tra i due campi
  const tempText = fromText.value;
  fromText.value = toText.value;
  toText.value = tempText;

  //Scambio il testo delle traduzioni
  const tempTranslationText = translationTextFrom.innerText;
  translationTextFrom.innerText = translationsTextTo.innerText;
  translationsTextTo.innerText = tempTranslationText;

  //Aggiorno lo sfondo delle bandiere
  changeBackground();

  // Ripristino lo sfondo originale
  restoreBackground();
});

//Popolo le select con le lingue disponibili
function populateLanguages() {
  Object.entries(countries)
    .sort((a, b) => a[1].name.localeCompare(b[1].name, 'it'))
    .forEach(([code, data]) => {
      const optionFrom = document.createElement("option");
      optionFrom.value = code;
      optionFrom.textContent = data.name;

      const optionTo = optionFrom.cloneNode(true);
      //optionTo.textContent = data.name;
      languageSelectFrom.appendChild(optionFrom);
      languageSelectTo.appendChild(optionTo);
  });
}

populateLanguages();

function canTranslate() {
  return (
    fromText.value.trim() !== '' &&
    languageSelectFrom.value !== '' &&
    languageSelectTo.value !== ''
  );
}

//Funzione per tradurre il testo
async function translate() {
  if (!canTranslate()) return;
  const text = fromText.value.trim();
  if (!text) return;

  const translateFrom = languageSelectFrom.value;
  const translateTo = languageSelectTo.value;

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;

  const response = await fetch(url);
  const data = await response.json();

  toText.value = data.responseData.translatedText;

  translationTextFrom.innerText = fromText.value;
  translationsTextTo.innerText = data.responseData.translatedText;

  changeBackground();
}

fromText.addEventListener('keyup', translate);

languageSelectFrom.addEventListener('change', translate);
languageSelectTo.addEventListener('change', translate);


//funzione per inserire frasi random
async function randomString() {
  const fromLang = languageSelectFrom.value;

  // controllo lingua selezionata
  if (!fromLang) {
    toText.value = 'Seleziona prima la lingua di partenza';
    return;
  }

  let randomWord = '';

  //dizionario locale
  if (randomDictionary[fromLang]) {
    const words = randomDictionary[fromLang];
    randomWord = words[Math.floor(Math.random() * words.length)];
  }
  //fallback API (inglese)
  else {
    try {
      const response = await fetch('https://random-word-api.herokuapp.com/word');
      const [word] = await response.json();
      randomWord = word;
    } catch (error) {
      toText.value = 'Errore nel caricamento parola casuale';
      return;
    }
  }

  fromText.value = randomWord;

  // traduce subito
  translate();
}


randomButton.addEventListener('click', function() {
  randomString();
});


resetButton.addEventListener('click', reset);


//funzione per rimuovere le parole preferite
removeSelectedButton.addEventListener('click', function() {
  const selectedItems = document.querySelectorAll('.translate-favorites .selected');

  selectedItems.forEach(function(item) {
    const translationText = item.textContent;

    saveTranslations = saveTranslations.filter(function(translation) {
      // ricreo la stringa uguale a quella in lista
      const text = `${translation.fromText} → ${translation.toText}`;
      return text !== translationText;
    });

    item.remove();
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(saveTranslations));
  updateFavoriteList(saveTranslations);
});


