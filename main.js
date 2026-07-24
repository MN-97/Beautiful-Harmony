/* ==========================================
   Beautiful Harmony
   Version 0.4.0
========================================== */

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
   花びら
------------------------- */

for(let i=0;i<5;i++){

    const petal=document.createElement("div");

    petal.className="petal";

    petal.style.left=Math.random()*100+"vw";

    petal.style.animationDelay=
        (Math.random()*18)+"s";

    petal.style.animationDuration=
        (16+Math.random()*8)+"s";

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

    const size = 58;
    const stepX = 58;
    const stepY = 46;
    const offset = 29;

    for(let row=0; row<5; row++){

        for(let col=0; col<5; col++){

            const i=row*5+col;

            const tile=document.createElement("div");

            tile.className="tile "+c[i];

            const span=document.createElement("span");

            span.textContent=s[i];

            tile.appendChild(span);

            const x = col*stepX + (row%2===0 ? offset : 0);
            const y = row*stepY;

            tile.style.left=x+"px";
            tile.style.top=y+"px";

            board.appendChild(tile);

        }

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