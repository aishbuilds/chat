var socket;

$(document).ready(function(){

	$('#chat-div').hide();
	socket = io();

	$('#contact-submit').click(function(){
		socket.emit('enter room', $('#user-name').val());
		$('#user-detail-div').hide();
		$('#chat-div').show();
	});

	socket.on('user entered room', function(name){
		$('#content').append('<p>' + name + ' entered this room.</p>')
	});

	socket.on('user left room', function(name){
		$('#content').append('<p>' + name + ' left this room.</p>')
	});

	$('#user-msg').focusin(function(e){
		typingStarted();
	});

	$('#user-msg').focusout(function(e){
		typingStopped();
	});

	$('#send').click(function(){
		sendMessage();
	});

	$('#user-msg').keyup(function(e){
		if(e.keyCode == 13){
			sendMessage();
		}
	});

	socket.on('display message', function(data){
		sender = data.name ? data.name : 'Server'
		$('#content').append('<b>' + sender + ': ' + '</b>' + data.message + '<br/>')
	});

	socket.on('user typing started', function(name){
		if ( !$( "#" + name ).length ) {
			$('#content').append('<p id=' + name + '>' + name + ' is typing..</p>')
		}
	});

	socket.on('user typing stopped', function(data){
		$( "p" ).remove( "#" + data.name );
	});

	socket.on('update room', function(rooms, current_room){
		$('#rooms').empty();
		$.each(rooms, function(key, value) {
			if(value == current_room){
				$('#rooms').append('<div>' + value + '</div>');
			}
			else {
				$('#rooms').append('<div><a href="#" onclick="switchRoom(\'' + value + '\')">' + value + '</a></div>');
			}
		});
	});

});

function switchRoom(newRoom){
	socket.emit('room changed', $('#user-name').val(), newRoom)
}

function typingStarted(){
	socket.emit('start typing', {});
}

function typingStopped(){
	user_name = $('#user-name').val();
	socket.emit('stop typing', {name: user_name});
}

function sendMessage(){
	user_msg = $('#user-msg').val();
	typingStopped();
	socket.emit('send', {message: user_msg, name: user_name});
	$('#user-msg').val('');
}