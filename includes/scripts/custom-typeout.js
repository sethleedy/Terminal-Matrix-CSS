'use strict';

// Object to use to make text "type out"
class objTypeOut {
	//"use strict";

	// Setup the object on New use.
	constructor(strPassedElement = ".typeOut") {

		console.log("Loaded Object TypeOut");
		if (strPassedElement == ".typeOut") {
			console.log("Using default class of '.typeOut'.");
		} else {
			console.log("Using class of '" + strPassedElement + "'.");
		}

		// Set some defaults
		this.cursorLength = 1; // Internal use.
		this.strTypeElement = strPassedElement; // Carries the element to apply the effect to or use the "typeOut" class as a default.
		//this.blnStrUseSound = true;
		this.blnEnableCursor = true; // We can switch off the blinking cursor before starting or even mid way.
		this.blnAutoRemoveCursor = true; // 15 seconds after we are done typing, remove the blinking cursor, or not.
		this.blnAudioEffect = true; // Stop any audio playback if requested by flipping the boolean blnAudioEffect to false
		this.myAudio = new Audio('includes/scripts/teletype.wav');
		this.intTypingDelaySpeed = 60;
		this.strCursorHTML = '<span class="cursor">|</span>';
		this.intExecCount = -1;


		if (this.blnEnableCursor == true) {
			//			console.log("blink");
			//			console.log(this);

			var objSelf = this;
			var intCursor = setInterval(this.cursorAnimation, 1000);
		} else {
			// If we switch it off mid way, clear out the Interval
			clearInterval(intCursor);
		}
	}

	// Show a blinking cursor
	cursorAnimation() {
		//console.log("blink2");

		$('.cursor').animate({
			opacity: 0
		}, 'slow', 'swing').animate({
			opacity: 1
		}, '1200', 'swing');
	}

	stopAudio() {
		console.log("Stopping Audio");
		this.myAudio.pause();
	}

	// Parse the items to be typed and feed it to the working function
	startTyping() {

		var objSelf = this;

		this.intExecCount = $(this.strTypeElement).length;

		$(this.strTypeElement).each(function () {

			var newContent = $(this);
			var orgString = $(this).html();

			//alert(newContent.html());

			setTimeout(objSelf.typeContent, 10, newContent, orgString, objSelf);
		});


	}

	// Do the work of typing
	typeContent(content, orgString, objSelf) {

		// Stop any audio playback if requested by flipping the boolean blnAudioEffect to false
		if (objSelf.blnAudioEffect == false && objSelf.myAudio.paused == false) {
			console.log("Stopping Playback1");
			objSelf.stopAudio();
		}

		// Start sound effect if enabled.
		if (objSelf.blnAudioEffect == true && objSelf.myAudio.paused == true) {
			objSelf.myAudio.loop = true;
			console.log("Starting Audio");
			objSelf.myAudio.play();
		}

		// Add another charactor.
		content.html(orgString.substr(0, objSelf.cursorLength++));

		var contentString = content.html();
		var tmpCopy = $(content).find(objSelf.strTypeElement + "> .cursor").remove().end().html(); // Remove the cursor we added to get a correct length.
		//console.log("TMP C" + tmpCopy);
		var contentStringLength = tmpCopy.length;

		// Add the blinking cursor
		if (objSelf.blnEnableCursor == true) {
			content.append(objSelf.strCursorHTML);
		}

		// Check and see if we are done typing
		if (contentStringLength < orgString.length) {
			//console.log(content.text());
			setTimeout(objSelf.typeContent, objSelf.intTypingDelaySpeed, content, orgString, objSelf);
		} else {
			// Remove the blinking cursor by default.
			if (objSelf.blnAutoRemoveCursor) {
				setTimeout(objSelf.removeCursor, 15000, objSelf);
			}

			// Reduce the count of exec threads
			objSelf.intExecCount--;

			// Stop any audio playback
			if (objSelf.myAudio.paused == false && objSelf.intExecCount == 0) {
				console.log("Stopping Playback2");
				objSelf.stopAudio();
			}
		}
	}

	// Remove the blinking cursor. By default, called after the typing is done
	removeCursor(objSelf) {
		console.log("Removing Cursor from: " + objSelf.strTypeElement);
		//console.log(objSelf);

		// Find within the current this.strTypeElement and remove only that .cursor class

		$(objSelf.strTypeElement + "> .cursor").remove()
	}

}


//function testErasingEffect() {
//	caption = captionEl.html();
//	captionLength = caption.length;
//	if (captionLength > 0) {
//		erase();
//	} else {
//		$('#caption').html("You didn't write anything to erase, but that's ok!");
//		setTimeout('testErasingEffect()', 1000);
//	}
//}
//
//function erase() {
//	captionEl.html(caption.substr(0, captionLength--));
//	if (captionLength >= 0) {
//		setTimeout('erase()', this.intTypingDelaySpeed);
//	} else {
//		captionLength = 0;
//		caption = '';
//	}
//}