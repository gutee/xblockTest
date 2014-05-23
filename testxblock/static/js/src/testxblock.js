/* Javascript for TestXBlock. */
function TestXBlock(runtime, element) {

    var correctAnswers = 0;
    var wrongAnswers = 0;

    function addWrong(data) {
        wrongAnswers++;
    }

    function addCorrect(data){
        correctAnswers++;
    }

    
    var correctURL = runtime.handlerUrl(element, 'increment_correct');

    function wrongAnswer(){
        var wrongURL = runtime.handlerUrl(element, 'increment_wrong');

        $.ajax({
            type: "POST",
            url: wrongURL,
            data: JSON.stringify({"wrongAnswers": wrongAnswers}),
            success: addWrong
        });
    });

    function correctAnswer(){
        var correctURL = runtime.handlerUrl(element, 'increment_correct');

        $.ajax({
            type: "POST",
            url: correctURL,
            data: JSON.stringify({"correctAnswers": correctAnswers}),
            success: addCorrect
        });
    });

    function videoFinished(){
        var finishedURL = runtime.handlerUrl(element, 'video_finished');

        $.ajax({
            type: "POST",
            url: finishedURL,
            success: videoFinishedSuccess
        });
    });

    function videoFinishedSuccess(){
        //if you want to do something after grading
    }


    $(function ($) {
        var popcorn = Popcorn.youtube("#vid", "https://www.youtube.com/watch?v=vTNUq0Y17IA");

        popcorn.on('loadeddata', okToPlay);

        function okToPlay() {
            popcorn.off('loadeddata', okToPlay);

            popcorn.play();

            cueVideo(15);
        }

        function cueVideo(second) {

            popcorn.cue(second, function () {

                popcorn.pause();

                $("#can").on('click', function goAndClickTheCanvas(event) {
                    $("#can").off('click', goAndClickTheCanvas);

                    var rect = event.target.getBoundingClientRect();
                    var mouseX = event.clientX - rect.left;
                    var mouseY = event.clientY - rect.top;

                    popcorn.on('timeupdate', function updated() {
                        popcorn.off('timeupdate', updated);
                        popcorn.play();
                    });

                    if(mouseX < $("#can").width/2){
                        correctAnswer();
                        popcorn.currentTime(1);
                    } else {
                        wrongAnswer();
                        popcorn.currentTime(10);
                    }

                    console.log("X: " + mouseX + ", Y: " + mouseY);
                });
            });
        }
    });
}