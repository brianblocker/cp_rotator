cp_rotator
==========

Just a little rotator used for the CP homepage.

Usage:
```javascript
jQuery( selector ).cp_slideshow( options );
```
Options:
```javascript
{
  delay       : 5000, // time in ms (1000 = 1 second)
  autoplay    : true, // true to auto rotate, false to pause
  pauseHover  : true, // true to pause when the mouse is over the slideshow
  stopOnClick : false, // true to stop autoplay when a specific banner is clicked
  loop        : 0, // # of times to loop through. Any number less than 1 will loop infinitely
  stopAt      : 0, // int|'first'|'last'. The index of the slide to stop on when the loop is done. Anything less than 0 will be treated as 'last'. String values can be 'first' or 'last'
  beforeChange  : new Function, // callback before slide changes
  change      : new Function, // callback when slide changes
  stop      : new Function // callback for when slideshow is stopped/paused
}
```
