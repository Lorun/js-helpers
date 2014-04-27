JS Helpers
==========

###Работа с DOM элементами
```
js.$('.el_class');
js.$('#el_id');
js.$('div');
```

###Создание элементов
```
js.$$('div', 'el_class');
js.$$('div', '#el_id');
```
###Навешивание событий
```
var element = js.$$('div', 'el_class');
js.on(element, 'click', function () {
	// Callback function
});
```
###Удаление элементов
```
var element = js.$$('div', 'el_class');
js.remove(element[0]);
```
###AJAX запросы
```
js.ajax('send.php', {
	data: 'page=Foo&name=Bar',
	type: 'GET',
	dataType: 'html',
	success: function (result) {
		console.log(result);
	}
});
```
###Динамическая загрузка скриптов js
```
js.loadScript('new_script.js', function () {
	// Действия после подключения и загрузки js файла
});
```

##Работа с Cookie
###Установка куки
```
var date = new Date( new Date().getTime() + 60*1000 );
cookie.set('name', 'value', { expires: date.toUTCString(), path: '/' });
```
###Получение куки с именем name
```
cookie.get('name');
```
###Удаление куки с именем name
```
cookie.delete('name');
```
