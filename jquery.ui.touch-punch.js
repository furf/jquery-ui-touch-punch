
/*!
 * jQuery UI Touch Punch 0.1.2
 *
 * Copyright 2010, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function ($) {

  $.support.touch = typeof Touch === 'object';

  if (!$.support.touch) {
    return;
  }

  var $doc        = $(document),
      mouseProto  = $.ui.mouse.prototype,
      _mouseInit  = mouseProto._mouseInit,
      touchHandled;

  /**
   * Translate a touch event to its corresponding mouse event
   * @param {Object} event A touch event
   * @param {Object} translatedType The corresponding mouse event
   */
  function translateEvent (event, translatedType) {

    var touch = event.originalEvent.changedTouches[0];

    return $.extend(event, {
      type:    'mouse' + translatedType,
      which:   1,
      pageX:   touch.pageX,
      pageY:   touch.pageY,
      screenX: touch.screenX,
      screenY: touch.screenY,
      clientX: touch.clientX,
      clientY: touch.clientY
    });
  }

  /**
   * Handle the jQuery UI widget's touchstart events
   * @param {Object} event The widget element's touchstart event
   */
  function _touchStart (event) {

    // Ignore the event if another widget is already being handled or if the
    // gesture is multi-touch
    if (touchHandled || event.originalEvent.touches.length > 1) {
      return;
    }

    // Set a flag to prevent other widgets from inheriting the touch event
    touchHandled = true;

    var self = this;

    // Trigger a pseudo-mouseover event on the target element
    // @see https://github.com/hconceicao/jquery-ui-touch-punch/commit/d54be9253a432c37abcc007240145ef41aaf0b24
    $(event.target).trigger(translateEvent(event, 'over'));

    // Delegate the touchmove and touchend listeners to the document
    $doc.bind('touchmove.' + self.widgetName, self._touchMove)
        .bind('touchend.' + self.widgetName, self._touchEnd)
        // By triggering mousedown on the document, we fix an error where the
        // mouse widget's touchHandled never got reset because of a missing
        // mousedown event on the root
        // @see https://github.com/fracmak/jquery-ui-touch-punch/commit/622ef1365458c2327b1dd73ed480b26ba49e9d7d
        .trigger('mousedown');

    // Pass the translated touchstart event to the jQuery UI mousedown handler
    self._mouseDown(translateEvent(event, 'down'));
  }

  /**
   * Handle the jQuery UI widget's touchmove events
   * @param {Object} event The document's touchmove event
   */
  function _touchMove (event) {

    var self = this;

    // If the number of touches changes, stop tracking the original gesture
    if (event.originalEvent.touches.length > 1) {
      self._touchEnd(event);
    } else {
      // Pass the translated touchmove event to the jQuery UI mousemove
      // handler
      self._mouseMove(translateEvent(event, 'move'));
    }
  }

  /**
   * Handle the jQuery UI widget's touchend events
   * @param {Object} event The document's touchend event
   */
  function _touchEnd (event) {

    var self = this;

    // Pass the translated touchend event to the jQuery UI mouseup handler
    self._mouseUp(translateEvent(event, 'up'));

    // Remove listeners from document's touchmove and touchend events
    $doc.unbind('touchmove.' + self.widgetName, self._touchMove)
        .unbind('touchend.' + self.widgetName, self._touchEnd);

    // Unset a flag to prevent other widgets from inheriting the touch event
    touchHandled = false;

    // Trigger a pseudo-mouseout event on the target element
    $(event.target).trigger(translateEvent(event, 'out'));
  }

  /**
   * A duck punch of the $.ui.mouse _mouseInit method to support touch events.
   * This method extends the widget with bound touch event handlers that
   * translate touch events to mouse events and pass them to the widget's
   * original mouse event handling methods.
   */
  mouseProto._mouseInit = function () {

    var self = this;

    // Bind the widget's touch event methods to itself to maintain scope when
    // delegating its event handling to other elements
    self._touchStart = $.proxy(_touchStart, self);
    self._touchMove = $.proxy(_touchMove, self);
    self._touchEnd = $.proxy(_touchEnd, self);

    // Delegate the touchstart handler to the widget's element
    self.element.bind('touchstart.' + self.widgetName, self._touchStart);

    // Call the original $.ui.mouse init method
    _mouseInit.call(self);
  };

})(jQuery);
