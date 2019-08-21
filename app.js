var $canvas_container, $cards, $impose, $card_count;
var file_input;
var images = {};
var valid = false;
var cw = false, ch = false;
var cx = 10, cy = 7;
var width = false, height = false;
$(document).ready(function () {
    $canvas_container = $('#canvas_container');
    $cards = $('#cards');
    $impose = $('#impose');
    $card_count = $('#card_count');
    file_input = document.getElementById('upload');
});

function load() {
    var i = file_input.files.length;
    while (i > 0) {
        let file = file_input.files[i - 1];
        let reader = new FileReader();
        reader.addEventListener("load", function (e) {
            newCard(this, reader.result)
        }.bind(file), false);
        reader.readAsDataURL(file);
        i--;
    }
    file_input.value = '';
    $impose.attr('disabled', false);
}

function newCard(file, src) {
    var image = new Image();

    image.onload = function () {
        var uuid = UUID();
        this.file = file;
        this.count = 1;
        images[uuid] = this;
        generateCard(uuid);
        updateCardCount();
    };
    image.src = src;
}

function generateCard(uuid) {
    var image = images[uuid];
    $label = $('<div/>')
            .addClass('col-9')
            .text(image.file.name);


    $count = $('<input/>').attr({
        'type': 'number',
        'value': 1,
        'min': 1,
        'step': 1,
        'data-attr': 'count',
        'data-uuid': uuid,
        'class': 'form-control'
    }).change(updateCount);

    $countCol = $('<div/>').addClass('col-3').append($count);

    $src = $('<input/>').attr({
        'type': 'hidden',
        'value': image.src,
        'data-attr': 'src',
        'data-uuid': image.uuid
    });

    $cardBody = $('<div/>')
            .addClass('row')
            .append($label, $countCol, $src);
    $card = $('<div/>').addClass('form-group').append($cardBody).attr('id', uuid);
    $cards.prepend($card);
}

function updateCount() {
    var uuid = $(this).attr('data-uuid');
    images[uuid].count = parseInt(this.value);
    updateCardCount();
}

function updateCardCount() {
    var total = 0;
    for (var uuid in images) {
        total += images[uuid].count;
    }
    $card_count.text(total + ' cards');
}

function impose() {
    $canvas_container.html('');
    var canvas = addCanvas();
    var i = 0;
    for (var uuid in images) {
        var c = images[uuid].count;
        while (c > 0) {
            drawImage(canvas, images[uuid], i);
            c--;
            i++;
            if(i == (cx * cy)){
                i = 0;
                canvas = addCanvas();
            }
        }
    }
    return true;
}

function addCanvas(){
    width = height = false;
    var canvas = document.createElement('canvas');
    $canvas_container.append(canvas);
    return canvas;
}

function drawImage(canvas, image, i) {
    var ctx = canvas.getContext("2d");
    if (!width || !height) {
        canvas.width = width = image.width * cx;
        canvas.height = height = image.height * cy;
    }
    var ox = i % cx;
    var oy = Math.floor(i / cx);
    ctx.drawImage(image, (ox * image.width), (oy * image.height), image.width, image.height);
}

function UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function reset() {
    if(confirm('Remove all cards?')){
        $cards.html('');
        images = {};
        updateCardCount();
    };
}