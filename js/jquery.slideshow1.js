/**
 *	jquery.slideShowbroch (1.0.7)
 * 	by Marcel Eichner (www.marceleichner.de) <love@ephigenia.de>
 *		and charles kline <ckline@discmakers.com>
 *		and juerg langhard@greenbanana.ch <langhard@greenbanana.ch>
 *
 *	This simple slideShowbroch plugin will provide your effect gallery with
 * 	some simple features:
 *
 *	- auto slideShowbroch with repeat and a lot of options
 *	- callback for slide changing (gotoSlide) and slide Clicks (onSlideClick)
 *	- different option variables to configure
 *	- change of slide through clicking numbers, next, prev etc and mouse
 *	  movement over the slides
 *	- text over images possible
 *	- random start slide via { start: 'rnd' }
 *	- start/stop slideShowbroch and read playing status
 *	
 *	learn more about this plugin and other projects at:
 *	http://code.marceleichner.de/project/jquery.slideShowbroch/
 *
 *	Copyright (c) 2009 Marcel Eichner (www.marceleichner.de)
 *	Licensed under the MIT license:
 *	http://www.opensource.org/licenses/mit-license.php
 *
 *	NOTE: This script requires jQuery to work.  Download jQuery at www.jquery.com
 */
(function($){
	
	$.fn.slideShowbrochbroch = function(options) {
		
		// multiple elements
		if (this.length > 1) {
			this.each(function() { $(this).slideShowbrochbroch(options)});
			return this;
		}

		// private vars
		this.defaults = {
			start: 0,		// start index, set to 'random' or 'rnd' to random start
			interval: 3,	// interval, autoplay, set to false for no auto-play, in seconds
			repeat: true,	// repeat at the end
			transition: {
				mode: 'fade',
				speed: 1000
			},
			slideSize: 'auto',	// size for slides (used for mouseover and stuff)
			hoverNavigation:false,	// enable mouse to change images 
			slideClick: false,	// insert callback method for slide clicks
			gotoSlide: false,		// slide change callback
			mousePause: false 	// set to true to stop animation on mouse hover
		};
		this.options = $.extend({}, this.defaults, options);

		// internal vars
		this.numSlides = this.find('.slidebroch').length;
		if (this.options.start == 'random' || this.options.start == 'rnd') {
			this.current = Math.floor(Math.random() * this.numSlides) + 1;
		} else {
			this.current = this.options.start;
		}
		if (this.current >= this.numSlides) {
			this.current = this.numSlides - 1;
		}
		this.last = false;
		this.elm = $(this);
		this.interval = false;
		this.mouse = {
			x: 0,		// store mouse x relative position on element
			y: 0,		// store mouse y relative position on element
			over: false	// store mouse over boolena value
		};
		
		// init slideShowbroch
		this.init = function() {
			
			// set slide container to correct width and height
			if (this.find('.slidesbroch').length) {
				// auto-detect slide size
				if (this.options.slideSize == 'auto') {
					this.options.slideSize = {
						width: this.find('.slidebroch:first img').width(),
						height: this.find('.slidebroch:first img').height()
					};
				}
				
				// don't set size of slides and slide container if not needed
				if (this.options.slideSize != 'none' && this.options.slideSize != false) {
					this.find('.slidesbroch').css({
						height: this.options.slideSize.height + 'px',
						width: this.options.slideSize.width + 'px',
						overflow: 'hidden'
					});
				}
			}
			
			// set slides to be positioned absolute
			this.find('.slidebroch').css('position', 'absolute');
			// hide slides if not hidden allready
			this.find('.slidebroch:not(:eq(' + this.current + '))').hide();
			
			// navigation shortcuts
			this.find('.first, .next, .prev, .last, .navigation, .slidebroch, .page, .slidesbroch').data('slideShowbrochbroch', this);
			this.find('.first').click(this.first);
			this.find('.next').click(this.next);
			this.find('.prev').click(this.previous);
			this.find('.last').click(this.last);
			
			// init pagínation buttons if available
			this.find('.navigation .page:eq(' + this.current + ')').addClass('selected');
			this.find('.page').click(function(e) {
				if (!(slideShowbrochbroch = $(this).data('slideShowbrochbroch'))) {
					var slideShowbrochbroch = this;
				}
				// determine position in navigation
				var index = $(this).html();
				if (!(index = parseInt($(this).html()-1))) {
					var index = $(this).parents('.navigation').find('.page').index($(this));
				}
				e.preventDefault();
				slideShowbrochbroch.gotoSlide(index);
			});
			
			// init mouse move handler
			this.find('.slidebroch').mousemove(function(event) {
				var slideShowbrochbroch = $(this).data('slideShowbrochbroch');
				// calculate mouse relative position and store it
				slideShowbrochbroch.mouse.x = Math.abs(event.clientX - $(this).position().left);
				slideShowbrochbroch.mouse.y = Math.abs(event.clientY - $(this).position().top);
				if (slideShowbrochbroch.mouse.x > slideShowbrochbroch.options.slideSize.width) slideShowbrochbroch.mouse.x = slideShowbrochbroch.options.slideSize.width;
				if (slideShowbrochbroch.mouse.y > slideShowbrochbroch.options.slideSize.height) slideShowbrochbroch.mouse.y = slideShowbrochbroch.options.slideSize.height;
				// use mouse vor navigation, calculate new page from mouse position
				if (slideShowbrochbroch.options.hoverNavigation) {
					var index = Math.round((slideShowbrochbroch.numSlides - 1) * slideShowbrochbroch.mouse.x / slideShowbrochbroch.options.slideSize.width);
					slideShowbrochbroch.gotoSlide(index, true);
				}
			});
			
			// mouse enter handler
			this.find('.slidebroch').mouseenter(function() {
				var slideShowbrochbroch = $(this).data('slideShowbrochbroch');
				slideShowbrochbroch.mouse.over = true;
				if (!slideShowbrochbroch.options.mousePause){ // added conditional for mouse pausing animation
				    slideShowbrochbroch.stopAuto();
				}
			});
			
			// mouse leave handler
			this.find('.slidebroch').mouseleave(function() {
				var slideShowbrochbroch = $(this).data('slideShowbroch');
				slideShowbroch.mouse.over = false;
				slideShowbroch.auto();
			});
			
			// on click handler
			if (typeof(this.options.slideClick) == 'function') {
				this.find('.slidebroch').click(function() {
					var slideShowbroch = $(this).data('slideShowbroch');
					slideShowbroch.options.slideClick(slideShowbroch);
				});
			}

			var g = this.current;
			this.current = -1;
			this.gotoSlide(g);
			// start interval for auto animation
			if (this.options.interval > 0) {
				this.auto();
			}
			return this;
		};
		
		// public methods
		this.auto = function() {
			if (!(slideShowbroch = $(this).data('slideShowbroch'))) {
				var slideShowbroch = this;
			}
			if (!slideShowbroch.interval && slideShowbroch.options.interval > 0.001) {
				slideShowbroch.interval = window.setInterval(function() {
					slideShowbroch.next();
				}, slideShowbroch.options.interval * 1000);
			}
			return this;
		}
		// check if slideShowbroch is running
		this.isPlaying = function() {
			if (!(slideShowbroch = $(this).data('slideShowbroch'))) {
				var slideShowbroch = this;
			}
			return slideShowbroch.interval;
		}
		// stop/play slideShowbroch automatic 
		this.togglePlayback = function() {
			if (!(slideShowbroch = $(this).data('slideShowbroch'))) {
				var slideShowbroch = this;
			}
			if (slideShowbroch.isPlaying()) {
				slideShowbroch.stopAuto();
			} else {
				slideShowbroch.auto();
			}
		},
		// stop automatic slideShowbroch
		this.stopAuto = function() {
			if (!(slideShowbroch = $(this).data('slideShowbroch'))) {
				var slideShowbroch = this;
			}
			if (slideShowbroch.interval) {
				window.clearInterval(slideShowbroch.interval);
				slideShowbroch.interval = false;
			}
			return this;
		}
		// goto first slide
		this.first = function(elm) {
			if (!(slideShowbroch = $(this).data('slideShowbroch'))) {
				var slideShowbroch = this;
			}
			return slideShowbroch.gotoSlide(0);
		};
		// goto last slide
		this.next = function() {
			if (!(slideShowbroch = $(this).data('slideShowbroch'))) {
				var slideShowbroch = this;
			}
			return slideShowbroch.gotoSlide(slideShowbroch.current + 1);
		};
		this.previous = function() {
			if (!(slideShowbroch = $(this).data('slideShowbroch'))) {
				var slideShowbroch = this;
			}
			return slideShowbroch.gotoSlide(slideShowbroch.current - 1);
		};
		this.last = function() {
			if (!(slideShowbroch = $(this).data('slideShowbroch'))) {
				var slideShowbroch = this;
			}
			return slideShowbroch.gotoSlide(slideShowbroch.numSlides);
		};
		this.gotoSlide = function(index, noanimation) {
			if (index < 0) {
				index = this.numSlides - 1;
			}
			if (index >= this.numSlides) {
				index = 0;
			}
			if (index === this.current) return this;
			// get slide elements
			var oldSlide = this.find('.slidebroch:eq(' + this.current +')');
			var newSlide = this.find('.slidebroch:eq(' + index +')');
			// callbacks for animation finished
			var oldFinished = function () {
				$(this).removeClass('selected');
				if (!(slideShowbroch = $(this).data('slideShowbroch'))) {
					var slideShowbroch = this;
				}
				slideShowbroch.elm.find('.navigation .page:eq(' + slideShowbroch.current + ')').addClass('selected');
				if (!slideShowbroch.mouse.over) {
					slideShowbroch.auto();
				}
			}
			var newFinished = function() {
				if (!(slideShowbroch = $(this).data('slideShowbroch'))) {
					var slideShowbroch = this;
				}
				if (slideShowbroch.current >= 0) {
					slideShowbroch.elm.find('.navigation .page:not(:eq(' + slideShowbroch.current + '))').removeClass('selected');
				}
				$(this).addClass('selected');
			}
			// get slideShowbroch
			if (!(slideShowbroch = $(this).data('slideShowbroch'))) {
				var slideShowbroch = this;
			}
			slideShowbroch.stopAuto();
			// call callback
			if (typeof(this.options.gotoSlide) == 'function') {
				this.options.gotoSlide(slideShowbroch, index);
			}
			// start transition
			if (noanimation) {
				oldSlide.hide(1, oldFinished);
				newSlide.show(1, newFinished);
			} else {
				if (typeof(this.options.transition.mode) == 'function') {
					this.call(this.options.transition.mode, newSlide, oldSlide);
				} else {
					switch(this.options.transition.mode) {
						default:
						case 'fade':
							oldSlide.fadeOut(this.options.transition.speed, oldFinished);
							newSlide.fadeIn(this.options.transition.speed, newFinished);
							break;
						case 'slidebroch': // added by charles kline - ckline@discmakers.com
							if (this.current == -1) {
								oldSlide.hide(0, oldFinished);
								newSlide.show();
							} else {
								oldSlide.animate({},{});
								oldSlide.animate({width: 'hide'}, this.options.transition.speed, oldFinished);
								newSlide.animate({width: 'show'}, this.options.transition.speed, newFinished);
							}
							break;
						case 'slidebroch2': // added by juerg langhard - langhard@greenbanana.ch
							if (this.current == -1) {
								oldSlide.hide(0, oldFinished);
								newSlide.show();
							} else {
								oldSlide.animate({},{});
								oldSlide.animate({left: '-'+oldSlide.width()+'px'}, this.options.transition.speed, oldFinished);
								newSlide.show();
								newSlide.css('left', oldSlide.width()+'px');
								newSlide.animate({left: '0px'}, this.options.transition.speed, newFinished);
							}
							break;
					}
				}
			}
			// alter height of slides to new slide height
			this.find('.slidesbroch').animate({
				height: newSlide.height()
			});
			
			this.last = this.current;
			this.current = index;
			return this;
		};
		
		return this.init();
	}
	
})(jQuery);