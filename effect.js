var turnLights = () => {
    $('body').addClass('violet');
    $('#bulb_container').children().fadeIn(3000);
    setTimeout(() => {
        $('#bulb1').addClass('bulb-yellow');
        $('#bulb2').addClass('bulb-red');
        $('#bulb3').addClass('bulb-green');
        $('#bulb4').addClass('bulb-blue');
        $('#bulb5').addClass('bulb-pink');
        $('#bulb6').addClass('bulb-orange');
    }, 1500);
}
var isPlayerEnable = false;
var playMusic = () => {
    if (isPlayerEnable) return;
    isPlayerEnable = true;
    var song = document.createElement('audio');
    song.setAttribute('src', './file/audio/song.mp3');
    $('body').append(song);
    song.loop = true;
    // song.play();
    $('body').addClass('violet-filcker');
    setTimeout(() => $('#bulb1').addClass('bulb-yellow-filcker'), 0);
    setTimeout(() => $('#bulb2').addClass('bulb-red-filcker'), 400);
    setTimeout(() => $('#bulb3').addClass('bulb-green-filcker'), 200);
    setTimeout(() => $('#bulb4').addClass('bulb-blue-filcker'), 600);
    setTimeout(() => $('#bulb5').addClass('bulb-pink-filcker'), 300);
    setTimeout(() => $('#bulb6').addClass('bulb-orange-filcker'), 100);
}
var letsDecorate = () => {
    $('#banner').show();
    $('#banner').addClass('banner-in');

}
var flyWithBallons = () => {
    $('#fizzytext > canvas').fadeIn('slow').css("display", "flex");
}
var cake = () => {

}
var candle = () => {

}
var storyStart = () => {

}

let listButton = [
    { id: '#turn_lights', function: turnLights, delay: 3000 },
    { id: '#play_music', function: playMusic, delay: 3000 },
    { id: '#lets_decorate', function: letsDecorate, delay: 3000 },
    { id: '#fly_with_ballons', function: flyWithBallons, delay: 3000 },
    { id: '#cake', function: cake, delay: 3000 },
    { id: '#candle', function: candle, delay: 3000 },
    { id: '#story_start', function: storyStart, delay: 3000 }
];
let setupBtn = (btn, index, arr) => {
    $(btn.id).click(function() {
        btn.function();
        $(btn.id).fadeOut('fast')
            .delay(btn.delay)
            .promise()
            .done(() => $(btn.id).next().fadeIn(3000));
    })
};

$(document).ready(function() {
    listButton.forEach(setupBtn);
});