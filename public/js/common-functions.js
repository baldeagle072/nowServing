socket.on('add name', function(name) {
	$('#names').append($('<li>').text(name));
});

socket.on('next', function(nextPerson) {
	$('#names li:first-child').remove();
	if (nextPerson !== null) {
		$('#nowServing').fadeOut(400, function() {
			$('#nowServing').text(nextPerson).fadeIn();
		});
	} else {
		$('#nowServing').fadeOut(400, function() {
			$('#nowServing').text('No One').fadeIn();
		});
	}
});

socket.on('now serving name', function(nextPerson) {
	if (nextPerson !== null) {
		$('#nowServing').fadeOut(1, function() {
			$('#nowServing').text(nextPerson).fadeIn(400);
		});
	} else {
		$('#nowServing').fadeOut(1, function() {
			$('#nowServing').text('No One').fadeIn(400);
		});
	}
});