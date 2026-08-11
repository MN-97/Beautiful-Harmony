/* =======================================================
   Beautiful Harmony
   Version 0.7.0
======================================================= */


/* =======================================================
   画面要素
======================================================= */

const titleScreen = document.getElementById("titleScreen");
const themeScreen = document.getElementById("themeScreen");
const colorsScreen = document.getElementById("colorsScreen");
const resultScreen = document.getElementById("resultScreen");

const playButton = document.getElementById("playButton");
const colorsButton = document.getElementById("colorsButton");
const backButton = document.getElementById("backButton");
const finishButton = document.getElementById("finishButton");

const board = document.getElementById("board");
const petals = document.getElementById("petals");


/* =======================================================
   花びら生成
======================================================= */

petals.innerHTML = "";

for(let i = 0; i < 18; i++){

    const petal = document.createElement("div");

    petal.className = "petal";

    petal.style.left =
        Math.random() * 100 + "vw";

    petal.style.top =
        -(Math.random() * 120) + "px";

    petal.style.opacity =
        0.25 + Math.random() * 0.45;

    petal.style.animationDelay =
        -(Math.random() * 20) + "s";

    petal.style.animationDuration =
        14 + Math.random() * 8 + "s";

    petal.style.setProperty(
        "--drift",
        (-70 + Math.random() * 140) + "px"
    );

    petals.appendChild(petal);

}


/* =======================================================
   タイルデータ
======================================================= */

const colors = [

    "pink","pink","pink","pink",

    "rose","rose","rose","rose",

    "blue","blue","blue","blue",

    "purple","purple","purple","purple",

    "green","green","green","green",

    "silver","silver","silver","silver","silver"

];


const symbols = [

    "♥","♥","♥","♥","♥","♥","♥",

    "♦","♦","♦","♦","♦","♦",

    "♠","♠","♠","♠","♠","♠",

    "♣","♣","♣","♣","♣","♣"

];


/* =======================================================
   シャッフル
======================================================= */

