var socket;

$(document).ready(function(){

	$('#chat-div').hide();
	socket = io();

	$('#contact-submit').click(function(){
		socket.emit('enter room', $('#user-name').val());
		$('#user-detail-div').hide();
		$('#chat-div').show();
	});

	socket.on('user entered room', function(name, room){
		var pre = document.getElementsByTagName('pre')
        pl = pre.length + 1;
		if(name == 'You')
			$('#all-chats').append('<pre class="chat-msg"> <span class="line"><b>' + pl + ' | </b></span><span class="user-name">' + name + ' </span><span class="typing-text"> entered </span>room <span class="room-name">' + room + '</span>.</pre>')
		else
			$('#all-chats').append('<pre class="chat-msg"> <span class="line"><b>' + pl + ' | </b></span><span class="user-name">' + name + ' </span><span class="typing-text"> entered </span>this room.</pre>')
	});

	socket.on('update online users', function(rooms_people){

		$('#online-users').empty();
		for(i=0;i<rooms_people.length;i++){
			$('#online-users').append('<p class="online-user-name">' + rooms_people[i] + '</pre>')
		}

		$('#online-count').text('Online users: ' + rooms_people.length)
	})

	socket.on('user left room', function(name){
		var pre = document.getElementsByTagName('pre')
        pl = pre.length + 1;
		$('#all-chats').append('<pre class="chat-msg"> <span class="line"><b>' + pl + ' | </b></span><span class="user-name">' + name + ' </span><span class="typing-text">left </span>this room.</pre>')
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
		var pre = document.getElementsByTagName('pre')
        pl = pre.length + 1;
		sender = data.name ? data.name : 'Server'
		$('#all-chats').append('<pre class="chat-msg"> <span class="line"><b>' + pl + ' | </b></span><span class="user-name">' + sender + ': </span>' + data.message + '</pre>')
		
		if((600 - $('#all-chats').height()) <= $(window).scrollTop()){
			$('#all-chats').scrollTop($('pre:last').position().top - 30);
		}
	});

	socket.on('user typing started', function(name){
		if ( !$( "#" + name ).length ) {
			$('#all-chats').append('<p class="chat-msg typing-text" id=' + name + '>' + name + ' is typing..</p>')
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
		$('#current-room').text(current_room)
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