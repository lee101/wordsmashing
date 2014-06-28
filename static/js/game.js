gameon.loadSound('score', '/gameon/static/music/star.mp3');
gameon.loadSound('win', '/gameon/static/music/winning-level.mp3');
gameon.loadSound('moved', '/static/music/moved-letter.m4a');
gameon.loadSound('moving', '/static/music/moving-letter.m4a');

var wordsmashing = (function () {
    "use strict";
    $(document).ready(function () {
        $(document).on('click', '.ws-help-btn', function () {
            var $modal = $('#modal');
            $modal.find('.modal-body').html($('#instructions').html());
            $modal.modal('show');
        });
    });
})();
