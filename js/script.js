var initPageSpeed = 100,
	initFontSize = 60,
	scrollDelay,
	textColor = '#ffffff',
	backgroundColor = '#141414',
	timer = $('.clock').timer({ stopVal: 10000 });

$(function() { // clone of $( document ).ready(function() {

	// Check if we've been here before and made changes
	if(localStorage.getItem('teleprompter_font_size'))
	{
		initFontSize = localStorage.getItem('teleprompter_font_size');
	}
	if(localStorage.getItem('teleprompter_speed'))
	{
		initPageSpeed = localStorage.getItem('teleprompter_speed');
	}
	if(localStorage.getItem('teleprompter_text'))
	{
		//$('#teleprompter').html(localStorage.getItem('teleprompter_text'));
		setTimeout(function(){$('#teleprompter').html(localStorage.getItem('teleprompter_text'))},1);  //not sure why this has to be inside a timeout, but it does, otherwise lines get appended to the top and bottom of the text.
	}
	if(localStorage.getItem('teleprompter_text_color'))
	{
		textColor = localStorage.getItem('teleprompter_text_color');
		$('#text-color').val(textColor);
		$('#text-color-picker').css('background-color', textColor);
		$('#teleprompter').css('color', textColor);
	}
	if(localStorage.getItem('teleprompter_background_color'))
	{
		backgroundColor = localStorage.getItem('teleprompter_background_color');
		$('#background-color').val(backgroundColor);
		$('#background-color-picker').css('background-color', textColor);
		$('#teleprompter').css('background-color', backgroundColor);
	}
	else
	{
		clean_teleprompter();
	}

	// Listen for Key Presses
	$('#teleprompter').keyup(update_teleprompter);
	$('body').keydown(navigate);


	// Setup GUI
	$('article').stop().animate({scrollTop: 0}, 100, 'linear', function(){ $('article').clearQueue(); });
	$('.marker, .overlay').fadeOut(0);
	$('article .teleprompter').css({
		'padding-bottom': Math.ceil($(window).height()-$('header').height()) + 'px'
	});

	// Create Font Size Slider
	$('.font_size').slider({
		min: 12,
		max: 120,
		value: initFontSize,
		orientation: "horizontal",
		range: "min",
		animate: true,
		slide: function(){ fontSize(true); },
		change: function(){ fontSize(true); }
	});

	// Create Speed Slider
	$('.speed').slider({
		min: 0,
		max: 200,
		value: initPageSpeed,
		orientation: "horizontal",
		range: "min",
		animate: true,
		slide: function(){ speed(true); },
		change: function(){ speed(true); }
	});
	
	$('#text-color').change(function(){
		var color = $(this).val();
		$('#teleprompter').css('color', color);
		localStorage.setItem('teleprompter_text_color', color);
	});
	$('#background-color').change(function(){
		var color = $(this).val();
		$('#teleprompter').css('background-color', color);
		localStorage.setItem('teleprompter_background_color', color);
	});

	// Run initial configuration on sliders
	fontSize(false);
	speed(false);

	// Listen for Play Button Click
	$('.button.play').click(function(){
		if($(this).hasClass('icon-play'))
		{
			start_teleprompter();
		}
		else
		{
			stop_teleprompter();
		}
		refocusWindow();
	});
	// Listen for FlipX Button Click
	$('.button.flipx').click(function(){
		if($('.teleprompter').hasClass('flipy'))
		{
			$('.teleprompter').removeClass('flipy').toggleClass('flipxy');
		}
		else
		{
			$('.teleprompter').toggleClass('flipx');
		}
		refocusWindow();
	});
	// Listen for FlipY Button Click
	$('.button.flipy').click(function(){
		if($('.teleprompter').hasClass('flipx'))
		{
			$('.teleprompter').removeClass('flipx').toggleClass('flipxy');
		}
		else
		{
			$('.teleprompter').toggleClass('flipy');
		}
		refocusWindow();
	});
	// Listen for Reset Button Click
	$('.button.reset').click(function(){
		stop_teleprompter();
		timer.resetTimer();
		$('article').stop().animate({scrollTop: 0}, 100, 'linear', function(){ $('article').clearQueue(); });
		refocusWindow();
	});
});

