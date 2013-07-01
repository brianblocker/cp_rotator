/*****
 *  cp_rotator
 *
 *  Author: @brianblocker
 *  (c) CloudPassage, Inc.
 *
 *  Provides a simple slideshow with basic customization. Uses CSS3 transitions.
 *  Relies on Modernizr for feature detection, gracefully degrading to javascript animation when CSS3 transitions aren't supported.
 *****/

( function( $ ) {
  "use_strict";

  $.fn.cp_rotator = function( method ) {
    if ( methods[ method ] )
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
    else if ( typeof method === 'object' || ! method )
      return methods.init.apply( this, arguments );
    else
      $.error( method + ' is not a valid argument for cp_rotator.' );
  }

  $.fn.cp_rotator.defaults = {
    delay       : 5000, // time in ms (1000 = 1 second)
    autoplay    : true, // true to auto rotate, false to pause
    pauseHover  : true, // true to pause when the mouse is over the slideshow
    stopOnClick : false, // true to stop autoplay when a specific banner is clicked
    loop        : 0, // # of times to loop through. Any number less than 1 will loop infinitely
    stopAt      : 0, // int|'first'|'last'. The index of the slide to stop on when the loop is done. Anything less than 0 will be treated as 'last'. String values can be 'first' or 'last'
    beforeChange  : new Function, // callback before slide changes
    change      : new Function, // callback when slide changes
    stop        : new Function, // callback for when slideshow is stopped/paused
    arrows      : false // false, 'together', 'split'
  };

  var methods = {
    init : function( options ) {
      return this.each( function() {
        var $this = $( this )
        ,   opts  = $.extend( {}, $.fn.cp_rotator.defaults, options )
        
        setupArrows( $this, opts.arrows )
        setupListeners( $this, opts );
      });
    },
    get_value : function() {
      return getValues( this );
    },
    destroy : function() {
      $( document ).off( '.cp_rotator' );

      return this;
    }
  },
  setupArrows = function( $rotator, options ) {
    // todo: add arrows
  },
  setupListeners = function( $rotator, options ) {
    var $nav = $rotator.find( 'NAV' )
    ,   $content = $rotator.find( 'DIV.content' )
    ,   hovering = false
    ,   timer = false
    ,   loop = 0
    ,   stop = 0
    ,   done = false;

    if ( typeof options.stopAt === 'string' ) {
      if ( /first/i.test( options.stopAt ) )
        stop = 0;
      else
        stop = $content.last().index();
    }

    $rotator.on( 'mouseenter.cp_rotator', function() {
      hovering = true;

      if ( timer )
        clearTimeout( timer );

      timer = false;
    });

    $rotator.on( 'mouseleave.cp_rotator', function() {
      hovering = false;
      $rotator.trigger( 'countdown' )
    })

    $rotator.on( 'change.cp_rotator', function( e, opts ) {
      opts = opts || {};
      opts.callback = opts.callback || function( $prev, $current ){}

      var $current = $content.find( '.on' )
      ,   current_index = $current.index()
      ,   index = typeof opts.index === 'number' ? opts.index : current_index + 1
      ,   $next;

      if ( index >= $content.find( '.banner' ).size() )
        index = 0;

      $next = $content.find( '.banner:eq(' + index + ')' );
      $nav.find( '.active' ).removeClass( 'active' );
      $nav.find( 'LI:eq(' + index + ') A' ).addClass( 'active' );

      if( Modernizr.csstransitions ) {
        $current.on( 'webkitTransitionEnd.cptemp mozTransitionEnd.cptemp oTransitionEnd.cptemp msTransitionEnd.cptemp transitionend.cptemp', function( e ) {
          $current.removeClass( 'off' ).off( '.cptemp' );
        });

        $next.removeClass( 'off' ).addClass( 'on' );
        $current.removeClass( 'on' ).addClass( 'off' );
      }
      else {
        $content.find( '.banner' ).removeClass( 'off' );

        $next.addClass( 'on transition' )
        $next.animate( { 'left' : '0%' }, 500 );

        $current.animate( { 'left' : '-100%' }, 500, function() {
          $current.removeClass( 'on transition' ).removeAttr( 'style' )
        });
      }

      opts.callback( $current, $next )
    })

    $rotator.on( 'countdown.cp_rotator', function() {
      if ( options.autoplay && ! hovering && ! done ) {
        timer = setTimeout( function() {
          $rotator.trigger( 'change', { callback : function( $next, $curr ) {
              if ( $curr.is( ':last-child' ) )
                loop++;

              if ( ( options.loop < 1 ) || ( loop <= options.loop && $curr.index() !== stop ) )
                $rotator.trigger( 'countdown' );


              if ( options.loop >= 1 && loop >= options.loop && $curr.index() === stop )
                done = true;
            }
          })
        }, options.delay )
      }
    })

    $rotator.on( 'click.cp_rotator', 'NAV UL LI A:not(.active)', function( e ) {
      var $this = $( e.target ).closest( 'A' )
      ,   $parent = $this.closest( 'LI' )
      ,   index = $parent.index()

      if ( options.stopOnClick )
        done = true;

      $rotator.trigger( 'change', { index : index } );
    });

    $rotator.trigger( 'countdown' )
  }
})( window.jQuery || window.Zepto );

$( function() {
  $( '.rotator' ).cp_rotator({
    delay : 5000,
    loop : 1,
    stopAt : 0,
    stopOnClick : true
  });
});
