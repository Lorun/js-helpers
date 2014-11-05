//предзагрузчик изображений
$.preloadImages = function () {
    if (typeof arguments[arguments.length - 1] == 'function') {
        var callback = arguments[arguments.length - 1];
    } else {
        var callback = false;
    }
    if (typeof arguments[0] == 'object') {
        var images = arguments[0];
        var n = images.length;
    } else {
        var images = arguments;
        var n = images.length - 1;
    }
    var not_loaded = n;
    for (var i = 0; i < n; i++) {
        $(new Image()).load(function() {
            if (--not_loaded < 1 && typeof callback == 'function') {
                callback();
            }
        }).attr('src', images[i]);
    }
}

// Использоваине
$.preloadImages('image_1.jpg', 'image_2.jpg', function() {
  // Callback
  console.log('Изображения загружены');
});

// Или так
$.preloadImages(['image_1.jpg', 'image_2.jpg'], function() {
  // Callback
  console.log('Изображения загружены');
});
