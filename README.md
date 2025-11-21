# jQuery UI Touch Punch
## Touch Event Support for jQuery UI

> **jQuery UI Touch Punch is a small hack that enables the use of touch events on sites using the jQuery UI user interface library.**

Currently, [jQuery UI](http://jqueryui.com/) user interface library does not support the use of touch events in their widgets and interactions. This means that the slick UI you designed and tested in your desktop browser will fail on most, if not all, touch-enabled mobile devices, because jQuery UI listens to mouse events—mouseover, mousemove and mouseout—not touch events—touchstart, touchmove and touchend.

That's where jQuery UI Touch Punch comes in. Touch Punch works by using [simulated events](https://developer.mozilla.org/en/DOM/document.createEvent) to map [touch events](http://www.html5rocks.com/en/mobile/touch/) to their mouse event analogs. Simply include the script on your page and your touch events will be turned into their corresponding mouse events to which jQuery UI will respond as expected.

As I said, Touch Punch is a hack. It [duck punches](http://en.wikipedia.org/wiki/Monkey_patch) some of jQuery UI's core functionality to handle the mapping of touch events. Touch Punch works with all basic implementations of jQuery UI's interactions and widgets. However, you may find more complex cases where Touch Punch fails. If so, scroll down to learn how you can file and/or fix issues.

This code is dual licensed under the MIT or GPL Version 2 licenses and is therefore free to use, modify and/or distribute, but if you include Touch Punch in other software packages or plugins, please include an attribution to the original software and a link to [this repo](https://github.com/RWAP/jquery-ui-touch-punch).

Fork: https://github.com/RWAP/jquery-ui-touch-punch

RWAP Version (2019-2024)

The [original repo](https://github.com/furf/jquery-ui-touch-punch) was last updated in 2014.

I have created a new fork which contains various suggested improvements to the code when it became clear that touch-punch does not work too well on Android devices, and actually stopped the close button on jquery-ui dialogs from working on some devices.

www.rwapsoftware.co.uk


## Using Touch Punch is as easy as 1, 2…

Just follow these simple steps to enable touch events in your jQuery UI app:

1. Include jQuery and jQuery UI on your page.

    ```html
    <script src="http://code.jquery.com/jquery.min.js"></script>
    <script src="http://code.jquery.com/ui/1.8.17/jquery-ui.min.js"></script>
    ```

2. Include Touch Punch after jQuery UI and before its first use.

    Please note that if you are using jQuery UI's components, Touch Punch must be included after jquery.ui.mouse.js, as Touch Punch modifies its behavior.

    ```html
    <script src="jquery.ui.touch-punch.js"></script>
    ```

3. There is no 3. Just use jQuery UI as expected and watch it work at the touch of a finger.

    ```html
    <script>$('#widget').draggable();</script>
    ```

_Tested on iPad, iPhone, Android and other touch-enabled mobile devices._

## If it does not seem to work…

Remember that Touch Punch is just allowing various key strokes (such as touch, cliuck and double click) to emulate mouse movements.  We do nothing with the underlying jQuery code.

If it does not appear to work for you:

1. Ensure that you are using the latest version of this plugin (and not the [original repo](https://github.com/furf/jquery-ui-touch-punch) ).

2. Ensure that you have the latest versions of jQuery and jQuery UI linked in your webpage, BEFORE this code

3. Ensure that the original code works as expected on desktop.
