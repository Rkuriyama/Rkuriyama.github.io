//////////////////////////////////////////////// グローバル変数の色々。

	var SLGL = {};
		 SLGL.ViewWidth;
		 SLGL.ViewHeight;
		 SLGL.mouse_slide;
		 SLGL.LastAnimation = 0;
		 SLGL.Resize = true;
		 SLGL.KeepPageIndex = false;
		 SLGL.Debug = false;
		 SLGL.AddHashOn = false;
		 SLGL.MouseWheel = true;
		 SLGL.Easing = "swing";
		 SLGL.AnimationTime = 500;
		 SLGL.QuitePeriod = 800;
		 SLGL.Arrows = true;
		 SLGL.Map = true;
		 SLGL.MapType = "default";
		 SLGL.startX = 0;
		 SLGL.startY = 0;
		 SLGL.FlickOn = false;
		 SLGL.TouchSensitivity = 50;
		 SLGL.Mobile = false;
		 SLGL.SlideEffect = "0";
		 SLGL.KeepOps = SLGL.AnimationTime;


		 SLGL.SlideEndFunc = {};
	
	var GL = {};
		 GL.Arguments = {};

		var ua = navigator.userAgent;
		if( /iPhone/.test(ua) || /iPad/.test(ua) || /Android/.test(ua)){
			SLGL.Mobile = true;
		}


