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

    // 色・マークをコピーしてシャッフル
    const c=[...colors];
    const s=[...symbols];

    shuffle(c);
    shuffle(s);

    // ティアラ5枚
    const tiaras=[];

    while(tiaras.length<5){

        const n=Math.floor(Math.random()*29);

        if(!tiaras.includes(n)){

            tiaras.push(n);

        }

    }

    let tileIndex=0;

    for(let row=0; row<5; row++){

        // 1・3行目だけ7枚
        const cols=(row%2===0)?5:7;

        for(let col=0; col<cols; col++){

            const tile=document.createElement("div");

            // 色
            const color=c[Math.floor(Math.random()*c.length)];

            tile.className="tile "+color;

            // 5枚行は中央に寄せる
            if(cols===5){

                tile.style.marginLeft="30px";

            }

            // マーク
            const span=document.createElement("span");

            span.className="symbol";

            const symbol=s[Math.floor(Math.random()*s.length)];

            span.textContent=symbol;

            tile.appendChild(span);

            // ティアラ
            if(tiaras.includes(tileIndex)){

                const crown=document.createElement("div");

                crown.className="crown";

                crown.textContent="👑";

                tile.appendChild(crown);

            }

            board.appendChild(tile);

            tileIndex++;

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