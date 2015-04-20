$(document).ready(function(){

	var socket = io();

	$('#send').click(function(){
		sendMessage();
	});

	$('#user-msg').keyup(function(e){
		if(e.keyCode == 13){
			sendMessage();
		}
	});

	socket.on('message', function(data){
		sender = data.name ? data.name : 'Server'
		$('#content').append('<b>' + sender + ': ' + '</b>' + data.message + '<br/>')
	})
});

function sendMessage(){
	var socket = io();
	user_msg = $('#user-msg').val();
	user_name = $('#user-name').val();
	socket.emit('send', {message: user_msg, name: user_name});
	$('#user-msg').val('');
}