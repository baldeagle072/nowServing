var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var say = require('say');
var fs = require('fs');
var names = [];
var nextPerson = 'No One';
var classLoaded = false;
var returnData = {};
var lastPerson = 'No One';
var pronounce = require('./pronounce')

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile('index.html');
});

app.get('/admin', function(req, res) {
	res.sendFile('admin.html', {root: __dirname + '/public'});
});

io.on('connection', function(socket){
	console.log(socket.handshake.headers.referer)
	for (n in names){
		socket.emit('add name', names[n]);
	}
	socket.emit('now serving name', nextPerson);
	if (classLoaded) {
		returnData.names = names;
		socket.emit('load class', returnData);
	}

	socket.on('add name', function(name) {
		if(name !== ''){
			names.push(name);
			io.emit('add name', name);
			console.log('added name to list: ' + name);
		}
	});

	socket.on('next', function() {
		lastPerson = nextPerson;
		nextPerson = names.shift();
		if (nextPerson) say.speak('Alex', 'Now serving, ' + pronounce.correctly(nextPerson));
		io.emit('next', nextPerson);
		io.emit('now serving name', nextPerson);
		if (classLoaded && (lastPerson != 'No One')) {
			io.emit('reveal name', lastPerson);
		}
		console.log('next: ' + nextPerson);
	});

	socket.on('class done', function() {
		nextPerson = 'No One';
		names = [];
		classLoaded = false;
		returnData = {};
		io.emit('class done');
		io.emit('now serving name', nextPerson);
		io.emit('clear class')
		say.speak('Alex', 'Class is done, please clean up');
		console.log('Class done');
	});

	socket.on('remove name', function(removedName) {
		var i = names.indexOf(removedName);
		if (i != -1) {
			names.splice(i, 1);
		}
		io.emit('remove name', removedName);
		io.emit('reveal name', removedName);
		console.log('Removed from list: ' + removedName);
	});

	socket.on('load class', function(classListName){
		if (classLoaded) {
			io.emit('clear loaded class');
		}
		var classListFile = "class-lists/" + classListName + ".txt";
	
		fs.exists(classListFile, function(exists) {
			if (exists) {
				//file does exists
				fs.readFile(classListFile, "utf8", function(err, data) {
					if (err) {
						io.emit('load class', 'error');
						classLoaded = false;
						console.log("class not loaded - error");
					} else {
						returnData = {loadedClassListName:classListName, classNames:data.split("\n")};
						io.emit('load class', returnData);
						classLoaded = true;
						console.log(classListFile + " loaded");
					}
				});
			} else {
				//file does not exist
				io.emit('load class', 'no file');
				classLoaded = false;
				console.log("class not loaded - no file");
			}
		});
	});

	socket.on('clear class', function() {
		io.emit('clear class');
		classLoaded = false;
		returnData = {};
		console.log('class cleared');
	});

	socket.on('say this', function(sayThis) {
		say.speak('Alex', sayThis);
	});

});

http.listen(8080, function(){
	console.log('listening on *:8080');
})