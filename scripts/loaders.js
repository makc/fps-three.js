/**
 * Load images with jQuery Deferred
 * http://aboutcode.net/2013/01/09/load-images-with-jquery-deferred.html
 */

$.loadImage = function(url) {
  // Define a "worker" function that should eventually resolve or reject the deferred object.
  var loadImage = function(deferred) {
    var image = new Image();
     
    // Set up event handlers to know when the image has loaded
    // or fails to load due to an error or abort.
    image.onload = loaded;
    image.onerror = errored; // URL returns 404, etc
    image.onabort = errored; // IE may call this if user clicks "Stop"
     
    // Setting the src property begins loading the image.
    image.src = url;
     
    function loaded() {
      unbindEvents();
      // Calling resolve means the image loaded sucessfully and is ready to use.
      deferred.resolve(image);
    }
    function errored() {
      unbindEvents();
      // Calling reject means we failed to load the image (e.g. 404, server offline, etc).
      deferred.reject(url);
    }
    function unbindEvents() {
      // Ensures the event callbacks only get called once.
      image.onload = null;
      image.onerror = null;
      image.onabort = null;
    }
  };
   
  // Create the deferred object that will contain the loaded image.
  // We don't want callers to have access to the resolve() and reject() methods,
  // so convert to "read-only" by calling `promise()`.
  return $.Deferred(loadImage).promise();
};


// do the same for html5 audio
// except we can't really know
// when it's fully loaded :(

$.loadAudio = function(url) {
  var loadAudio = function(deferred) {
    var audio = new Audio(url);

    // http://diveintohtml5.info/everything.html#audio-mp3
    if(!!!(audio.canPlayType && audio.canPlayType("audio/mpeg;").replace(/no/, ""))) {
      var dummy = {
        cloneNode: function() {
          return dummy;
        },
        play: function() {
          // move along
        }
      };

      deferred.resolve(dummy);
      return;
    }

    audio.preload = "auto";

    audio.addEventListener("canplay", loaded, false);
    audio.addEventListener("error", errored, false);

    audio.load();

    function loaded() {
      unbindEvents();
      deferred.resolve(audio);
    }
    function errored() {
      unbindEvents();
      deferred.reject(url);
    }
    function unbindEvents() {
      audio.removeEventListener("canplay", loaded);
      audio.removeEventListener("error", errored);
    }
  };

  return $.Deferred(loadAudio).promise();
};