// Refocus body so keystrokes work after a button is hit

function refocusWindow()
{
    //window.focus();
    if (document.activeElement) {
        document.activeElement.blur();
    }
    //$("#teleprompter").focus();
}

// Manage Font Size Change
function fontSize(save_local)
{
	initFontSize = $('.font_size').slider( "value" );

	$('article .teleprompter').css({
		'font-size': initFontSize + 'px',
		'line-height': Math.ceil(initFontSize * 1.5) + 'px',
		'padding-bottom': Math.ceil($(window).height()-$('header').height()) + 'px'
	});

	$('article .teleprompter p').css({
		'padding-bottom': Math.ceil(initFontSize * 0.25) + 'px',
		'margin-bottom': Math.ceil(initFontSize * 0.25) + 'px'
	});

	$('label.font_size_label span').text('(' + initFontSize + ')');

	if(save_local)
	{
		localStorage.setItem('teleprompter_font_size', initFontSize);
	}
}

// Manage Speed Change
function speed(save_local)
{
	initPageSpeed = Math.floor(200 - $('.speed').slider('value'));
	$('label.speed_label span').text('(' + $('.speed').slider('value') + ')');

	if(save_local)
	{
		localStorage.setItem('teleprompter_speed', $('.speed').slider('value'));
	}
}

// Manage Scrolling Teleprompter
function pageScroll()
{
	if ($('.speed').slider('value') >0){
	        $('article').animate({scrollTop: "+=2px" }, 0, 'linear', function(){ $('article').clearQueue(); });
	    }
	clearTimeout(scrollDelay);
	scrollDelay = setTimeout(pageScroll, initPageSpeed);

	// We're at the bottom of the document, stop
	if($("article").scrollTop() >= ( ( $("article")[0].scrollHeight - $(window).height() ) - 100 ))
	{
		stop_teleprompter();
		setTimeout(function(){
			$('article').stop().animate({scrollTop: 0}, 500, 'swing', function(){ $('article').clearQueue(); });
		}, 500);
	}
}

// Listen for Key Presses on Body
function navigate(evt)
{
 
	var space = 32,
		escape = 27,
		left = 37,
		up = 38,
		right = 39,
		down = 40,
		plus = 187,
		minus = 189,
		speed = $('.speed').slider('value'),
		font_size = $('.font_size').slider('value');

	// Exit if we're inside an input field
	if (typeof evt.target.id == 'undefined' || evt.target.id == 'teleprompter')
	{
		return;
	}
	else if (typeof evt.target.id == 'undefined' || evt.target.id != 'gui')
	{
		evt.preventDefault();
		evt.stopPropagation();
		return false;
	}

	// Reset GUI
	
	if(evt.keyCode == escape)
	{
		$('.button.reset').trigger('click');
		evt.preventDefault();
		evt.stopPropagation();
		return false;
	}
	// Start Stop Scrolling
	else if(evt.keyCode == space)
	{
		$('.button.play').trigger('click');
		evt.preventDefault();
		evt.stopPropagation();
		return false;
	}
	// Decrease Speed with Left Arrow
	else if(evt.keyCode == left)
	{
		$('.speed').slider('value', speed-5);
		evt.preventDefault();
		evt.stopPropagation();
		return false;
	}
	// Decrease Font Size with Minus
	else if(evt.keyCode == minus)
	{
		$('.font_size').slider('value', font_size-1);
		evt.preventDefault();
		evt.stopPropagation();
		return false;
	}
	// Increase Font Size with Plus or Equals
	else if(evt.keyCode == plus)
	{
		$('.font_size').slider('value', font_size+1);
		evt.preventDefault();
		evt.stopPropagation();
		return false;
	}
	// Increase Speed with Right Arrow
	else if(evt.keyCode == right)
	{
		$('.speed').slider('value', speed+5);
		evt.preventDefault();
		evt.stopPropagation();
		return false;
	}
    //go back a little. Only present since there's weird focus things happening where the up button doesn't do the right thing unless you manually click the scrollbar or teleprompter div
	else if(evt.keyCode == up)  
	{
   $('article').animate({scrollTop: "-=100px" }, 200, 'linear', function(){ $('article').clearQueue(); });
		evt.preventDefault();
		evt.stopPropagation();
		return false;
	}
    //go foreward a little. Only present since there's weird focus things happening where the up button doesn't do the right thing unless you manually click the scrollbar or teleprompter div
	else if(evt.keyCode == down)  
	{
   $('article').animate({scrollTop: "+=100px" }, 200, 'linear', function(){ $('article').clearQueue(); });
		evt.preventDefault();
		evt.stopPropagation();
		return false;
	}
}

