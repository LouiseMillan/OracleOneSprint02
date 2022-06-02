'use strict';

var HangmanGame;

(() => {
    let dictionary;
    let dictionaryKeys;
    let initialized = false;

    let messagesContainer;

    let mainScreen;
    
    let wordScreen;
    let inputWord;
    
    let gameScreen;
    let wordContainer;
    let hiddenInput;
    let errorContainer;
    let btnLose;

    let gallowContainer;

    let gameStatus;

    let gameData = {
        started: false,
        wordGame: null,
        errorChars: [],
        addedChars: 0
    }

    function hiddenMobileSupport(){
        hiddenInput.blur();
    }

    function enableMobileSupport(){
        if(thereIsSpaceInErrors() && gameData.started){
            wordContainer.appendChild(hiddenInput);
            hiddenInput.select();
        }else{
            hiddenInput.blur();
        }
    }

    function createMobileInterface() {
        hiddenInput = document.createElement("input");
        hiddenInput.setAttribute("type", "text");
        hiddenInput.setAttribute("maxlength", "1");
        hiddenInput.style.cssText = "width:1px; height:1px; border:none; background:none;";
        hiddenInput.addEventListener("input", function(e) {
            e.preventDefault();
            if(gameData.started){
                addWordCharOrError(hiddenInput.value);
                hiddenInput.value = "";
            }
        });
    }

    function deleteResult(){
        gameStatus.classList.remove("lose", "win");
    }
    function drawResult(win){
        deleteResult();
        if(win){
            gameStatus.classList.add("win");
        }else{
            gameStatus.classList.add("lose");
        }
        hiddenMobileSupport()
    }

    function drawGallow(win){
        if(win == true){ // Gano
            gallowContainer.classList.remove("start", "error01", "error02", "error03", "error04", "error05", "error06");
            gallowContainer.classList.add("win");
        }else if(win == false){ // Perdio
            gallowContainer.classList.remove("start", "win", "error01", "error02", "error03", "error04", "error05", "error06");
            gallowContainer.classList.add("error06");
        }else if(gameData.errorChars.length == 0){ // Inicial
            gallowContainer.classList.remove("win", "error01", "error02", "error03", "error04", "error05", "error06");
            gallowContainer.classList.add("start");
        }else if(gameData.errorChars.length > 0){ // Error
            gallowContainer.classList.remove("start", "win", "error01", "error02", "error03", "error04", "error05", "error06");
            gallowContainer.classList.add("error0" + gameData.errorChars.length);
        }
    }

    function addCustomWordToDictionary(string){
        if(dictionary._ == undefined){
            dictionary._ = [];
        }
        if(!dictionary._.includes(string)){
            dictionary._.push(string);
            updateValidDictionaryKeys();
        }
    }
    function isValidChar(string){
        return !/[^a-zA-ZñÑ]+/g.test(string);
    }
    function removeInvalidChars(string){
        if(typeof(string) != "string"){
            return "";
        }
        return string.replace(/[^a-zA-ZñÑ]+/g, "");
    }
    function removeSpaces(string){
        if(typeof(string) != "string"){
            return "";
        }
        return string.replace(/\s/g, "");
    }
    function removeAccents(string){
        if(typeof(string) != "string"){
            return "";
        }
        return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function updateLoseButton(){
        if(gameData.started){
            btnLose.innerText = "Desistir";
        }else{
            btnLose.innerText = "Agregar nueva palabra";
        }
    }
    function thereIsSpaceInErrors(){
        //gameData.errorChars.length >= 6
        return gameData.errorChars.length < 6;
    }

    function checkGameStatus(){
        if(!thereIsSpaceInErrors()){
            gameData.started = false;
            updateLoseButton();
            addErrorCharsInWord();
            drawGallow(false);
            drawResult(false);
            //console.log("PErdio (TT)");
        }else if(gameData.addedChars == gameData.wordGame[0].length){
            gameData.started = false;
            updateLoseButton();
            drawGallow(true);
            drawResult(true);
            //console.log("Gano");
        }else{
            drawGallow();
        }
    }
    function createChar(strChar){
        let char = document.createElement("div");
        char.classList.add("char");
        if(typeof(strChar) == "string"){
            char.innerText = strChar;
        }
        return char;
    }

    function addErrorCharsInWord(){
        let chars = wordContainer.childNodes;
        for(let i = 0 ; i < gameData.wordGame[0].length ; i++){
            if(chars[i].innerText == ""){
                chars[i].innerText = gameData.wordGame[0][i];
                chars[i].classList.add("error");
            }
        }
    }
    function addWordCharOrError(strChar){
        strChar = removeInvalidChars(strChar).toUpperCase();
        if(typeof(strChar) == "string" && strChar.length == 1){
            let ok = false;
            let chars = wordContainer.childNodes;
            for(let i = 0 ; i < gameData.wordGame[1].length ; i++){
                //Encontro letra
                if(gameData.wordGame[1][i] == strChar){
                    ok = true;
                    if(chars[i].innerText != gameData.wordGame[0][i]){
                        chars[i].innerText = gameData.wordGame[0][i];
                        gameData.addedChars++;
                    }
                }
            }
            //Error
            if(!ok){
                addErrorChar(strChar);
            }
            checkGameStatus();
        }
    }
    function createAndAddGameWordSpaces(){
        let size = gameData.wordGame[0].length;
        for(let i=0 ; i < size ; i++){
            wordContainer.appendChild(createChar());
        }
    }
    function addErrorChar(strChar){
        strChar = removeInvalidChars(strChar).toUpperCase();
        if(strChar.length == 1 && !gameData.errorChars.includes(strChar)){
            gameData.errorChars.push(strChar);
            errorContainer.appendChild(createChar(strChar));
        }
    }
    function removeAllGameChars(){
        let chars = wordContainer.childNodes;
        for(let i = chars.length - 1 ; i >= 0  ; i--){
            wordContainer.removeChild(chars[i]);
        }
    }
    function removeAllErrorChars(){
        let chars = errorContainer.childNodes;
        for(let i = chars.length - 1 ; i >= 0  ; i--){
            errorContainer.removeChild(chars[i]);
        }
    }
    function resetGameData(wordGame){
        removeAllErrorChars();
        removeAllGameChars();
        gameData.wordGame = wordGame;
        gameData.errorChars = [];
        createAndAddGameWordSpaces();
        gameData.started = true;
        gameData.addedChars = 0;
        updateLoseButton();
        drawGallow();
        deleteResult();
    }
    function finishGame(){
        gameData.started = false;
        gameData.addedChars = 0;
        addErrorCharsInWord();
        updateLoseButton();
        drawGallow(false);
        drawResult(false);
    }

    function getTimeShow(str){
        let ppm = 200;
        return (str.split(" ").length * 60000 / ppm) + 1000;
    }
    function hideMessage(popup, btnClose){
        btnClose.disabled = true;
        popup.classList.remove("show");
        setTimeout(() => {messagesContainer.removeChild(popup)}, 400);
    }
    function sendMessage(message, error){
        let popup = document.createElement("div");
        popup.classList.add("popup");
        if(error == true){
            popup.classList.add("error");
        }
        let msg = document.createElement("div");
        msg.classList.add("message");
        msg.innerText = message;

        let button = document.createElement("button");
        button.classList.add("close");
        button.innerText = "x";

        popup.appendChild(msg);
        popup.appendChild(button);

        messagesContainer.appendChild(popup);

        setTimeout(() => {
            popup.classList.add("show");
        }, 300);
        let myViewTimeout = setTimeout(() => {
            hideMessage(popup, button);
        }, getTimeShow(message));
        button.addEventListener("click", (e) => {
            clearTimeout(myViewTimeout);
            hideMessage(popup, button);
        });
    }

    function getGameWord(word){
        if(typeof(word) == "string"){
            word = removeSpaces(word).toUpperCase();
            if(word.length > 0){
                let word_2 = removeAccents(word);
                let indexes = [];
                for(let i=0 ; i < word_2.length ; i++){
                    if(isValidChar(word_2[i])){
                        indexes.push(i);
                    }
                }
                if(indexes.length > 0){
                    let data = ["", ""];
                    for(let i=0 ; i < indexes.length ; i++){
                        data[0] += word[indexes[i]];
                        data[1] += word[indexes[i]] == "Ñ" ? "Ñ" : word_2[indexes[i]];
                    }
                    return data;
                }
            }
        }
        return null;
    }
    function updateInputWithValidDataAndGetGameWord(){
        let gameWord = getGameWord(inputWord.value);
        inputWord.value = gameWord != null ? gameWord[0] : "";
        return gameWord;
    }
    function updateValidDictionaryKeys(){
        dictionaryKeys = [];
        Object.keys(dictionary).forEach(key => {
            if(dictionary[key].length > 0){
                dictionaryKeys.push(key);
            }
        });
    }
    function initComplete(json){
        dictionary = json;
        updateValidDictionaryKeys();
        inputWord.addEventListener("change", (e) => {
            updateInputWithValidDataAndGetGameWord();
        });
        document.addEventListener("keypress", (e) => {
            if(gameData.started){
                addWordCharOrError(e.key);
            }
        });
        drawGallow();
        deleteResult();
        createMobileInterface();
        initialized = true;
    }

    function getRandomWord(counter){
        if(isNaN(counter)){
            counter = 0;
        }
        if(dictionaryKeys.length > 0 && counter < 5){
            let indexKey = Math.floor(Math.random()*dictionaryKeys.length);
            let indexWord = Math.floor(Math.random()*dictionary[dictionaryKeys[indexKey]].length);
            let word = dictionary[dictionaryKeys[indexKey]][indexWord];
            if(typeof(word) != "string"){
                return getRandomWord(++counter);
            }
            let gameWord = getGameWord(word);
            if(gameWord == null){
                return getRandomWord(++counter);
            }
            return gameWord;
        }
        return null;
    }

    function startGame(){
        if(initialized){
            let gameWord = getRandomWord()
            if(gameWord == null){
                sendMessage("No se pudo cargar una palabra aleatoria, intente otra vez o agregue una nueva palabra.", true);
            }else{
                resetGameData(gameWord);
                mainScreen.classList.add("hidden");
                wordScreen.classList.add("hidden");
                gameScreen.classList.remove("hidden");
            }
        }
    }
    function savePlay(){
        if(initialized){
            let gameWord = updateInputWithValidDataAndGetGameWord();
            if(gameWord == null){
                sendMessage("Inserte una palabra para poder jugar.", true);
            }else{
                addCustomWordToDictionary(gameWord[0]); 
                resetGameData(gameWord);
                mainScreen.classList.add("hidden");
                wordScreen.classList.add("hidden");
                gameScreen.classList.remove("hidden");
            }
            inputWord.value = "";
        }
    }
    function replay(){
        if(initialized){
            let gameWord = getRandomWord()
            if(gameWord == null){
                sendMessage("No se pudo cargar una palabra aleatoria, intente otra vez o agregue una nueva palabra.", true);
            }else{
                resetGameData(gameWord);
            }
            
        }
    }
    
    function addWord(){
        if(initialized){
            mainScreen.classList.add("hidden");
            wordScreen.classList.remove("hidden");
            gameScreen.classList.add("hidden");
        }
    }
    function cancelAddWord(){
        if(initialized){
            inputWord.value = "";
            mainScreen.classList.remove("hidden");
            wordScreen.classList.add("hidden");
            gameScreen.classList.add("hidden");
        }
    }
    function youLose(){
        if(initialized){
            if(gameData.started){
                finishGame();
                //console.log("Perdedor");
            }else{
                mainScreen.classList.add("hidden");
                wordScreen.classList.remove("hidden");
                gameScreen.classList.add("hidden");
            }
        }
    }

    function getHTMLElement(strID){
        if(typeof(strID) == "string")
            return document.getElementById(strID);
        return null;
    }

    function init(idMessagesContainer, idMainScreen, idWordScreen, idInputWord, idGameScreen, idWordContainer, idErrorContainer, idBtnLose, idGallowContainer, idGameStatus){
        if((messagesContainer = getHTMLElement(idMessagesContainer)) != null){
            if((mainScreen = getHTMLElement(idMainScreen)) != null){
                if((wordScreen = getHTMLElement(idWordScreen)) != null){
                    if((inputWord = getHTMLElement(idInputWord)) != null){
                        if((gameScreen = getHTMLElement(idGameScreen)) != null){
                            if((wordContainer = getHTMLElement(idWordContainer)) != null){
                                if((errorContainer = getHTMLElement(idErrorContainer)) != null){
                                    if((btnLose = getHTMLElement(idBtnLose)) != null){
                                        if((gallowContainer = getHTMLElement(idGallowContainer)) != null){
                                            if((gameStatus = getHTMLElement(idGameStatus)) != null){
                                                fetch("resources/json/dictionary.json").then( response => {
                                                    let contentType = response.headers.get("content-type");
                                                    if(contentType && contentType.indexOf("application/json") !== -1) {
                                                        return response.json().then(json => {
                                                            initComplete(json);
                                                        });
                                                    }else{
                                                        initComplete({});
                                                        console.log("Oops, we haven't got JSON!");
                                                    }
                                                });
                                            }else console.log("7.1. ");
                                        }else console.log("6.1. ");
                                    }else console.log("5.1. ");
                                }else console.log("4.3. ");
                            }else console.log("4.2. ");
                        }else console.log("4.1. ");
                    }else console.log("3.2. ");
                }else console.log("3.1. ");
            }else console.log("2.1. ");
        }else console.log("1.1. ");
    }
    HangmanGame = {
        init: init,
        startGame: startGame,
        addWord: addWord,
        savePlay: savePlay,
        cancelAddWord: cancelAddWord,
        replay: replay,
        youLose: youLose,
        enableMobileSupport: enableMobileSupport
    };
})();
