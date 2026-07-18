const playButton = document.getElementById("playButton");

const themeMenu = document.getElementById("themeMenu");

playButton.addEventListener("click",function(){

    playButton.style.display="none";

    themeMenu.classList.remove("hidden");

});
