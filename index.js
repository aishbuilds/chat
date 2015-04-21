var express = require('express');
var app = express();
var port = process.env.PORT || '3000';

app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

app.get('/chat', function(req, res){
	res.render('page');
});

app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
}));

io.sockets.on('connection', function(socket){

	socket.on('enter room', function(name){
		socket.username = name
		console.log('User ' + name + ' has entered.')
		io.sockets.emit('user entered room', name)
	});

	socket.on('send', function(data){
		console.log('Message received from ' + data.name)
		io.sockets.emit('display message', data)
	})

	socket.on('start typing', function(data){
		console.log('User ' + socket.username + ' has started typing')
		io.sockets.emit('user typing started', socket.username)
	})

	socket.on('stop typing', function(data){
		console.log('User ' + data.name + ' has stopped typing')
		io.sockets.emit('user typing stopped', data)
	})
});