var socket;

$(document).ready(function(){

	socket = io();

	$('#send').click(function(){
		sendMessage();
	});

	$('#user-msg').keyup(function(e){
		if(e.keyCode == 13){
			sendMessage();
		}
	});

	$('#user-msg').focusin(function(e){
		typingStarted();
	});

	$('#user-msg').focusout(function(e){
		typingStopped();
	});

	socket.on('display message', function(data){
		sender = data.name ? data.name : 'Server'
		$('#content').append('<b>' + sender + ': ' + '</b>' + data.message + '<br/>')
	})

	socket.on('user typing started', function(data){
		if ( !$( "#" + data.name ).length ) {
			$('#content').append('<p id=' + data.name + '>' + data.name + ' is typing..</p>')
		}
	})

	socket.on('user typing stopped', function(data){
		$( "p" ).remove( "#" + data.name );
	})

});

function typingStarted(){
	var user_name = $('#user-name').val();
	socket.emit('start typing', {name: user_name});
}

function typingStopped(){
	user_name = $('#user-name').val();
	socket.emit('stop typing', {name: user_name});
}

function sendMessage(){
	$( "p" ).remove( "#type-msg" );
	user_msg = $('#user-msg').val();
	typingStopped();
	socket.emit('send', {message: user_msg, name: user_name});
	$('#user-msg').val('');
}