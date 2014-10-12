var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var say = require('say');
var fs = require('fs');
var names = [];
var nextPerson = 'No One';
var classLoaded = false;
var classNames = [];

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile('index.html');
});

app.get('/admin', function(req, res) {
	res.sendFile('admin.html', {root: __dirname + '/public'});
});

io.on('connection', function(socket){
	for (n in names){
		socket.emit('add name', names[n]);
	}
	socket.emit('now serving name', nextPerson);

	socket.on('add name', function(name) {
		if(name !== ''){
			names.push(name);
			io.emit('add name', name);
		}
	});

	socket.on('next', function() {
		nextPerson = names.shift();
		if (nextPerson) say.speak('Alex', 'Now serving, ' + nextPerson);
		io.emit('next', nextPerson);
		io.emit('now serving name', nextPerson);
	});

	socket.on('class done', function() {
		nextPerson = 'No One';
		names = [];
		io.emit('class done');
		io.emit('now serving name', nextPerson);
		say.speak('Alex', 'Class is done, please clean up');
	});

	socket.on('remove name', function(removedName) {
		var i = names.indexOf(removedName);
		if (i != -1) {
			names.splice(i, 1);
		}
		io.emit('remove name', removedName);
	});

	socket.on('load class', function(classListName){
		if (classLoaded) {
			io.emit('clear loaded class');
		}
		var classListFile = "class-lists/" + classListName + ".txt";
		console.log(classListFile);
		fs.exists(classListFile, function(exists) {
			if (exists) {
				//file does exists
				fs.readFile(classListFile, "utf8", function(err, data) {
					if (err) {
						io.emit('load class', 'error');
						classLoaded = false;
					} else {
						classNames = data.split("\n");
						io.emit('load class', classNames);
						classLoaded = true;
					}
				});
			} else {
				//file does not exist
				io.emit('load class', 'no file');
				classLoaded = false;
			}
		});
	});

	socket.on('clear class', function() {
		
	});

});

http.listen(8080, function(){
	console.log('listening on *:8080');
})