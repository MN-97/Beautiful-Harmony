/* =======================================================
   Beautiful Harmony
   Version 0.5.0
======================================================= */

const titleScreen = document.getElementById("titleScreen");
const themeScreen = document.getElementById("themeScreen");
const colorsScreen = document.getElementById("colorsScreen");
const resultScreen = document.getElementById("resultScreen");

const playButton = document.getElementById("playButton");
const colorsButton = document.getElementById("colorsButton");
const backButton = document.getElementById("backButton");
const finishButton = document.getElementById("finishButton");
const retryButton = document.getElementById("retryButton");

const board = document.getElementById("board");
const petals = document.getElementById("petals");

/* -------------------------
   花びら生成
------------------------- */

petals.innerHTML = "";

for(let i = 0; i < 18; i++){

    const petal = document.createElement("div");

    petal.className = "petal";

    petal.style.left = Math.random()*100 + "vw";

    petal.style.top = -(Math.random()*120) + "px";

    petal.style.opacity =
        (0.25 + Math.random()*0.45);

    petal.style.animationDelay =
        -(Math.random()*20) + "s";

    petal.style.animationDuration =
        (14 + Math.random()*8) + "s";

    petal.style.setProperty(
        "--drift",
        (-70 + Math.random()*140) + "px"
    );

    petal.style.transform =
        "scale(" + (0.7 + Math.random()*0.8) + ")";

    petals.appendChild(petal);

}

/* -------------------------
   タイルデータ
------------------------- */

const colors=[

"pink","pink","pink","pink",

"rose","rose","rose","rose",

"blue","blue","blue","blue",

"purple","purple","purple","purple",

"green","green","green","green",

"silver","silver","silver","silver","silver"

];

const symbols=[

"♥","♥","♥","♥","♥","♥","♥",

"♦","♦","♦","♦","♦","♦",

"♠","♠","♠","♠","♠","♠",

"♣","♣","♣","♣","♣","♣"

];

/* -------------------------
   シャッフル
------------------------- */

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        const j=Math.floor(Math.random()*(i+1));

        [array[i],array[j]]=[array[j],array[i]];

    }

}

/* -------------------------
   盤面生成
------------------------- */

function createBoard(){

    board.innerHTML="";

    const c=[...colors];
    const s=[...symbols];

    shuffle(c);
    shuffle(s);

    for(let i=0;i<25;i++){

        const tile=document.createElement("div");

        tile.className="tile "+c[i];

        const span=document.createElement("span");

        span.textContent=s[i];

        tile.appendChild(span);

        board.appendChild(tile);

    }

}
/* -------------------------
   画面遷移
------------------------- */

playButton.onclick=()=>{

    titleScreen.classList.add("hidden");

    themeScreen.classList.remove("hidden");

};

colorsButton.onclick=()=>{

    themeScreen.classList.add("hidden");

    colorsScreen.classList.remove("hidden");

    createBoard();

};

backButton.onclick=()=>{

    colorsScreen.classList.add("hidden");

    themeScreen.classList.remove("hidden");

};

finishButton.onclick=()=>{

    colorsScreen.classList.add("hidden");

    resultScreen.classList.remove("hidden");

};

retryButton.onclick=()=>{

    resultScreen.classList.add("hidden");

    themeScreen.classList.remove("hidden");

};