// Start Teleprompter
function start_teleprompter()
{
	$('#teleprompter').attr('contenteditable', false);
	$('body').addClass('playing');
	$('.button.play').removeClass('icon-play').addClass('icon-pause');
	//$('header h1, header nav').fadeTo('slow', 0.15);
	//$('.marker, .overlay').fadeIn('slow');

	window.timer.resetTimer();
	window.timer.startTimer();

	pageScroll();
}

// Stop Teleprompter
function stop_teleprompter()
{
	clearTimeout(scrollDelay);
	$('#teleprompter').attr('contenteditable', true);
	$('header h1, header nav').fadeTo('slow', 1);
	$('.button.play').removeClass('icon-pause').addClass('icon-play');
	$('.marker, .overlay').fadeOut('slow');
	$('body').removeClass('playing');

	window.timer.stopTimer();
}

// Update Teleprompter
function update_teleprompter()
{
	localStorage.setItem('teleprompter_text', $('#teleprompter').html());
}

// Clean Teleprompter
function clean_teleprompter()
{
	var text = $('#teleprompter').html();
		text = text.replace(/<br>+/g,'@@').replace(/@@@@/g,'</p><p>');
		text = text.replace(/@@/g, '<br>');
		text = text.replace(/([a-z])\. ([A-Z])/g, '$1.&nbsp;&nbsp; $2');
		text = text.replace(/<p><\/p>/g, '');

	if(text.substr(0,3) !== '<p>')
	{
		text = '<p>' + text + '</p>';
	}

	$('#teleprompter').html(text);
}

/*
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function(b){b.support.touch="ontouchend" in document;if(!b.support.touch){return;}var c=b.ui.mouse.prototype,e=c._mouseInit,a;function d(g,h){if(g.originalEvent.touches.length>1){return;}g.preventDefault();var i=g.originalEvent.changedTouches[0],f=document.createEvent("MouseEvents");f.initMouseEvent(h,true,true,window,1,i.screenX,i.screenY,i.clientX,i.clientY,false,false,false,false,0,null);g.target.dispatchEvent(f);}c._touchStart=function(g){var f=this;if(a||!f._mouseCapture(g.originalEvent.changedTouches[0])){return;}a=true;f._touchMoved=false;d(g,"mouseover");d(g,"mousemove");d(g,"mousedown");};c._touchMove=function(f){if(!a){return;}this._touchMoved=true;d(f,"mousemove");};c._touchEnd=function(f){if(!a){return;}d(f,"mouseup");d(f,"mouseout");if(!this._touchMoved){d(f,"click");}a=false;};c._mouseInit=function(){var f=this;f.element.bind("touchstart",b.proxy(f,"_touchStart")).bind("touchmove",b.proxy(f,"_touchMove")).bind("touchend",b.proxy(f,"_touchEnd"));e.call(f);};})(jQuery);
