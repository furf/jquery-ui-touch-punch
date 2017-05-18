/*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function ($) {

  // Detect touch support
  $.support.touch = 'ontouchend' in document;

  // Ignore browsers without touch support
  if (!$.support.touch) {
    return;
  }

  var mouseProto = $.ui.mouse.prototype,
      _mouseInit = mouseProto._mouseInit,
      _mouseDestroy = mouseProto._mouseDestroy,
      touchHandled, touchTimer,
      dragIgnoreTime = 150, // When dragging less than 150ms we see it as a tap
      dragIgnoreDistance = 5, // When dragging less than 10px we see it as a tap unless longer than dragIgnoreTime
      longTapTime = 750; // LongTap tie in ms

  /**
   * Simulate a mouse event based on a corresponding touch event
   * @param {Object} event A touch event
   * @param {String} simulatedType The corresponding mouse event
   */
  function simulateMouseEvent (event, simulatedType) {

    // Ignore multi-touch events
    if (event.originalEvent.touches.length > 1) {
      return;
    }

    event.preventDefault();

    var touch = event.originalEvent.changedTouches[0],
        simulatedEvent = document.createEvent('MouseEvents');
    
    // Initialize the simulated mouse event using the touch event's coordinates
    // Make sure that the container of droppables has position: relative to make dragging work when zoomed in
    simulatedEvent.initMouseEvent(
      simulatedType,    // type
      true,             // bubbles
      true,             // cancelable
      window,           // view
      1,                // detail
      touch.screenX,    // screenX
      touch.screenY,    // screenY
      touch.clientX + $(window).scrollLeft(),    // clientX + scrollLeft - fix for zoomed devices while dragging
      touch.clientY + $(window).scrollTop(),    // clientY + scrollTop - fix for zoomed devices while dragging
      false,            // ctrlKey
      false,            // altKey
      false,            // shiftKey
      false,            // metaKey
      0,                // button
      null              // relatedTarget
    );

    // Dispatch the simulated event to the target element
    event.target.dispatchEvent(simulatedEvent);
  }

  /**
   * Handle the jQuery UI widget's touchstart events
   * @param {Object} event The widget element's touchstart event
   */
  mouseProto._touchStart = function (event) {

    var self = this,
      touch = event.originalEvent.changedTouches[0];

    // Track movement to determine if interaction was a click
    self._touchMoved = false;
    self._touchStartTime = new Date().getTime();
    self._touchStartX = touch.clientX;
    self._touchStartY = touch.clientY;

    // Ignore the event if another widget is already being handled
    if (touchHandled || !self._mouseCapture(touch)) {
      return;
    }

    // Set the flag to prevent other widgets from inheriting the touch event
    touchHandled = true;

    // Simulate the mouseover event
    simulateMouseEvent(event, 'mouseover');

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');

    // Simulate the mousedown event
    simulateMouseEvent(event, 'mousedown');

    // Start longTap timer
    touchTimer = setTimeout(function () {
      if (!self._touchMoved) {
        event.longTap = true;
        self._touchEnd(event);
      }
    }, longTapTime);
  };

  /**
   * Handle the jQuery UI widget's touchmove events
   * @param {Object} event The document's touchmove event
   */
  mouseProto._touchMove = function (event) {
    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Check if interaction was a click or a drag
    var touch = event.originalEvent.changedTouches[0];
    var holdingDownTime = new Date().getTime() - this._touchStartTime,
      movedX = Math.abs(touch.clientX - this._touchStartX),
      movedY = Math.abs(touch.clientY - this._touchStartY);
    if (holdingDownTime > dragIgnoreTime || movedX > dragIgnoreDistance || movedY > dragIgnoreDistance) {
      this._touchMoved = true;
    }

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');
  };

  /**
   * Handle the jQuery UI widget's touchend events
   * @param {Object} event The document's touchend event
   */
  mouseProto._touchEnd = function (event) {
    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Simulate the mouseup event
    simulateMouseEvent(event, 'mouseup');

    // Simulate the mouseout event
    simulateMouseEvent(event, 'mouseout');

    // If the touch interaction did not move, it should trigger a click
    if (!this._touchMoved) {

      // Check if it was a long tap or regular tap
      if (event.longTap) {
        // Simulate the right-click event
        simulateMouseEvent(event, 'contextmenu');

      } else {
        // Simulate the click event
        simulateMouseEvent(event, 'click');
      }
    }

    // Unset the flag to allow other widgets to inherit the touch event
    clearTimeout(touchTimer);
    touchHandled = false;
  };

  /**
   * A duck punch of the $.ui.mouse _mouseInit method to support touch events.
   * This method extends the widget with bound touch event handlers that
   * translate touch events to mouse events and pass them to the widget's
   * original mouse event handling methods.
   */
  mouseProto._mouseInit = function () {

    var self = this;

    // Delegate the touch handlers to the widget's element
    self.element.bind({
      touchstart: $.proxy(self, '_touchStart'),
      touchmove: $.proxy(self, '_touchMove'),
      touchend: $.proxy(self, '_touchEnd')
    });

    // Call the original $.ui.mouse init method
    _mouseInit.call(self);
  };

  /**
   * Remove the touch event handlers
   */
  mouseProto._mouseDestroy = function () {

    var self = this;

    // Delegate the touch handlers to the widget's element
    self.element.unbind({
      touchstart: $.proxy(self, '_touchStart'),
      touchmove: $.proxy(self, '_touchMove'),
      touchend: $.proxy(self, '_touchEnd')
    });

    // Call the original $.ui.mouse destroy method
    _mouseDestroy.call(self);
  };

})(jQuery);
