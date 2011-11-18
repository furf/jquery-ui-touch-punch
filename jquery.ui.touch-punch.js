/*!
 * jQuery UI Touch Punch 0.1.1
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

      // fix an error where the mouse widget's mouseHandled never got reset
      // because of a missing mousedown event on the root
      // https://github.com/fracmak/jquery-ui-touch-punch/commit/622ef1365458c2327b1dd73ed480b26ba49e9d7d
      // triggering mousedown on document
      // https://github.com/hconceicao/jquery-ui-touch-punch/commit/d54be9253a432c37abcc007240145ef41aaf0b24
      $doc.trigger('mousedown');

      // triggering mouseover on the target
      // https://github.com/hconceicao/jquery-ui-touch-punch/commit/d54be9253a432c37abcc007240145ef41aaf0b24
      $(event.target).trigger(translateTouchEventToMouseEvent(event, 'mouseover'));

      return self._mouseDown(translateTouchEventToMouseEvent(event, 'mousedown'));
    });

    self._touchMoveDelegate = function (event) {
      return self._mouseMove(translateTouchEventToMouseEvent(event, 'mousemove'));
    };
    
    self._touchEndDelegate = function(event) {
      $(event.target).trigger(translateTouchEventToMouseEvent(event, 'mouseout'));
      return self._mouseUp(translateTouchEventToMouseEvent(event, 'mouseup'));
    };

    _mouseInit.call(self);
  };

  mouseProto._mouseDown = function (event) {

    // fix an error where cascading touch handlers aren't handled correctly,
    // this patch first checks if the event has already been handled before
    // triggering the code
    // https://github.com/fracmak/jquery-ui-touch-punch/commit/578ed6f1303a67e9205c9aca4b6f593cc8032fda
    if (event.isDefaultPrevented()){
      return;
    }

    var self = this,
        ret  = _mouseDown.call(self, event);

    // Prevent default in versions of jQuery UI < 1.8.6
    event.preventDefault();
 
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
