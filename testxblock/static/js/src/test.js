$(document).ready(function () {

    var popcorn = Popcorn("#vid");

    popcorn.on('loadeddata', okToPlay);

    function okToPlay(){
        popcorn.off('loadeddata', okToPlay);

        popcorn.play();

        cueVideo(25);
    }

    function cueVideo(second) {

        popcorn.cue(second, function(){
            //popcorn.currentTime(20);               //aca cambio a cualquier otro second cuando pausa

            popcorn.pause();

            $("#can").on('click', function goAndClickTheCanvas(event) {
                $("#can").off('click', goAndClickTheCanvas);

                var rect = event.target.getBoundingClientRect();
                var mouseX = event.clientX - rect.left;
                var mouseY = event.clientY - rect.top;

                console.log("X: " + mouseX + ", Y: " + mouseY);

                popcorn.on('timeupdate', function updated(){
                    popcorn.off('timeupdate', updated);
                    popcorn.play();
                });

                popcorn.currentTime(1);                 //aca lo mando al second que quiero que vaya cuando clickea

            });
        });
    }
});