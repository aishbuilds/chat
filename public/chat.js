window.onload = function(){
	var socket = io();

	$('#send').click(function(){
		user_msg = $('#user-msg').val();
		user_name = $('#user-name').val();
		socket.emit('send', {message: user_msg, name: user_name});
		$('#user-msg').val('');
	});

	socket.on('message', function(data){
		sender = data.name ? data.name : 'Server'
		$('#content').append('<b>' + sender + ': ' + '</b>' + data.message + '<br/>')
	})
}