function shuffle(array){

    for(let i = array.length - 1; i > 0; i--){

        const j =
            Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
        [array[j], array[i]];

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

    if(
        e.pointerType === "mouse" &&
        e.button !== 0
    ){
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

    const dx =
        currentX - startX;

    const dy =
        currentY - startY;

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
       指についていた移動をリセット
    */

    tile.style.translate = "";


    /*
       他のタイルを取得
    */

    const tiles = [
        ...board.querySelectorAll(".tile")
    ].filter(t => t !== tile);


    let target = null;

    let shortest = Infinity;


    /*
       指を離した場所に
       一番近いタイルを探す
    */

    tiles.forEach(other => {

        const rect =
            other.getBoundingClientRect();

        const centerX =
            rect.left + rect.width / 2;

        const centerY =
            rect.top + rect.height / 2;

        const distance =
            Math.hypot(
                e.clientX - centerX,
                e.clientY - centerY
            );

        if(distance < shortest){

            shortest = distance;

            target = other;

        }

    });


    /*
       45px以内なら交換
    */

    if(
        target &&
        shortest < 45
    ){

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

        tile.releasePointerCapture(
            e.pointerId
        );

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
   盤面上の位置を取得
======================================================= */

function getGridPosition(tile){

    const STEP_X = 62;
    const STEP_Y = 50;
    const OFFSET = 31;

    const top =
        parseFloat(tile.style.top);

    const left =
        parseFloat(tile.style.left);


    /*
       何行目か
    */

    const row =
        Math.round(top / STEP_Y);


    /*
       奇数行は31px右にずれている
    */

    const rowOffset =
        (row % 2) * OFFSET;


    const col =
        Math.round(
            (left - rowOffset) / STEP_X
        );


    return {
        row,
        col
    };

}


/* =======================================================
   2つのタイル間の距離
======================================================= */

function getDistance(a, b){

    const dx =
        a.col - b.col;

    const dy =
        a.row - b.row;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


/* =======================================================
   近接ペナルティ
======================================================= */

function getProximityPenalty(a, b){

    const dx =
        Math.abs(a.col - b.col);

    const dy =
        Math.abs(a.row - b.row);


    /*
       隣接
       縦・横・斜め
    */

    if(
        Math.max(dx, dy) === 1
    ){

        return 5;

    }


    /*
       2マス以内
    */

    if(
        Math.max(dx, dy) === 2
    ){

        return 2;

    }


    return 0;

}


/* =======================================================
   グループの距離を採点
======================================================= */

function scoreGroup(tiles){

    /*
       タイルが2枚未満なら満点
    */

    if(tiles.length < 2){

        return 100;

    }


    const positions =
        tiles.map(tile =>
            getGridPosition(tile)
        );


    const distances = [];

    let penalty = 0;


    /*
       すべてのペアを比較
    */

    for(
        let i = 0;
        i < positions.length;
        i++
    ){

        for(
            let j = i + 1;
            j < positions.length;
            j++
        ){

            const a =
                positions[i];

            const b =
                positions[j];


            /*
               距離
            */

            distances.push(
                getDistance(a, b)
            );


            /*
               近接減点
            */

            penalty +=
                getProximityPenalty(a, b);

        }

    }


    /* --------------------------------
       距離の平均
    -------------------------------- */

    const mean =
        distances.reduce(
            (sum, value) =>
                sum + value,
            0
        ) / distances.length;


    /* --------------------------------
       距離の標準偏差
    -------------------------------- */

    const variance =
        distances.reduce(
            (sum, value) =>
                sum +
                Math.pow(
                    value - mean,
                    2
                ),
            0
        ) / distances.length;


    const standardDeviation =
        Math.sqrt(variance);


    /*
       偏差が小さいほど高得点。

       SD 0 → 100点
       SDが大きくなるほど減点
    */

    const deviationPenalty =
        standardDeviation * 25;


    /*
       最終点
    */

    const score =
        100 -
        deviationPenalty -
        penalty;


    return Math.max(
        0,
        Math.min(
            100,
            score
        )
    );

}


/* =======================================================
   Color Balance
======================================================= */

function calculateColorBalance(){

    const colorNames = [
        "pink",
        "rose",
        "blue",
        "purple",
        "green",
        "silver"
    ];


    const scores = [];


    colorNames.forEach(color => {

        const tiles = [
            ...board.querySelectorAll(
                ".tile." + color
            )
        ];

        scores.push(
            scoreGroup(tiles)
        );

    });


    return average(scores);

}


/* =======================================================
   Symbol Balance
======================================================= */

function calculateSymbolBalance(){

    const symbolNames = [
        "♥",
        "♦",
        "♠",
        "♣"
    ];


    const scores = [];


    symbolNames.forEach(symbol => {

        const tiles = [
            ...board.querySelectorAll(
                ".tile"
            )
        ].filter(tile => {

            const span =
                tile.querySelector(
                    ".symbol"
                );

            return (
                span &&
                span.textContent === symbol
            );

        });


        scores.push(
            scoreGroup(tiles)
        );

    });


    return average(scores);

}


/* =======================================================
   Tiara Spread
======================================================= */

function calculateTiaraSpread(){

    const tiaras = [
        ...board.querySelectorAll(
            ".tile"
        )
    ].filter(tile => {

        return tile.querySelector(
            ".crown"
        );

    });


    return scoreGroup(tiaras);

}


/* =======================================================
   平均
======================================================= */

function average(numbers){

    if(numbers.length === 0){

        return 100;

    }


    return (
        numbers.reduce(
            (sum, value) =>
                sum + value,
            0
        ) / numbers.length
    );

}


/* =======================================================
   Harmony
======================================================= */

function calculateHarmony(
    colorBalance,
    symbolBalance,
    tiaraSpread
){

    /*
       Color   35%
       Symbol  35%
       Tiara   30%
    */

    const harmony =
        colorBalance * 0.35 +
        symbolBalance * 0.35 +
        tiaraSpread * 0.30;


    return harmony;

}


/* =======================================================
   結果表示
======================================================= */

function showResults(){

    const colorBalance =
        calculateColorBalance();

    const symbolBalance =
        calculateSymbolBalance();

    const tiaraSpread =
        calculateTiaraSpread();


    const harmony =
        calculateHarmony(
            colorBalance,
            symbolBalance,
            tiaraSpread
        );


    /*
       小数点以下を四捨五入
    */

    const color =
        Math.round(colorBalance);

    const symbol =
        Math.round(symbolBalance);

    const tiara =
        Math.round(tiaraSpread);

    const total =
        Math.round(harmony);


    /*
       結果画面を作る
    */

    resultScreen.innerHTML = `

        <h2>Harmony</h2>

        <div class="scoreList">

            <div class="scoreItem">
                <span>Color Balance</span>
                <strong>${color}%</strong>
            </div>

            <div class="scoreItem">
                <span>Symbol Balance</span>
                <strong>${symbol}%</strong>
            </div>

            <div class="scoreItem">
                <span>Tiara Spread</span>
                <strong>${tiara}%</strong>
            </div>

        </div>

        <div class="harmonyResult">

            <p>Harmony</p>

            <h1>${total}%</h1>

        </div>

        <button id="retryButton">
            Themeへ戻る
        </button>

    `;


    /*
       Themeへ戻る
    */

    document
        .getElementById("retryButton")
        .onclick = () => {

            resultScreen.classList.add(
                "hidden"
            );

            themeScreen.classList.remove(
                "hidden"
            );

        };


    /*
       結果画面表示
    */

    colorsScreen.classList.add(
        "hidden"
    );

    resultScreen.classList.remove(
        "hidden"
    );

}


/* =======================================================
   盤面生成
======================================================= */

function createBoard(){

    board.innerHTML = "";


    const c = [...colors];
    const s = [...symbols];


    shuffle(c);
    shuffle(s);


    /*
       ティアラ5個
    */

    const tiaras = [];


    while(tiaras.length < 5){

        const n =
            Math.floor(
                Math.random() * 25
            );

        if(
            !tiaras.includes(n)
        ){

            tiaras.push(n);

        }

    }


    const STEP_X = 62;
    const STEP_Y = 50;
    const OFFSET = 31;


    for(
        let row = 0;
        row < 5;
        row++
    ){

        for(
            let col = 0;
            col < 5;
            col++
        ){

            const i =
                row * 5 + col;


            /*
               タイル
            */

            const tile =
                document.createElement(
                    "div"
                );


            tile.className =
                "tile " + c[i];


            /*
               マーク
            */

            const span =
                document.createElement(
                    "span"
                );

            span.className =
                "symbol";

            span.textContent =
                s[i];

            tile.appendChild(span);


            /*
               ティアラ
            */

            if(
                tiaras.includes(i)
            ){

                const crown =
                    document.createElement(
                        "div"
                    );

                crown.className =
                    "crown";

                crown.textContent =
                    "👑";

                tile.appendChild(crown);

            }


            /*
               初期位置
            */

            const x =
                col * STEP_X +
                (row % 2) * OFFSET;

            const y =
                row * STEP_Y;


            tile.style.left =
                x + "px";

            tile.style.top =
                y + "px";


            /*
               ドラッグ
            */

            enableDragging(tile);


            board.appendChild(tile);

        }

    }

}


/* =======================================================
   画面遷移
======================================================= */

playButton.onclick = () => {

    titleScreen.classList.add(
        "hidden"
    );

    themeScreen.classList.remove(
        "hidden"
    );

};


colorsButton.onclick = () => {

    themeScreen.classList.add(
        "hidden"
    );

    colorsScreen.classList.remove(
        "hidden"
    );

    createBoard();

};


backButton.onclick = () => {

    colorsScreen.classList.add(
        "hidden"
    );

    themeScreen.classList.remove(
        "hidden"
    );

};


/*
   ★ 満足ボタン
*/

finishButton.onclick = () => {

    showResults();

};
