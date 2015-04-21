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
		$('#content').append('<p>' + name + ' entered room.</p>')
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

});

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