/*!
 * jQuery UI Touch Punch 0.1.0
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
      _mouseDown  = mouseProto._mouseDown,
      _mouseUp    = mouseProto._mouseUp;

  function translateTouchEventToMouseEvent (event, translatedType) {

    var touch = event.originalEvent.changedTouches[0];

    return $.extend(event, {
      type:    translatedType,
      which:   1,
      pageX:   touch.pageX,
      pageY:   touch.pageY,
      screenX: touch.screenX,
      screenY: touch.screenY,
      clientX: touch.clientX,
      clientY: touch.clientY
    });
  }

  mouseProto._mouseInit = function () {

    var self = this;

    self.element.bind('touchstart.' + self.widgetName, function (event) {
      return self._mouseDown(translateTouchEventToMouseEvent(event, 'mousedown'));
    });

    self._touchMoveDelegate = function (event) {
      return self._mouseMove(translateTouchEventToMouseEvent(event, 'mousemove'));
    };
    
    self._touchEndDelegate = function(event) {
      return self._mouseUp(translateTouchEventToMouseEvent(event, 'mouseup'));
    };

    _mouseInit.call(self);
  };

  mouseProto._mouseDown = function (event) {

    var self = this,
        ret  = _mouseDown.call(self, event);
 
    $doc
      .bind('touchmove.' + self.widgetName, self._touchMoveDelegate)
      .bind('touchend.' + self.widgetName, self._touchEndDelegate);

    return ret;
  };

  mouseProto._mouseUp = function (event) {

    var self = this;

    $doc
      .unbind('touchmove.' + self.widgetName, self._touchMoveDelegate)
      .unbind('touchend.' + self.widgetName, self._touchEndDelegate);

    return _mouseUp.call(self, event);
  };

})(jQuery);
