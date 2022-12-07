
var buttonColors = ["red", "blue", "green", "yellow"];

gamePattern = [];
userClickedPattern = [];

var gameStarted = false;
var level = 0;

// Listen for key press, start a sequence when it happens
$(document).keypress(function(){
    if (!gameStarted){

        $("#level-title").text("Level " + level);
        nextSequence();
        gameStarted = true;
    }
});

// Get the user actions
$(".btn").click(function() {
    
    var userChosenColor = this.id;
    userClickedPattern.push(userChosenColor);

    makeSound(userChosenColor);
    animatePress(userChosenColor);
    
    checkAnswer(userClickedPattern.length-1);
})



function checkAnswer(currentguess){
    console.log(currentguess);
    console.log(gamePattern);
    console.log(userClickedPattern);
    console.log(gamePattern[currentguess]);
    console.log(userClickedPattern[currentguess]);

    if (userClickedPattern[currentguess] === gamePattern[currentguess]){
        console.log("im in check answer");
        if (userClickedPattern.length === gamePattern.length){
            setTimeout(function(){
                nextSequence();
            }, 1000);
        }
    } else {
        makeSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function(){
            $("body").removeClass("game-over");
        }, 200);
        console.log("hello");
        $("#level-title").text("Game Over, Press Any Key to Restart");
        startOver();
    }
}

function startOver(){
    gameStarted = false;
    level = 0;
    gamePattern = [];
}

function nextSequence(){

    userClickedPattern = []
    level ++;
    $("#level-title").text("Level " + level);

    // Select a random button
    var randomNumber = Math.round(Math.random() * 3);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);

    // flash the selected button + sound
    activeButton = $("#" + randomChosenColor);
    activeButton.fadeOut(100).fadeIn(100);
    makeSound(activeButton.attr("id"));

}

function makeSound(color){
    var sound = new Audio("sounds/" + color + ".mp3");
    sound.play();
}

function animatePress(color){
    var button = $("#" + color);
    button.addClass("pressed");
    setTimeout(function(){
        button.removeClass("pressed");
    }, 100)
}
