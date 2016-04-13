var ZMGL = {};
	ZMGL.Do = false;

$(function(){
	if(SLGL.Mobile === true){
		ZMGL.Do = true;
	}
	if(ZMGL.Do === true){
	SetScale();
		DoMZ();
	}
	$(window).resize(function(event) {
		SetScale();
		$("#view > #Page_Map.ZoomedMap").css('transform','matrix('+ZMGL.Scale+',0,0,'+ZMGL.Scale+',50,50)');
	});

});

function SetScale(){
	var MapWidth = $("#Page_Map").width();
	var MapHeight = $("#Page_Map").height();
	var WindowWidth = $(window).width();
	var WindowHeight = $(window).height();
	var heights = WindowHeight / MapHeight / 2;
	var widths = WindowWidth / MapWidth /2;
	ZMGL.Scale = (MapHeight > MapWidth)? heights : widths;
}

function DoMZ(){
	var $Map_Clone = $("#Page_Map").clone();
	$Map_Clone.css({
		display:'none',
		position:'fixed',
		right:'50%',
		bottom:'50%',
	    transform: 'matrix('+ZMGL.Scale+',0,0,'+ZMGL.Scale+',50,50)',
	    border: 'solid 1px black '
	}).css('background-color','rgba(255,255,255,0.5)').css('border-radius','1px').addClass('ZoomedMap').appendTo('#view');
	var $target = $("#view > #Page_Map:not(.ZoomedMap) > .map_row > .map_page").attr('onclick','');
	$("#view > #Page_Map:first").on('click',function(event) {
		$('#Page_Map' + '.ZoomedMap').toggle('slow');
		event.stopPropagation();
	});
	$("#view").on('click',function(){
		switch ($("#Page_Map.ZoomedMap").css('display')) {
			case "block":
				$('#Page_Map' + '.ZoomedMap').delay(SLGL.AnimationTime).hide('slow');
				break;
			case '':
				$("#Page_Map.ZoomedMap").css('display', 'none');
				break;
		}
	});
}