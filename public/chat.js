$(document).ready(function(){

	var socket = io();

	$('#send').click(function(){
		sendMessage();
	});

	$('#user-msg').focusin(function(e){
		// if(e.keyCode == 13){
		// 	sendMessage();
		// }
		//else{
			// if(!typing_msg){
				typingStarted();
			// }

		//}
	});

	$('#user-msg').focusout(function(e){
		typingStopped();
	});

	socket.on('display message', function(data){
		sender = data.name ? data.name : 'Server'
		$('#content').append('<b>' + sender + ': ' + '</b>' + data.message + '<br/>')
	})

	socket.on('user typing started', function(data){
		console.log("---")
		console.log(!$( "#" + data.name ).length)
		if ( !$( "#" + data.name ).length ) {
			$('#content').append('<p id=' + data.name + '>' + data.name + ' is typing..</p>')
		}
	})

	socket.on('user typing stopped', function(data){
		$( "p" ).remove( "#" + data.name );
	})

});

function typingStarted(){
	var socket = io();
	var user_name = $('#user-name').val();
	socket.emit('start typing', {name: user_name});
}

function typingStopped(){
	var socket = io();
	user_name = $('#user-name').val();
	socket.emit('stop typing', {name: user_name});
}

function sendMessage(){
	$( "p" ).remove( "#type-msg" );
	var socket = io();
	user_msg = $('#user-msg').val();
	typingStopped();
	socket.emit('send', {message: user_msg, name: user_name});
	$('#user-msg').val('');
}