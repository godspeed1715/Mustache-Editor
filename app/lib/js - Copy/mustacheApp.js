'use strict';

angular.module('mustache', [
  'mustache.services',
  'mustache.directives',
  'mustache.controllers',
  function() {
    'use strict';
  	//Center mustache window on load
	/*
	var windowHeight = window.outerHeight;
	var windowWidth = window.outerWidth;
	var screenResize = true;
	$( document).ready( function () {
		//Set window size and asign to variables``
        intHorizontal = screen.width
        intVertical = screen.height
        //Center screen at startup
        intLeft = (intHorizontal - windowWidth) / 2
      	intTop = (intVertical - windowHeight) / 2
        window.resizeTo(windowWidth,windowHeight)
        window.moveTo(intLeft, intTop)
    });
	*/       
	//Remove Splash screen after load.
	setTimeout(
	  function () {
		$('.mustache-App, #mustache-Main-Container').removeClass('hide');
		$('.splash-container .container').remove();
	  }, 500);
	editors = [];
	ed = 0;
	Array.prototype.remove = function (arrayIndex) {
		this.splice(arrayIndex, 1)
	}
  }
])



