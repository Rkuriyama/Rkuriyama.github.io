var UHGL = {};
$(function(){
	$(window).bind('hashchange',function(){
		var hash = location.hash.split('-');
		if(hash[0] == "#!"){
			UHGL[""+hash[1]+""]();
		}
		if(hash[0] == "##"){
			if($("#"+hash[1]+"" + ".page")[0]){
				var locY = $("#"+hash[1]+"").data('loc').row;
				var locX = $("#"+hash[1]+"").data('loc').page;
				slide(locY, locX);
			}
		}
		return;
	})
});