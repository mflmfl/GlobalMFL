$ = jQuery;

var debug       = false;
var winWidth, winHeight;
var root        = $(this);
var isIE        = navigator.userAgent.match(/msie/i),
	isIE6	   	= navigator.userAgent.match(/msie [6.]/i),
    isIE7       = navigator.userAgent.match(/msie [7.]/i),
    isIE8       = navigator.userAgent.match(/msie [8.]/i),
    isIE9       = navigator.userAgent.match(/msie [9.]/i),
    isIE10      = navigator.userAgent.match(/msie [10.]/i),
    isIE11      = navigator.userAgent.match(/msie [11.]/i),
    isIE12      = navigator.userAgent.match(/msie [12.]/i),
    chrome      = navigator.userAgent.match(/chrome/i),
	safari      = navigator.userAgent.match(/safari/i),
	firefox     = navigator.userAgent.match(/firefox/i),
	iphone      = navigator.userAgent.indexOf('iPhone'),
	ipad        = navigator.userAgent.indexOf('iPad'),
	ipod        = navigator.userAgent.indexOf('iPod'),
	android     = navigator.userAgent.indexOf('Android'),
	lowIE       = false;
var userAgent = window.navigator.userAgent.toLowerCase();
if( userAgent.match(/(msie|MSIE)/) || userAgent.match(/(T|t)rident/) ) {
    isIE = true;
    var ieVersion = userAgent.match(/((msie|MSIE)\s|rv:)([\d\.]+)/)[3];
    ieVersion = parseInt(ieVersion);
} else {
    isIE = false;
}
var status;