////////////////////////////////////////////////// Slide実装用のReSize
$(function(){
	SLGL.ViewWidth = $("#view").width();
	SLGL.ViewHeight = $("#view").height();
	var BeforeWidth = SLGL.ViewWidth;
	var BeforeHeight = SLGL.ViewHeight;
	$('.page').css({
		"width": SLGL.ViewWidth,
		"height": SLGL.ViewHeight
	});
	$(".row-wrapper").each(function() {
		var length = $(this).find('.page').length;
		if( length != 0 ){
			$(this).css({
				"width": SLGL.ViewWidth * length + 1,
				"height": SLGL.ViewHeight
			});
		}
	});
	$(window).resize( function(){
		if (SLGL.Resize === true){
			if (SLGL.Mobile === true) {
				$("#column-wrapper").css({
						'transition':'',
						'-webkit-transition':''
				});
				$(".row-wrapper").css({
						'transition':'',
						'-webkit-transition':''
				});
			};
/////////////////////////////////////////////// Pageおよびrow_wrapperのReSize
			var WindowWidth = $("#view").width();
			var WindowHeight = $("#view").height();
			$('.page').css({
				"width": WindowWidth,
				"height": WindowHeight
			});
			$(".row-wrapper").each(function() {
				var length = $(this).find('.page').length;
				if( length != 0 ){
					$(this).css({
						"width": WindowWidth * length + 1,
						"height": WindowHeight
					});
				}
			});
//////////////////////////////////////////////////// パネルのRePosition
			var width_gap = BeforeWidth - WindowWidth;
			var active_page_index = $("#column-wrapper > .active > .page").index($(".active_page"));
			var adjust_left = width_gap * active_page_index;
			$(".active").css({
				'left': "+="+adjust_left+"px"
			});
			BeforeWidth = WindowWidth;
			SLGL.ViewWidth = BeforeWidth;
			var height_gap = BeforeHeight - WindowHeight;
			var active_row_index = $("#column-wrapper > .row-wrapper").index($(".active"));
			var adjust_top = height_gap * active_row_index;
			$("#column-wrapper").css({
				'top': "+="+adjust_top+"px"
			});
			BeforeHeight = WindowHeight;
			SLGL.ViewHeight = BeforeHeight;
			// return false;
		}
		AddScrollable();
		return;
	});


	if(SLGL.Arrows === true){
		$('#view').append('<div id="Arrows"><div id="down_arrow" class="nav_arrows" data-func="down"> </div><div id="up_arrow" class="nav_arrows" data-func="up"> </div><div id="left_arrow" class="nav_arrows" data-func="left"> </div><div id="right_arrow" class="nav_arrows" data-func="right"> </div></div>');
	}
	$("#Arrows > .nav_arrows").click(function(e){
			r_slide($(this).data('func'));
	});
	if (SLGL.Map === true) {
		$('#view').append('<div class="Page_Map" data-type="default"></div>')
	}
	$(".row-wrapper").each(function(row_index){
		var row_class = "row-" + row_index;
		$(this).addClass(row_class);

		if ($(".Page_Map").length) {
			$(".Page_Map").append("<div class= "+row_class+"></div>");
		}
		$(this).children('.page').each(function(page_index,domEle) {
			var page_num = "page-" + row_index + "-" + page_index ;
			$(domEle).addClass(page_num);
			$(domEle).data('loc',{row:row_index, page:page_index});

			if ($(".Page_Map").length) {
				$(".Page_Map > ."+row_class+"").append("<div class="+page_num+" onClick='slide("+row_index+","+page_index+")'></div>").data('loc',{row:row_index, page:page_index});
					var faketitle =	$("#column-wrapper > .row-"+row_index+" > ."+page_num+" > h1:first-child").html();
					var page_title = ($("#column-wrapper > .row-"+row_index+" > ."+page_num+"").attr('title'))?($("#column-wrapper > .row-"+row_index+" > ."+page_num+"").attr('title')):$("#column-wrapper > .row-"+row_index+" > ."+page_num+"").attr('id');
				if(page_title){
					$(".Page_Map > ."+row_class+" > ."+page_num+"").attr('title',page_title);
				}else if(faketitle){
					var faketitle =	$("#column-wrapper > .row-"+row_index+" > ."+page_num+" > h1:first-child").html();
					$(".Page_Map > ."+row_class+" > ."+page_num+"").attr('title',faketitle);	
				}
			}
			$(domEle).removeAttr("title","");
		});
	});
	$('.row-0').addClass('active');
	$('.page-0-0').addClass('active_page');
	$("#column-wrapper > .row-wrapper:last").addClass('last-row');
	$("#column-wrapper > .row-wrapper:first").addClass('first-row');
	$("#column-wrapper > .row-wrapper > .page:last-child").addClass('last-page');
	$("#column-wrapper > .row-wrapper > .page:first-child").addClass('first-page');

	if ($(".Page_Map").length){
		$(".Page_Map > div").addClass('map_row');
		$(".Page_Map > .map_row > div").addClass('map_page');
	}

	if(SLGL.Debug === true){
		$('.page').each(function(index, el) {
			$(el).text("row:"+$(el).data("loc").row+" page:"+$(el).data("loc").page+"" );
		});
		$("#view").css({
			"background-color": "red"
		});
		$("#column-wrapper").css('background-color', 'yellow');
		$(".row-wrapper").css('background-color', 'blue');
		$(".page").css('background-color','rgba(255,255,255,0.5)');
	}

	$("#view").css('visibility', 'visible');

	CheckArrow();
    CheckHash();
    AddScrollable();



	$(".jump").on('click', function(){
		var pos = $(this).attr("href").split('-');
		if(pos.length == 2){
			if($.isNumeric(pos[0]) && $.isNumeric(pos[1]) ){
				slide(pos[0],pos[1]);
			}else{
				return false;
			}
		}else if(pos.length == 3){
			if(pos[0] == "page" || pos[0] == "#page"){
				if($.isNumeric(pos[1]) && $.isNumeric(pos[1]) ){
					slide(pos[1],pos[2]);
				}else{
					return false;
				}
			}
			return false;
		}
		return false;
	});
	 	 var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
        $("#view").on(mousewheelevent,function(e){
        	if(SLGL.MouseWheel === true){
			if ($("#column-wrapper > .active > .active_page").hasClass('scrollable')){return;};
                var delta_Y = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
                var timeNow = new Date().getTime();
                if(timeNow - SLGL.LastAnimation < SLGL.QuitePeriod + SLGL.AnimationTime){
                	e.preventDefault();
                	return;
                }
                if (delta_Y < 0){
                	r_slide("down");
                } else {
                	r_slide("up");
                }
                SLGL.LastAnimation = timeNow;
            }
        });

        $(window).on("hashchange",
        	CheckHash
        );
        /////////////////////////////////////////////////////Flick

        if (SLGL.FlickOn === true){
	        $("#view").bind({
	        	'touchstart': function(e){
				    this.touchX = event.changedTouches[0].pageX;
				    // this.touchY = event.changedTouches[0].pageY;
	        	},
	        	'touchmove': function(e){
				// if ($("#column-wrapper > .active > .active_page").hasClass('scrollable')){return;};
	        		var timeNow = new Date().getTime();
	                if(timeNow - SLGL.LastAnimation < SLGL.QuitePeriod + SLGL.AnimationTime){
	                	return;
	                }
	   				this.slideX = this.touchX - event.changedTouches[0].pageX;
	   				// this.slideY = this.touchY - event.changedTouches[0].pageY;
	        	},
	        	'touchend': function(e) {
	        		var timeNow = new Date().getTime();
	                if(timeNow - SLGL.LastAnimation < SLGL.QuitePeriod + SLGL.AnimationTime){
	                	return;
	                }

	                // if(Math.abs(this.slideX) > Math.abs(this.slideY)){
	                	if(this.slideX > SLGL.TouchSensitivity){
	                		r_slide("right");	                		
	                	}else if (this.slideX < SLGL.TouchSensitivity){
	                		r_slide("left");
	                	}
	                // }else{
	                	// if (this.slideY > SLGL.TouchSensitivity) {
	                	// 	r_slide("down");
	                	// }else if(this.slideY < SLGL.TouchSensitivity){
	                	// 	r_slide("up");
	                	// }
	                // };

	        		this.slideX = 0;
	        		// this.slideY = 0;
                	SLGL.LastAnimation = timeNow;
                	return;
	        	}
	    	});
		}


		$(window).keydown(function(e){
			switch(e.keyCode){
				case 37:
					r_slide("left");
					break;
				case 38:
					r_slide("up");
					break;
				case 39:
					r_slide("right");
					break;
				case 40:
					r_slide("down");
					break;
			}
		});
});



	function AddScrollable() {
		if(SLGL.MouseWheel === true){
			var $target = $("#column-wrapper > .active > .active_page")[0];
			if (!$("#column-wrapper > .active > .active_page").hasClass('scrollfixed')) {
				if ($target.scrollHeight > $target.clientHeight){
					$("#column-wrapper > .active > .active_page").addClass('scrollable');
				} else {
					$("#column-wrapper > .active > .active_page").removeClass('scrollable');
				}
			};
			return;
		}else{
			return;
		}
	}

	function CheckMap(value, obj_name){
		 if (!obj_name){obj_name = ".Page_Map";}
		 if (typeof value === 'string'){
		 	SLGL.MapType = value;
			if(value === "column_only" || value === "row_only" || value === "default" || value == "column&active_row" || value == "none") {

				if($(obj_name).length){
					$(obj_name).removeAttr('data-type').attr('data-type', value);
					return
				}else{
					console.log('%cNo object. CheckMap(type [,selector])','color:red');
				}
			}else{
				console.log('%cThis type is undefined. You can use "row_only" "column_only" "column&active_row" "default" "none" ','color:red');
			}
		 }
	}

	function CheckArrow(){
		if (SLGL.Arrows === true) {
				var active_row_index = $(".active_page").data('loc').row;
				var active_page_index = $(".active_page").data('loc').page;
				var downcheck = active_row_index +1;
				var upcheck = active_row_index -1;


			if (SLGL.KeepPageIndex === true){

				if(!$(".page-"+downcheck+"-"+active_page_index+"")[0]){
					$("#down_arrow").fadeOut('slow').removeClass('active_arrow');
				}else{
					$("#down_arrow").fadeIn("slow").addClass('active_arrow').data('loc',{
						row:  active_row_index + 1,
						page: active_page_index
					});
				}

				if(!$(".page-"+upcheck+"-"+active_page_index+"")[0]){
					$("#up_arrow").fadeOut('slow').removeClass('active_arrow');
				}else{
					$("#up_arrow").fadeIn("slow").addClass('active_arrow').data('loc',{
						row:  active_row_index - 1,
						page: active_page_index
					});
				}

			}else{

				if ($('.active').hasClass('last-row')){
					$("#down_arrow").fadeOut('slow').removeClass('active_arrow');
				}else{
					$("#down_arrow").fadeIn("slow").addClass('active_arrow').data('loc',{
						row:  active_row_index + 1,
						page: 0
					});
				}

				if ($('.active').hasClass('first-row')){
					$("#up_arrow").fadeOut('slow').removeClass('active_arrow');
				}else{
					$("#up_arrow").fadeIn("slow").addClass('active_arrow').data('loc',{
						row:  active_row_index - 1,
						page: 0
					});
				}
			}

//////////////////////////////////////////////////////////////////// ↑ 上下矢印判定　↓左右矢印判定
			if ($('.active_page').hasClass('last-page')){
				$("#right_arrow").fadeOut('slow').removeClass('active_arrow');
			}else{
				$("#right_arrow").fadeIn("slow").addClass('active_arrow').data('loc',{
						row:  active_row_index,
						page: active_page_index + 1
					});
			}

			if ($('.active_page').hasClass('first-page')){
				$("#left_arrow").fadeOut('slow').removeClass('active_arrow');
			}else{
				$("#left_arrow").fadeIn("slow").addClass('active_arrow').data('loc',{
						row:  active_row_index,
						page: active_page_index - 1
					});
			}


			// $("#Arrows > .active_arrow").each(function(index, el) {
			// 	var pos = $(el).data('loc');
			// 	if($(".Page_Map > .row-"+pos.row+" > .page-"+pos.row+"-"+pos.page+"").attr('title')){
			// 		$(el).text($(".Page_Map > .row-"+pos.row+" > .page-"+pos.row+"-"+pos.page+"").attr('title'));
			// 	}
			// });


		}
	}


	function slide(y,x){
		if(!$(".page-"+y+"-"+x+"")[0] || $(".active_page").hasClass('.page-'+y+'-'+x+'')){
			return false;
		}
		$(window).off("hashchange",
			CheckHash
		);
		clearTimeout(OnCheckHash);
		$("#column-wrapper,#column-wrapper > .row-wrapper").stop();
		var WindowWidth = SLGL.ViewWidth;
		var WindowHeight = SLGL.ViewHeight;
		var to_x = WindowWidth * x * -1 ;
		var to_y = WindowHeight * y * -1 ;
		
		var which = ( y == $(".active_page").data('loc').row )?true:false;
		var $beforepage = $('.active_page.page');
		$('.active').removeClass('active');
		$('.active_page').removeClass('active_page');
		$(".row-"+y+"").addClass('active');
		$(".page-"+y+"-"+x+"").addClass('active_page');


			// if( SLGL.Mobile === true && SLGL.SlideEffect == "1"){
			// 	if (which) {
			// 		$("#column-wrapper > .row-"+y+"").css({
			// 			'transition':'left '+SLGL.AnimationTime+'ms ease-in-out',
			// 			'-webkit-transition':'left '+SLGL.AnimationTime+'ms ease-in-out'
			// 		});
			// 	}else{
			// 		$("#column-wrapper > .row-"+y+"").css({
			// 			'transition':'',
			// 			'-webkit-transition':''
			// 		});
			// 	}
			// 		$("#column-wrapper > .row-"+y+"").css('left',''+to_x+'px');
			// 		$("#column-wrapper").css({
			// 			'top':''+to_y+'px',
			// 			'transition':'top '+SLGL.AnimationTime+'ms ease-in-out',
			// 			'-webkit-transition':'top '+SLGL.AnimationTime+'ms ease-in-out'
			// 		});
			// 		$("#column-wrapper > .row-wrapper:not('.active')").css({
			// 			'left':'0',
			// 			'transition':'',
			// 			'-webkit-transition':''
			// 		});
			// } else if(SLGL.Mobile === true && SLGL.SlideEffect != "1"){
			// 	$("#column-wrapper").css({
			// 			'top':''+to_y+'px',
			// 			'transition':'top '+SLGL.AnimationTime+'ms ease-in-out',
			// 			'-webkit-transition':'top '+SLGL.AnimationTime+'ms ease-in-out'
			// 	});
			// 	$("#column-wrapper > .row-"+y+"").css({
			// 		'left':''+to_x+'px',
			// 		'transition':'left '+SLGL.AnimationTime+'ms ease-in-out',
			// 		'-webkit-transition':'left '+SLGL.AnimationTime+'ms ease-in-out'
			// 	});
			// 	$("#column-wrapper > .row-wrapper:not('.active')").css({
			// 		'left':'0',
			// 		'transition':'left '+SLGL.AnimationTime+'ms ease-in-out',
			// 		'-webkit-transition':'left '+SLGL.AnimationTime+'ms ease-in-out'
			// 	});
			// } else 
			if(SLGL.SlideEffect == "1"){ //if(SLGL.Mobile !== true && SLGL.SlideEffect == "1"){
				if (!which) {
					SLGL.AnimationTime = 1;
				}
				$("#column-wrapper > .row-"+y+"").animate({
					left: to_x
				}, SLGL.AnimationTime, SLGL.Easing, function(){
					SLGL.AnimationTime = SLGL.KeepOps;
					$("#column-wrapper").animate({
						top: to_y
					}, SLGL.AnimationTime, SLGL.Easing, function(){
						$("#column-wrapper > .row-wrapper:not('.active')").css({
							"left":"0",
						});
					});
				});
			} else {
				$("#column-wrapper").animate({
					top: to_y
				}, SLGL.AnimationTime, SLGL.Easing );
				$("#column-wrapper > .row-"+y+"").animate({
					left: to_x
				}, SLGL.AnimationTime, SLGL.Easing);
				$("#column-wrapper > .row-wrapper:not('.active')").animate({
					left:0
				}, SLGL.AnimationTime, SLGL.Easing);
			}


		CheckArrow();
		AddHash();
		AddScrollable();
		SlideEndAlert( y, x, $beforepage );
		var OnCheckHash = setTimeout(function(){ $(window).on("hashchange",CheckHash); } , SLGL.AnimationTime);
	}

	function r_slide(value1,value2){
			var active_page_index = $('.active_page').data('loc').page;
			var active_row_index = $('.active_page').data('loc').row;
		if(value1 === "right"){
			active_page_index ++;
			if(typeof value2 !== "undefined" && $.isNumeric(value2)){
				active_page_index = active_page_index + value2 -1;
			}
			if(!$(".page-"+active_row_index+"-"+active_page_index+"")[0]){return false;}
		}else if(value1 === "left"){
			active_page_index --;
			if(typeof value2 !== "undefined" && $.isNumeric(value2)){
				active_page_index = active_page_index - value2 +1
			}
			if(!$(".page-"+active_row_index+"-"+active_page_index+"")[0]){return false;}
		}else if(value1 === "down"){
			active_row_index ++;
			if(typeof value2 !== "undefined" && $.isNumeric(value2)){
				active_row_index = active_row_index + value2 - 1;
			}
			active_page_index = (!SLGL.KeepPageIndex)?0:active_page_index;
			if(!$(".row-"+active_row_index+"")[0]){return false;}
		}else if(value1 === "up"){
			active_row_index --;
			if(typeof value2 !== "undefined" && $.isNumeric(value2)){
				active_row_index = active_row_index - value2 +1;
			}
			active_page_index = (!SLGL.KeepPageIndex)?0:active_page_index;
			if(!$(".row-"+active_row_index+"")[0]){return false;}
		}else if(value1 === "top" && value2 === "undefined"){
			active_row_index = 0;
			active_page_index = 0;
		}
		slide(active_row_index,active_page_index);
	}

	function AddHash(){
		if (SLGL.AddHashOn === true){
			if($(".active_page").attr('id') == undefined){
				var position = $('.active_page').data('loc')
				location.hash = "page-"+position.row+"-"+position.page+"";
			}else{
				var position = $('.active_page').attr('id');
				location.hash = "##-"+position+"";
			}
		}
	}

	var CheckHash = function (){
		if (location.hash){
			var nextHash = location.hash.split('#')[1].split('-');
			var hash = location.hash.split('-');
			if(hash[0] == "##"){
				if($("#"+hash[1]+"" + ".page")[0]){
					var locY = $("#"+hash[1]+"").data('loc').row;
					var locX = $("#"+hash[1]+"").data('loc').page;
					slide(locY, locX);
				}
			}else{
					slide(nextHash[1],nextHash[2]);
			}

			if (SLGL.AddHashOn === false) {
				location.hash = "";
			};

		}
	}

	function SlideEndAlert( y, x, $beforepage ){
		GL.Arguments = {
			beforepage : $beforepage,
			afterpage : $( '.page-'+ y +'-'+ x +'' + '.page' ),
			leftpage : $( '.page-'+ y +'-'+  (x - 1)  +'' + '.page' ),
			rightpage : $( '.page-'+ y +'-'+ (x-0 + 1)  +'' + '.page' ),
			upperpage : $( '.page-'+ (y - 1) +'-'+ x +'' + '.page' ),
			lowerpage : $( '.page-'+ (y-0 + 1) +'-'+ x +'' + '.page' ),
			parentrow : $( '.page-'+ y +'-'+ x +'' + '.page' ).parent(),
			upperrow : $( '.row-'+ (y - 1) +'' + '.row-wrapper' ),
			lowerrow : $( '.row-'+ (y-0 + 1) +'' + '.row-wrapper' ),
			column_wrapper : $('#column-wrapper'),
			view : $('#view'),
			x: x,
			y: y,
			grobal_variable : SLGL,
		}

		// for( var func_name in SLGL.SlideEndFunc ){
		// 	SlideEndFunc[func_name]( GL.Arguments );
		// }
		console.log( GL.Arguments )
	}