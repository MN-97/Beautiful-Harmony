/* =======================================================
   Beautiful Harmony
   Version 0.9.0
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
   花びら
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
   色
   7色 × 5マーク = 35種類
======================================================= */

const colorNames = [
    "pink",
    "rose",
    "blue",
    "purple",
    "green",
    "silver",
    "yellow"
];


/* =======================================================
   マーク
   ♥ ♦ ♠ ♣ ★
======================================================= */

const symbolNames = [

    "♥",
    "♦",
    "♠",
    "♣",
    "★"

];


/* =======================================================
   シャッフル
======================================================= */

function shuffle(array){

    for(
        let i = array.length - 1;
        i > 0;
        i--
    ){

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [array[i], array[j]] =
        [array[j], array[i]];

    }

}


/* =======================================================
   タイルデータ作成
======================================================= */

function createTileData(){

    /*
       7色 × 5マーク

       = 35種類

       すべての組み合わせを
       1枚ずつ作るので、
       完全に同じタイルは存在しない。
    */

    const combinations = [];


    colorNames.forEach(color => {

        symbolNames.forEach(symbol => {

            combinations.push({

                color: color,
                symbol: symbol

            });

        });

    });


    /*
       25種類すべてをシャッフル
    */

    shuffle(combinations);


    return combinations;

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


    draggedTile =
        e.currentTarget;


    startX = e.clientX;
    startY = e.clientY;

    currentX = startX;
    currentY = startY;


    draggedTile.setPointerCapture(
        e.pointerId
    );


    draggedTile.classList.add(
        "dragging"
    );


    e.preventDefault();

}


/* -------------------------
   ドラッグ中
------------------------- */

function pointerMove(e){

    if(!draggedTile){

        return;

    }


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

    if(!draggedTile){

        return;

    }


    const tile =
        draggedTile;


    tile.style.translate = "";


    const tiles = [

        ...board.querySelectorAll(".tile")

    ].filter(
        t => t !== tile
    );


    let target = null;

    let shortest = Infinity;


    tiles.forEach(other => {

        const rect =
            other.getBoundingClientRect();


        const centerX =
            rect.left +
            rect.width / 2;


        const centerY =
            rect.top +
            rect.height / 2;


        const distance =
            Math.hypot(

                e.clientX - centerX,

                e.clientY - centerY

            );


        if(
            distance < shortest
        ){

            shortest = distance;

            target = other;

        }

    });


    /*
       一番近いタイルと交換
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


    tile.classList.remove(
        "dragging"
    );


    try{

        tile.releasePointerCapture(
            e.pointerId
        );

    }catch(error){}


    draggedTile = null;


    e.preventDefault();

}


/* =======================================================
   ドラッグ登録
======================================================= */

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

    const STEP_X = 60;
    const STEP_Y = 50;
    const OFFSET = 31;


    const top =
        parseFloat(
            tile.style.top
        );


    const left =
        parseFloat(
            tile.style.left
        );


    const row =
        Math.round(
            top / STEP_Y
        );


    const rowOffset =
        (row % 2) * OFFSET;


    const col =
        Math.round(
            (left - rowOffset) /
            STEP_X
        );


    return {

        row: row,

        col: col

    };

}


/* =======================================================
   タイル間の距離
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
        Math.abs(
            a.col - b.col
        );


    const dy =
        Math.abs(
            a.row - b.row
        );


    /*
       隣接
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
   グループ採点
======================================================= */

function scoreGroup(tiles){

    if(
        tiles.length < 2
    ){

        return 100;

    }


    const positions =
        tiles.map(
            tile =>
                getGridPosition(tile)
        );


    const distances = [];

    let proximityPenalty = 0;


    /*
       全ペアを調べる
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


            const distance =
                getDistance(
                    a,
                    b
                );


            distances.push(
                distance
            );


            proximityPenalty +=
                getProximityPenalty(
                    a,
                    b
                );

        }

    }


    /* ===================================================
       近接スコア
    =================================================== */

    const maxPenalty =
        distances.length * 5;


    const proximityScore =
        100 -
        (
            proximityPenalty /
            maxPenalty
        ) * 100;


    /* ===================================================
       距離の偏差
    =================================================== */

    const mean =
        distances.reduce(
            (sum, value) =>
                sum + value,
            0
        ) / distances.length;


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
        Math.sqrt(
            variance
        );


    /*
       偏差による減点は弱め
    */

    const deviationScore =
        Math.max(
            0,
            100 -
            standardDeviation * 10
        );


    /* ===================================================
       総合

       近接 70%
       距離の均等さ 30%
    =================================================== */

    const score =
        proximityScore * 0.70 +
        deviationScore * 0.30;


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

                span.textContent ===
                symbol

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


    return scoreGroup(
        tiaras
    );

}


/* =======================================================
   平均
======================================================= */

function average(numbers){

    if(
        numbers.length === 0
    ){

        return 100;

    }


    return (

        numbers.reduce(
            (sum, value) =>
                sum + value,
            0
        ) /

        numbers.length

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
       色       40%
       マーク   40%
       ティアラ 20%
    */

    const harmony =

        colorBalance * 0.40 +

        symbolBalance * 0.40 +

        tiaraSpread * 0.20;


    return Math.max(

        0,

        Math.min(
            100,
            harmony
        )

    );

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


    const color =
        Math.round(
            colorBalance
        );


    const symbol =
        Math.round(
            symbolBalance
        );


    const tiara =
        Math.round(
            tiaraSpread
        );


    const total =
        Math.round(
            harmony
        );


    resultScreen.innerHTML = `

        <h2>Harmony</h2>

        <div class="scoreList">

            <div class="scoreItem">

                <span>
                    Color Balance
                </span>

                <strong>
                    ${color}%
                </strong>

            </div>


            <div class="scoreItem">

                <span>
                    Symbol Balance
                </span>

                <strong>
                    ${symbol}%
                </strong>

            </div>


            <div class="scoreItem">

                <span>
                    Tiara Spread
                </span>

                <strong>
                    ${tiara}%
                </strong>

            </div>

        </div>


        <div class="harmonyResult">

            <p>
                Harmony
            </p>

            <h1>
                ${total}%
            </h1>

        </div>


        <button id="retryButton">

            Themeへ戻る

        </button>

    `;


    document
        .getElementById(
            "retryButton"
        )
        .onclick = () => {

            resultScreen.classList.add(
                "hidden"
            );

            themeScreen.classList.remove(
                "hidden"
            );

        };


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


    /*
       25種類の組み合わせを作る
    */

    const tileData =
        createTileData();


    /*
       ティアラ5個
    */

    const tiaras = [];


    while(
        tiaras.length < 6
    ){

        const n =
            Math.floor(
                Math.random() * 35
            );


        if(
            !tiaras.includes(n)
        ){

            tiaras.push(n);

        }

    }


    const STEP_X = 60;
    const STEP_Y = 50;
    const OFFSET = 31;


    for(
    let row = 0;
    row < 7;
    row++
){

    for(
        let col = 0;
        col < 5;
        col++
    ){

            const i =
                row * 5 + col;


            const tile =
                document.createElement(
                    "div"
                );


            /*
               色
            */

            tile.className =
                "tile " +
                tileData[i].color;


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
                tileData[i].symbol;


            tile.appendChild(
                span
            );


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


                tile.appendChild(
                    crown
                );

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
               ドラッグ登録
            */

            enableDragging(
                tile
            );


            board.appendChild(
                tile
            );

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


finishButton.onclick = () => {

    showResults();

};