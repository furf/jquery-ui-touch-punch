/*!
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function ($) {

  var pointerEnabled = window.navigator.pointerEnabled
    || window.navigator.msPointerEnabled;

  // Detect touch support
  $.support.touch = 'ontouchend' in document || pointerEnabled;

  // Ignore browsers without touch support
  if (!$.support.touch) {
    return;
  }

  var mouseProto = $.ui.mouse.prototype,
      _mouseInit = mouseProto._mouseInit,
      touchHandled;

  /**
   * Simulate a mouse event based on a corresponding touch event
   * @param {Object} event A touch event
   * @param {String} simulatedType The corresponding mouse event
   */
  function simulateMouseEvent (event, simulatedType) {

    // Ignore multi-touch events
    if ((!pointerEnabled && event.originalEvent.touches.length > 1) || (pointerEnabled && !event.isPrimary)) {
      return;
    }

    event.preventDefault();

    var evt = pointerEnabled ? event.originalEvent : event.originalEvent.changedTouches[0],
        simulatedEvent = document.createEvent('MouseEvents');
    
    // Initialize the simulated mouse event using the touch event's coordinates
    simulatedEvent.initMouseEvent(
      simulatedType,                  // type
      true,                           // bubbles
      true,                           // cancelable
      window,                         // view
      1,                              // detail
      evt.screenX,                    // screenX
      evt.screenY,                    // screenY
      evt.clientX,                    // clientX
      evt.clientY,                    // clientY
      false,                          // ctrlKey
      false,                          // altKey
      false,                          // shiftKey
      false,                          // metaKey
      0,                              // button
      null                            // relatedTarget
    );

    // Dispatch the simulated event to the target element
    event.target.dispatchEvent(simulatedEvent);
  }

  /**
   * Handle the jQuery UI widget's touchstart events
   * @param {Object} event The widget element's touchstart event
   */
  mouseProto._touchStart = function (event) {

    var self = this;

    // Ignore the event if another widget is already being handled
    if (touchHandled || (!pointerEnabled && !self._mouseCapture(event.originalEvent.changedTouches[0]))) {
      return;
    }

    // Set the flag to prevent other widgets from inheriting the touch event
    touchHandled = true;

    // Track movement to determine if interaction was a click
    self._touchMoved = false;

    // Simulate the mouseover event
    simulateMouseEvent(event, 'mouseover');

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');

    // Simulate the mousedown event
    simulateMouseEvent(event, 'mousedown');
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

    // Interaction was not a click
    this._touchMoved = true;

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

      // Simulate the click event
      simulateMouseEvent(event, 'click');
    }

    // Unset the flag to allow other widgets to inherit the touch event
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
    if (pointerEnabled) {
      self.element
        .bind('pointerDown', $.proxy(self, '_touchStart'))
        .bind('pointerMove', $.proxy(self, '_touchMove'))
        .bind('pointerUp', $.proxy(self, '_touchEnd'))
        .bind('MSPointerDown', $.proxy(self, '_touchStart'))
        .bind('MSPointerMove', $.proxy(self, '_touchMove'))
        .bind('MSPointerUp', $.proxy(self, '_touchEnd'));
    } else {
      self.element
        .bind('touchstart', $.proxy(self, '_touchStart'))
        .bind('touchmove', $.proxy(self, '_touchMove'))
        .bind('touchend', $.proxy(self, '_touchEnd'));
    }

    // Call the original $.ui.mouse init method
    _mouseInit.call(self);
  };

})(jQuery);