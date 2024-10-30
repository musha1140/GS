
Spry.Utils.addLoadListener(function() {
	Spry.$$("#button1").addEventListener('click', function(e){ location.reload(); }, false);
	Spry.$$("#button2").addEventListener('click', function(e){ toggleVisibility() }, false);
});
