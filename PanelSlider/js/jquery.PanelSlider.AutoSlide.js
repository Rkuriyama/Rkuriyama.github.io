var ASGL = {};
	ASGL.SLGLEasing = SLGL.Easing;
	ASGL.Easing = "easeInOutSine";
	ASGL.autoslide;
	ASGL.SlideCount = 0;
	ASGL.ASState = false;
	ASGL.Interval = 2000;
	ASGL.AllSFA = true;


	$(function(){
		$(".jPSAS").click(function(event) {
			return false;
		});
		$("#view").click(function(event) {
		if(ASGL.ASState === false){return;}
			StopAS();
		});
	});

	function DoAS(array){
		var page_position = array[ASGL.SlideCount].split("-");
		slide(page_position[0],page_position[1]);
		ASGL.SlideCount ++;
		if (ASGL.SlideCount == array.length){
			ASGL.SlideCount = 0;
		}
	}
	function StopAS(){
		SLGL.Easing = ASGL.Easing;
		ASGL.ASState = false;
		clearInterval(ASGL.autoslide);
	}

	function StartAS(array,interval,easing){
		if(ASGL.ASState === true){return false;}
		SLGL.Easing = (easing)? easing:SLGL.Easing;
		if (!interval){interval = ASGL.Interval;}
		ASGL.ASState = true;
		if (array.length == 0) {
			return false;
		}else{
			var list = [];
			var lc = 0;
			for (var i=0;i < array.length;i++){
				var WT = array[i].split("-");
				if(WT[0] == "row"){
					var children = $("#column-wrapper > ."+array[i]+"").children(".page");
					for (var j = 0; j < children.length; j++) {
						list[lc] = WT[1] + "-" + j;
						lc++;
					};
				}else if(WT[0] == "column"){
					var children = $("#column-wrapper").children(".row-wrapper");
					for(var j = 0; j < children.length; j++){
						if ($("#column-wrapper > .row-wrapper > .page-"+j+"-"+WT[1]+"")[0]) {
							list[lc] = j + "-" + WT[1];
							lc++;
						};
					}
				}else if($.isNumeric(WT[0]) == true){
					if ($("#column-wrapper > .row-wrapper > .page-"+WT[0]+"-"+WT[1]+"")[0]) {
						list[lc] = array[i];
						lc ++;
					}
				}
			}
		};
		if(list.length == 0){return false;}
		ASGL.SlideCount = 0;
		ASGL.autoslide = setInterval(function(){DoAS(list);},interval);
	}


	function AllSlide(direction,interval,easing,AllSFA){
		if(ASGL.ASState === true){return false;}
		SLGL.Easing = (easing != "")? easing:SLGL.Easing;
		if (!interval){interval = ASGL.Interval;}
		ASGL.ASState = true;
		ASGL.AllSFA = AllSFA;
		var list = [];
		var lc = 0;
		if(direction == "vertical"){
			var children_of_column = $("#column-wrapper").children(".row-wrapper");
			for (var i = 0; i < children_of_column.length;i++){
				var children_of_row = $("#column-wrapper > .row-"+i+"").children(".page");
				for (var j = 0; j < children_of_row.length; j++) {
					if(ASGL.AllSFA === true && $("#column-wrapper > .row-wrapper > .page-"+i+"-"+j+"").hasClass('active_page') == true){
						var SpliceIndex = lc;
					}
					list[lc] = i + "-" + j;
					lc++;
				}
			}
		}else if(direction == "parallel"){
			var children_of_column = $("#column-wrapper").children(".row-wrapper");
			for(var i = 0; i > -1; i++){
				var page_count = 0;
				for(var j = 0; j < children_of_column.length; j++){
					if ($("#column-wrapper > .row-wrapper > .page-"+j+"-"+i+"")[0]) {
						if(ASGL.AllSFA === true && $("#column-wrapper > .row-wrapper > .page-"+j+"-"+i+"").hasClass('active_page') == true){
							var SpliceIndex = lc;
						}
							
						list[lc] = j + "-" + i;
						lc++;
						page_count ++;
					};
				}
				if (page_count == 0) {i = -2;}
			}
		}
		if(list.length == 0){
			ASGL.ASState = false;
			return false;
		}

		if(ASGL.AllSFA === true){
			var after_active_page = list.splice(SpliceIndex);
			var before_active_page = list.splice(0);
			var list = after_active_page.concat(before_active_page);
		}

		ASGL.SlideCount = 0;
		ASGL.autoslide = setInterval(function(){DoAS(list);},interval);		
	}
;