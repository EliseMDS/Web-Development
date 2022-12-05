var randomNumber1 = Math.floor(Math.random() * 6) + 1;
var randomNumber2 = Math.floor(Math.random() * 6) + 1;

var dice1 = "images/dice" + randomNumber1 + ".png";
var dice2 = "images/dice" + randomNumber2 + ".png";

document.querySelector(".img1").setAttribute("src", dice1);
document.querySelector(".img2").setAttribute("src", dice2);

if (randomNumber1 > randomNumber2){
    document.querySelector(".result").textContent = "🚩 Play 1 Wins!" ;
} else if (randomNumber2 > randomNumber1){
    document.querySelector(".result").textContent = "Play 2 Wins!🚩" ;
} else {
    document.querySelector(".result").textContent = "Draw!" ;
}