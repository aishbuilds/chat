var express = require('express');
var app = express();
var port = '3000';

app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

app.get('/chat', function(req, res){
	res.render('page');
});

app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function(socket){
	socket.emit('welcome', {message: 'welcome to chat'});
	socket.on('send', function(data){
		console.log('Message received from ' + data.name)
		io.sockets.emit('message', data)
	})
});