var Main = (function($) 
{
	//==============================================
	// Vars
	//==============================================
	var kvlist = [];
	var kvbox = [];
	var evtWheels;
	var timer;
	var interval = 4000;
	var activeNow = false;
	var nums = {now:0, cache:0, max:0};
	var spnums = {now:1, cache:1, max:0};
	var frame;
	var mode = "index";
	var swiper;
	var dlist = [];
	var dmax = 0;

	//==============================================
	// Initialize
	//==============================================

	function onInit()
	{
		if(isIE6 || isIE7 || isIE8) lowIE = true;

		Shadowbox.init();

		$(window).resize(resizeHandler);
		resizeHandler();
		$(window).scroll(scrollHandler);
		scrollHandler();

		evtWheels = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';

		$(".my-gallery").swipeshow({
		  autostart: true,
		  interval: 5000,
		  initial: 0,
		  speed: 350,
		  friction: 0.3,
		  mouse: true,
		  keys: true,

		  onactivate: function(e)
		  {
		  	
		  },
		  onpause: function()
		  {

		  },
		});

		$(".dot-item").each(function(i)
		{
			$(this).find("span").append(i+1);
		})

		details();
		splash();
	}

	function splash()
	{
		if(status == "PC") 
		{
			$("#container").css({display:"block"});
			$("ul#kvimgset li#kvimg1").stop(true,false).css({display:"block", opacity:0}).delay(100).animate({opacity:1}, 1500, "linear");
			$("header").stop(true,false).css({top:"-100px"}).delay(800).animate({top:"0px"}, 1300, "easeOutExpo");
			$("footer").stop(true,false).css({bottom:"-80px"}).delay(800).animate({bottom:"0px"}, 1300, "easeOutExpo");
			$("#mv_inner").stop(true,false).css({marginTop:"300px"}).delay(1200).animate({marginTop:"0px"}, 1300, "easeOutExpo");
			$("#direct_r").stop(true,false).css({marginRight:"-100px"}).delay(1300).animate({marginRight:"0px"}, 1300, "easeOutExpo");
			$("#direct_l").stop(true,false).css({marginLeft:"-100px"}).delay(1300).animate({marginLeft:"0px"}, 1300, "easeOutExpo");
			$("ul#kvtxtset li#kvbox1 .kv_bttl img").stop(true,false).css({opacity:"0", marginTop:"-280px"}).delay(1800).animate({opacity:1, marginTop:"0px"}, 1300, "easeOutExpo");
			$(".alink_index").stop(true,false).css({opacity:"0", marginTop:"500px"}).delay(1800).animate({opacity:1, marginTop:"141px"}, 1300, "easeOutExpo");
			setTimeout(function()
			{
				startContents();
			},2000);
		}
		else if(status == "SP") 
		{
			$("ul#kvimgset li#kvimg1").stop(true,false).css({display:"block", opacity:1});
			startContents();
		}
	}

	function startContents()
	{
		if(status == "PC") 
		{
			$(document).bind(evtWheels, wheelHandler);
			startTimer();
		}
		callSlideNaviEvent();
		callBasicEvents();
	}

	var randomTextInit = function()
	{
		$("#dd_txt1").stop(true,false).css({opacity:0});
		$("#dd_txt2").stop(true,false).css({opacity:0});
	}

	var startTimer = function()
	{
		clearInterval(timer);
		timer = setInterval(function()
		{
			nums.now++;
			if(nums.now > nums.max) nums.now = 0;
			changeSlide(-1);

		}, interval);
	}
	
	function details()
	{
		/* all */
		if(debug) $("body").prepend("<p id='debugtxt' style='position:fixed; font-size:22px; padding:0 20px; color:#fff; z-index:9999; background-color:#000;'>scroll : 0px</p>");
		
		/* pc */
		$(".ov").css({opacity:0});

		$("ul#kvimgset li.kvimg").each(function(i)
		{
			kvlist.push($(this));
			if(i!=0) $(this).css({display:"none", left:"100%"});
			//else $(this).css({display:"block", left:"0%"});
		})
		$("ul#kvtxtset li.kvbox").each(function(i)
		{
			kvbox.push($(this));
			if(i!=0) $(this).find(".kv_bttl").css({opacity:0});
			else $(this).find(".kv_bttl").css({opacity:1});
		})

		$("ul#snv_nolist li#snv_no1 a").addClass("active").css({opacity:1});

		nums.max = $("ul#kvimgset li.kvimg").length-1;

		/* sp */
		$("ul#sp_snv_nolist li#sp_snv_no" + spnums.now + " a.ov").addClass("active").css({opacity:1});
	}

	function callBasicEvents()
	{
		$(".ov").css({cursor:"pointer"});
		$(".ov").mouseover(function()
		{
			if(winWidth >= 980 && (ipad == -1 && iphone == -1 && android == -1))
			{
				$(this).stop(true, false)
				.animate({opacity:1}, 50, "linear");
				if($(this).parent().find(".def")) 
				{
					$(this).parent().find(".def").stop(true, false)
					.animate({opacity:0}, 50, "linear");
				}
			}
		});
		$(".ov").mouseout(function()
		{
			if(winWidth >= 980 && (ipad == -1 && iphone == -1 && android == -1))
			{
				if($(this).hasClass("active")) return;

				$(this).stop(true, false)
				.animate({opacity:0}, 300, "easeOutSine");
				if($(this).parent().find(".def")) 
				{
					$(this).parent().find(".def").stop(true, false)
					.animate({opacity:1}, 300, "easeOutSine");
				}
			}
		});

		$(".aov").css({cursor:"pointer"});
		$(".aov").mouseover(function()
		{
			$(this).stop(true, false)
			.animate({opacity:.65}, 50, "linear");
		});
		$(".aov").mouseout(function()
		{
			$(this).stop(true, false)
			.animate({opacity:1}, 300, "easeOutSine");
		});

		$(".menubtn, .sp_close").css({cursor:"pointer"});
		$(".menubtn, .sp_close").click(function()
		{
			var target = $("nav #sp_gnaviset");
			if(target.css("display") == "none") 
			{
				$(".menubtn").fadeOut(50);
				$(".sp_close").fadeIn(50);
				target.slideDown(300);
			}
			else if(target.css("display") == "block") 
			{
				$(".menubtn").fadeIn(50);
				$(".sp_close").fadeOut(50);
				target.slideUp(300);
			}

			if($(this).attr("class") != "sp_close") $(safari ? "body" : "html").animate({scrollTop:0}, 500, 'easeInOutQuint');

			return false;
		});

		$(".anker").click(function() 
		{
			var speed = 1000;
			var href= $(this).attr("href");
			var target = $(href == "#" || href == "" ? "html" : href);
			var position = target.offset().top;

			$(safari ? "body" : "html").animate({scrollTop:position}, speed, "easeInOutQuint", function()
			{
				ptbool = false;
			});

			return false;
		});
	}

	function callSlideNaviEvent()
	{
		var target = $("ul#snv_nolist li.snv_no a");
		target.css({cursor:"pointer"});
		target.click(function()
		{
			var k = Number($(this).parent().attr("id").charAt(6))-1;
			if(k==nums.now || activeNow) return false;
			
			nums.now = k;
			var delta;
			if(nums.now > nums.cache) delta = -1;
			else delta = 1;

			changeSlide(delta);
		});

		target = $("#direct_r");
		target.css({cursor:"pointer"});
		target.click(function()
		{
			if(activeNow) return false;
			
			nums.now++;
			if(nums.now > nums.max) nums.now = 0;
			changeSlide(-1);
		});

		target = $("#direct_l");
		target.css({cursor:"pointer"});
		target.click(function()
		{
			if(activeNow) return false;
			
			nums.now--;
			if(nums.now < 0) nums.now = nums.max;
			changeSlide(1);
		});

		target = $("#scrolldown");
		target.css({cursor:"pointer"});
		target.click(function()
		{
			changeSection(true);
		});

		target = $("#scrollup");
		target.css({cursor:"pointer"});
		target.click(function()
		{
			changeSection(false);
		});
	}

	var wheelHandler = function(e)
	{
		var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
       
        if (delta < 0)
        {
        	if(mode == "detail") return;
        	$(document).unbind(evtWheels, wheelHandler);
        	changeSection(true);
        }
        else
        {
        	if(frame == 0 && mode == "detail") 
            {
            	$(document).unbind(evtWheels, wheelHandler);
            	changeSection(false);
            }
        }
	};

	var changeSlide = function(_delta)
	{
		if(activeNow) return false;
		activeNow = true;

		clearInterval(timer);
		$(document).unbind(evtWheels, wheelHandler);

		$("ul#snv_nolist li#snv_no" + (nums.now+1) + " a").addClass("active")
		.animate({opacity:1}, 50, "easeOutSine");
		$("ul#snv_nolist li#snv_no" + (nums.cache+1) + " a").removeClass("active")
		.animate({opacity:0}, 300, "easeOutSine");
		
		var direction;
		if(_delta > 0) direction = 1;
		else if(_delta < 0) direction = -1;
		transition = { inn:"easeInOutQuint", out:"easeInOutQuint" }
		speed = { inn:1600, out:1450 };

		
		if(nums.cache == 0)
		{
			kvbox[nums.cache].find(".kv_bttl img").stop(true,false)
			.animate({opacity:0}, 370, "easeOutSine");
		}
		else
		{
			kvbox[nums.cache].find(".kv_bttl").stop(true,false)
			.animate({opacity:0}, 370, "easeOutSine");
		}

		if(nums.now == 0)
		{
			kvbox[nums.now].find(".kv_bttl img").stop(true,false)
			.css({opacity:0})
			.delay(1800)
			.animate({opacity:1}, 1000, "easeOutSine");
		}
		else
		{
			kvbox[nums.now].find(".kv_bttl").stop(true,false)
			.css({opacity:0})
			.delay(1800)
			.animate({opacity:1}, 1000, "easeOutSine");
		}
		



		
		kvlist[nums.cache].stop(true,false)
		.delay(400)
		.animate({left:100 * direction + "%"}, speed.inn, transition.inn, function()
		{
			$(this).css({display:"none"});
		});

		kvlist[nums.cache]
		.delay(0)
		.find("img.kvscale").stop(true,false)
		.transition({scale:.6}, 1000, "easeInOutCubic");

		kvlist[nums.now].stop(true,false)
		.css({display:"block", left:-100 * direction + "%", opacity:1})
		.delay(500)
		.animate({left:"0%"}, speed.inn, transition.inn);

		kvlist[nums.now]
		.find("img.kvscale").stop(true,false)
		.transition({scale:.6}, 0)
		.delay(1300)
		.transition({scale:1}, 1000, "easeInOutCubic");
		

		
		
		var sdelay = 2600;
		setTimeout(function()
		{	
			setTimeout(function()
			{
				if(mode == "index")
				{
					$(document).bind(evtWheels, wheelHandler);
					startTimer();
				}

				activeNow = false;
				nums.cache = nums.now;
			}, 400);

		}, sdelay-400);
	}

	var changeSection = function(_bool)
	{
		var transition = { inn:"easeInOutQuint", out:"easeInOutQuint" }
		var speed = { inn:1450, out:1000 };

		activeNow = true;

		if(_bool)
		{
			clearInterval(timer);
			randomTextInit();

			$("#mv").stop(true,false)
			.delay(0)
			.animate({top:"-100%"}, speed.inn, transition.inn, function()
			{
				$(this).css({display:"none"});
			});

			$("#detail").stop(true,false)
			.delay(0)
			.animate({top:"0%"}, speed.inn, transition.inn, function()
			{
				$(this).css({position:"absolute"});
				activeNow = false;
				//$(document).bind(evtWheels, wheelHandler);

				$("#dd_txt1").stop(true,false)
				.animate({opacity:1}, 1300, "easeOutQuint");
				$("#dd_txt2").stop(true,false)
				.animate({opacity:1}, 1300, "easeOutQuint");

				mode = "detail";
			});
		}
		else
		{
			mode = "index";

			if(frame > 0) 
			{
				$(safari ? "body" : "html").stop(true,false).animate({scrollTop:0}, speed.out, "easeOutQuint", function()
				{
					backIndex(speed, transition);
				});
			}
			else backIndex(speed, transition);

			startTimer();
		}
	}

	var backIndex = function(_speed, _transition)
	{
		$("#mv").stop(true,false)
		.delay(0)
		.css({display:"block"})
		.animate({top:"0%"}, _speed.out, _transition.out);

		$("#detail").stop(true,false)
		.delay(0)
		.css({position:"fixed"})
		.animate({top:"100%"}, _speed.out, _transition.out, function()
		{
			activeNow = false;
			$(document).bind(evtWheels, wheelHandler);
		});
	}

	var modeChange = function()
	{
		if(winWidth >= 768) 
		{
			if(status == "SP")
			{
				console.log("changeMode : PC");

				mode = "index";
				activeNow = false;
				$(document).bind(evtWheels, wheelHandler);
				startTimer();

				$("#mv").stop(true,false).css({display:"block", position:"fixed", top:"0", left:"0"});
				$("#detail").stop(true,false).css({position:"fixed", top:"100%", left:"0"});
			}
			status = "PC";
		}
		else 
		{
			if(status == "PC")
			{
				console.log("changeMode : SP");

				$(document).unbind(evtWheels, wheelHandler);
				clearInterval(timer);

				$("#mv").stop(true,false).css({display:"none"});
				$("#detail").stop(true,false).css({position:"relative", top:"inherit", left:"inherit"});
			}
			status = "SP";
		}
	}

	function resizeHandler(e) 
	{ 
		winWidth = $(window).width();
		winHeight = $(window).height();

		scrollHandler();

		modeChange();

		var bw = 1360;
		var bh = 760;
		var scale;
		if(winWidth / winHeight > bw / bh) scale = winWidth / bw;
		else scale = winHeight / bh;
		if(scale <= 1) scale = 1;

		if(status == "PC")
		{
			$("#mv").css({height:winHeight + "px"});
			$(".kvimg_inner").css({width:bw * scale + "px", height:bh * scale + "px", marginTop:-(bh * scale)/2 + "px", marginLeft:-(bw * scale)/2 + "px", top:"50%", left:"50%"});
		}
		else if(status == "SP")
		{
			
		}

		scrollHandler();
	}

	function scrollHandler(e)
	{
		frame = $(window).scrollTop();
		
		if(status == "PC")
		{
			if(mode == "detail" && frame == 0)
			{
				changeSection(false);
			}
		}
		else if(status == "SP")
		{
			
		}
	}
	
	return { 
			onInit : onInit
		}
})(jQuery);


$(document).ready( function()
{
	
});

$(window).load( function() 
{
	Main.onInit();
});
