var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var say = require('say');
var names = [];
var nextPerson = 'No One';

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
	socket.on('disconnect', function(){
		
	});
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
});

http.listen(8080, function(){
	console.log('listening on *:8080');
})