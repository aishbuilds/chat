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

var rooms = ['General', 'Random'];
var rooms_people = {
	'General': [],
	'Random': []
}

io.sockets.on('connection', function(socket){

	socket.on('enter room', function(name){
		socket.username = name
		socket.room = 'General'
		socket.join('General');
		console.log('User ' + name + ' has entered.')
		
		rooms_people['General'].push(name)
		
		socket.broadcast.to('General').emit('user entered room', name, socket.room)
		
		socket.broadcast.to('General').emit('update online users', rooms_people['General'])
		socket.emit('update online users', rooms_people['General'])

		socket.emit('user entered room', 'You', socket.room)
		socket.emit('update room', rooms, socket.room)
	});

	socket.on('send', function(data){
		console.log('Message received from ' + data.name)
		// io.sockets.emit('display message', data)
		io.sockets.in(socket.room).emit('display message', data)
	})

	socket.on('start typing', function(data){
		console.log('User ' + socket.username + ' has started typing')
		io.sockets.emit('user typing started', socket.username)
	})

	socket.on('stop typing', function(data){
		console.log('User ' + data.name + ' has stopped typing')
		io.sockets.emit('user typing stopped', data)
	})

	socket.on('room changed', function(name, newRoom){
		socket.broadcast.to(socket.room).emit('user left room', name)
		socket.leave(socket.room)

		socket.join(newRoom)
		socket.room = newRoom
		console.log('User ' + name + ' has changed room to' + newRoom)

		rooms_people[newRoom].push(name)
		console.log(rooms_people)
		
		socket.broadcast.to(newRoom).emit('user entered room', name, socket.room)
		socket.broadcast.to(newRoom).emit('update online users', rooms_people['General'])

		socket.emit('user entered room', 'You', socket.room)
		socket.emit('update room', rooms, socket.room)
	})
});