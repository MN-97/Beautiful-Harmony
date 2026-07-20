const titleScreen = document.getElementById("titleScreen");
const themeScreen = document.getElementById("themeScreen");
const colorsScreen = document.getElementById("colorsScreen");

const playButton = document.getElementById("playButton");
const colorsButton = document.getElementById("colorsButton");
const finishButton = document.getElementById("finishButton");

playButton.addEventListener("click", () => {

    titleScreen.classList.add("hidden");
    themeScreen.classList.remove("hidden");

});

colorsButton.addEventListener("click", () => {

    themeScreen.classList.add("hidden");
    colorsScreen.classList.remove("hidden");

});

finishButton.addEventListener("click", () => {

    alert("Harmony 92%\n\n※採点画面は次回実装します。");

});