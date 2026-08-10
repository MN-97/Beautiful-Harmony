/* =======================================================
   Beautiful Harmony
   Version 0.6.1
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
        0.25 + Math.random()*0.45;

    petal.style.animationDelay =
        -(Math.random()*20) + "s";

    petal.style.animationDuration =
        14 + Math.random()*8 + "s";

    petal.style.setProperty(
        "--drift",
        (-70 + Math.random()*140) + "px"
    );

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


/* =======================================================
   ドラッグ
======================================================= */

let draggedTile = null;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;


/* -------------------------
   ドラッグ開始
------------------------- */

function pointerDown(e){

    if(e.pointerType === "mouse" && e.button !== 0){
        return;
    }

    draggedTile = e.currentTarget;

    startX = e.clientX;
    startY = e.clientY;

    currentX = startX;
    currentY = startY;

    draggedTile.setPointerCapture(e.pointerId);

    draggedTile.classList.add("dragging");

    e.preventDefault();

}


/* -------------------------
   ドラッグ中
------------------------- */

function pointerMove(e){

    if(!draggedTile) return;

    currentX = e.clientX;
    currentY = e.clientY;

    /*
       指が少し動いたら、
       タイルを実際に指についてこさせる
    */

    const dx = currentX - startX;
    const dy = currentY - startY;

    draggedTile.style.translate =
        dx + "px " + dy + "px";

    e.preventDefault();

}


/* -------------------------
   ドラッグ終了
------------------------- */

function pointerUp(e){

    if(!draggedTile) return;

    const tile = draggedTile;

    /*
       指についていた移動を一旦リセット
    */

    tile.style.translate = "";

    /*
       他のタイルを探す
    */

    const tiles = [
        ...board.querySelectorAll(".tile")
    ].filter(t => t !== tile);

    let target = null;

    let shortest = Infinity;

    tiles.forEach(other => {

        const rect = other.getBoundingClientRect();

        const centerX =
            rect.left + rect.width / 2;

        const centerY =
            rect.top + rect.height / 2;

        const distance = Math.hypot(
            e.clientX - centerX,
            e.clientY - centerY
        );

        if(distance < shortest){

            shortest = distance;

            target = other;

        }

    });


    /*
       タイルの上で離した場合だけ交換
    */

    if(target && shortest < 45){

        const tileLeft =
            tile.style.left;

        const tileTop =
            tile.style.top;

        tile.style.left =
            target.style.left;

        tile.style.top =
            target.style.top;

        target.style.left =
            tileLeft;

        target.style.top =
            tileTop;

    }


    tile.classList.remove("dragging");

    try{
        tile.releasePointerCapture(e.pointerId);
    }catch(error){}

    draggedTile = null;

    e.preventDefault();

}


/* -------------------------
   ドラッグ機能登録
------------------------- */

function enableDragging(tile){

    tile.addEventListener(
        "pointerdown",
        pointerDown
    );

    tile.addEventListener(
        "pointermove",
        pointerMove
    );

    tile.addEventListener(
        "pointerup",
        pointerUp
    );

    tile.addEventListener(
        "pointercancel",
        pointerUp
    );

}


/* =======================================================
   盤面生成
======================================================= */

function createBoard(){

    board.innerHTML="";

    const c=[...colors];
    const s=[...symbols];

    shuffle(c);
    shuffle(s);

    const tiaras=[];

    while(tiaras.length<5){

        const n=Math.floor(Math.random()*25);

        if(!tiaras.includes(n)){

            tiaras.push(n);

        }

    }


    const STEP_X=62;
    const STEP_Y=50;
    const OFFSET=31;


    for(let row=0;row<5;row++){

        for(let col=0;col<5;col++){

            const i=row*5+col;

            const tile=document.createElement("div");

            tile.className =
                "tile " + c[i];


            const span =
                document.createElement("span");

            span.className="symbol";

            span.textContent=s[i];

            tile.appendChild(span);


            /*
               ティアラ
            */

            if(tiaras.includes(i)){

                const crown =
                    document.createElement("div");

                crown.className="crown";

                crown.textContent="👑";

                tile.appendChild(crown);

            }


            /*
               初期位置
            */

            const x =
                col*STEP_X +
                (row%2)*OFFSET;

            const y =
                row*STEP_Y;

            tile.style.left =
                x+"px";

            tile.style.top =
                y+"px";


            /*
               ドラッグ登録
            */

            enableDragging(tile);


            board.appendChild(tile);

        }

    }

}


/* =======================================================
   画面遷移
======================================================= */

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