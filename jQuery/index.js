/* Wait for the doc to be ready, not needed if the jQuery script is at the end of the body, just BEFORE this file

$(document).ready(function(){
    $("h1").css("color", "red");
})
 */

$("h1").addClass("big-title");

$(document).keypress(function(event){
    $(".big-title").text(event.key);
})  