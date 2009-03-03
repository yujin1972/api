(function($) {
  $.fn.scPlayer = function(callerSettings) {
    return this.each(function(){
      var dom = this;

//      var settings = $.extend({foo:'hej'},callerSettings || {});
      $(dom).wrap("<div class='player-large'></div>");

      var track = {}; // holds the soundcloud track data

      $("a",dom)
        .click(function() {
          if($(".position",dom).length == 0) { // if not initied, then load track data, and init the sound            
              $.getJSON("http://api.soundcloud.com/tracks/flickermood.js?callback=?", function(data) {
                track = data;

                $("<div class='loading'></div><div class='progress'></div><div class='progress-bar'></div><p class='time'></p>").appendTo(dom);

                $("<span><span class='position'></span> / </span><span class='duration'></span>")
                  .prependTo($(".time",dom))
                  .hide()
                  .fadeIn(1500);

                $("<p class='metadata'><a href='" + track.user.permalink_url + "'>" + track.user.username + "</a> - <a href='" + track.permalink_url + "'>" + track.title + "</a></p>")
                  .appendTo(dom)
                  .hide()
                  .fadeIn(1500);              

                var progressBar = $(dom).find(".progress-bar");
                var loading = $(".loading",dom);
                var progress = $(".progress",dom);

                dom.animate({width:400},500,"easeinout");

                // set up progress
                progressBar.click(function(ev) {
                  var percent = (ev.clientX-progressBar.offset().left)/(progressBar.width());
                  if(sound.durationEstimate*percent < sound.duration) {
                    sound.setPosition(sound.durationEstimate*percent);
                    play();
                  }
                });

                var sound = soundManager.createSound({
                  id: track.id,
                  url: track.stream_url,
                  whileloading : SC.throttle(200,function() {
                    loading.css('width',(sound.bytesLoaded/sound.bytesTotal)*100+"%");
                  }),
                  whileplaying : SC.throttle(200,function() {
                    progress.css('width',(sound.position/sound.durationEstimate)*100+"%");
                    $('.position',dom).html(SC.formatMs(sound.position));
                    $('.duration',dom).html(SC.formatMs(sound.durationEstimate));
                  }),
                  onfinish : function() {
                    dom.removeClass("playing");
                  },
                  onload : function () {
                    loading.css('width',"100%");
                  }
                });

                togglePlay();
              });

          } else {
            togglePlay();
          }
          return false;
        });


      var togglePlay = function() {
        if(dom.hasClass("playing")) {
          stop();
        } else {
          play();      
        }        
      };

      var stop = function() {
        if(sound) {
          sound.pause();
          dom.removeClass("playing");
          $("body").removeClass("playing");
        }
      };

      var play = function() {
        if(sound) {
          $("body").removeClass("playing");
          if(sound.paused) {
            sound.resume();
          } else {
            sound.play();
          }
          dom.addClass("playing");
          $("body").addClass("playing");
        }
      };

    });
    };
})(jQuery);
