jQuery UI Touch Punch
======================

About
-----

This little library was written to punch in touch events to jQuery UI by providing touch proxies that simulate mouse events. 

This punch was written as a quick demonstration for a friend and I have not used it in production. Since I posted it, a number of people have started using it. (This was an unexpected consequence that I really should have expected!) Please note: this library is not a priority for me, I'm a busy guy and fixes will be made as time allows. In the past I have been slow to respond to issues — my apologies — but in the future I will make a more concerted effort to keep it functional and up-to-date.

I recently did a complete re-write which seems to have addressed all known issues. But there may be more! If you use this library and have questions, fire them at me on Twitter (@furf). If you find errors, please file them as issues on Github, providing detailed information including the versions of jQuery and jQuery UI that you are using and, if possible, an example of the failing code. Even better, do all that and then fork the repo, fix the bug and make a pull request. The best thing about open source is community involvement. Please feel free to take part. 

In the meanwhile, check out some live examples at <http://furf.com/exp/touch-punch/> (and use a touch-capable device, silly).

Cheers!

furf

Usage
-----

Include touch punch after jQuery UI and before its first usage.

```html
<script src="http://code.jquery.com/jquery.min.js"></script>
<script src="http://code.jquery.com/ui/1.8.17/jquery-ui.min.js"></script>
<script src="jquery.ui.touch-punch.min.js"></script>
<script>
$('#widget').draggable();
</script>
```

That's it!