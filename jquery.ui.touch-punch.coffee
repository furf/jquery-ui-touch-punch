###!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
###

do($ = jQuery) ->
  # Detect touch support
  $.support.touch = 'ontouchend' of document

  # Ignore browsers without touch support
  if !$.support.touch then return

  mouseProto = $.ui.mouse.prototype
  _mouseInit = mouseProto._mouseInit
  _mouseDestroy = mouseProto._mouseDestroy
  touchHandled = undefined

  ###*
  # Simulate a mouse event based on a corresponding touch event
  # @param {Object} event A touch event
  # @param {String} simulatedType The corresponding mouse event
  ###
  simulateMouseEvent = (event, simulatedType) ->
    # Ignore multi-touch events
    if event.originalEvent.touches.length > 1 then return

    event.preventDefault()

    touch = event.originalEvent.changedTouches[0]
    simulatedEvent = document.createEvent('MouseEvents')

    # Initialize the simulated mouse event using the touch event's coordinates
    simulatedEvent.initMouseEvent(
      simulatedType,    # type
      true,             # bubbles
      true,             # cancelable
      window,           # view
      1,                # detail
      touch.screenX,    # screenX
      touch.screenY,    # screenY
      touch.clientX,    # clientX
      touch.clientY,    # clientY
      false,            # ctrlKey
      false,            # altKey
      false,            # shiftKey
      false,            # metaKey
      0,                # button
      null              # relatedTarget
    )

    # Dispatch the simulated event to the target element
    event.target.dispatchEvent simulatedEvent
    return # END simulateMouseEvent


  ###*
  # Handle the jQuery UI widget's touchstart events
  # @param {Object} event The widget element's touchstart event
  ###
  mouseProto._touchStart = (event) ->
    self = this

    # Ignore the event if another widget is already being handled
    if touchHandled or !self._mouseCapture(event.originalEvent.changedTouches[0]) then return

    # Set the flag to prevent other widgets from inheriting the touch event
    touchHandled = true

    # Track movement to determine if interaction was a click
    self._touchMoved = false

    # Simulate the mouseover event
    simulateMouseEvent event, 'mouseover'

    # Simulate the mousemove event
    simulateMouseEvent event, 'mousemove'

    # Simulate the mousedown event
    simulateMouseEvent event, 'mousedown'
    return # END mouseProto._touchStart

  ###*
  # Handle the jQuery UI widget's touchmove events
  # @param {Object} event The document's touchmove event
  ###
  mouseProto._touchMove = (event) ->
    # Ignore event if not handled
    if !touchHandled then return

    # Interaction was not a click
    @_touchMoved = true

    # Simulate the mousemove event
    simulateMouseEvent event, 'mousemove'

    return # END mouseProto._touchMove

  ###*
  # Handle the jQuery UI widget's touchend events
  # @param {Object} event The document's touchend event
  ###
  mouseProto._touchEnd = (event) ->
    # Ignore event if not handled
    if !touchHandled then return

    # Simulate the mouseup event
    simulateMouseEvent event, 'mouseup'

    # Simulate the mouseout event
    simulateMouseEvent event, 'mouseout'

    # If the touch interaction did not move, it should trigger a click
    if !@_touchMoved
      # Simulate the click event
      simulateMouseEvent event, 'click'

    # Unset the flag to allow other widgets to inherit the touch event
    touchHandled = false
    return # END mouseProto._touchEnd

  # A duck punch of the $.ui.mouse _mouseInit method to support touch events.
  # This method extends the widget with bound touch event handlers that
  # translate touch events to mouse events and pass them to the widget's
  # original mouse event handling methods.
  mouseProto._mouseInit = ->
    self = this
    # Delegate the touch handlers to the widget's element
    self.element.bind {
      touchstart: $.proxy(self, '_touchStart'),
      touchmove: $.proxy(self, '_touchMove'),
      touchend: $.proxy(self, '_touchEnd')
    }
    # Call the original $.ui.mouse init method
    _mouseInit.call self
    return # END mouseProto._mouseInit

  # Remove the touch event handlers
  mouseProto._mouseDestroy = ->
    self = this
    # Delegate the touch handlers to the widget's element
    self.element.unbind {
      touchstart: $.proxy(self, '_touchStart'),
      touchmove: $.proxy(self, '_touchMove'),
      touchend: $.proxy(self, '_touchEnd')
    }
    # Call the original $.ui.mouse destroy method
    _mouseDestroy.call self
    return # END mouseProto._mouseDestroy

  return # jQuery Plugin
