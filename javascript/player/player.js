/*
 * Copyright 2009 Eric Wahlforss for SoundCloud Ltd.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * For more information and documentation refer to
 * http://soundcloud.com/api
 * 
 */
 
(function($) {
  $.fn.scPlayer = function(callerSettings) {
    return this.each(function(){
      // default settings
      var settings = $.extend({width:500},callerSettings || {});

      $(this).wrap("<div class='player-large'></div>");

      var dom = $(this).parent("div.player-large");

      var track = {}; // holds the soundcloud track data

      var sound = null; //holds the soundmanager 2 sound object

      // init the player on first click of the link
      $("a",dom)
        .click(function() {
          if($(".position",dom).length == 0) { // if not initied, then load track data, and init the sound            
              $.getJSON("http://api.soundcloud.com/tracks/flickermood.js?callback=?", function(data) {
                track = data;

                $("<div class='loading'></div><div class='progress'></div><div class='progress-bar'></div><p class='time'></p>").appendTo(dom);

                $("<span><span class='position'></span> / <span class='duration'></span></span>")
                  .appendTo($(".time",dom))
                  .hide()
                  .fadeIn(1500);

                $("<p class='metadata'><a href='" + track.user.permalink_url + "'>" + track.user.username + "</a> - <a href='" + track.permalink_url + "'>" + track.title + "</a></p>")
                  .appendTo(dom)
                  .hide()
                  .fadeIn(1500);              

                var progressBar = $(dom).find(".progress-bar");
                var loading = $(".loading",dom);
                var progress = $(".progress",dom);

                // expand out the player to the width in the settings
                dom.animate({width:settings.width},500,"easeinout");

                // set up progress
                progressBar.click(function(ev) {
                  var percent = (ev.clientX-progressBar.offset().left)/(progressBar.width());
                  if(sound.durationEstimate*percent < sound.duration) {
                    sound.setPosition(sound.durationEstimate*percent);
                    play();
                  }
                });

                sound = soundManager.createSound({
                  id: track.id,
                  url: track.stream_url,
                  whileloading : throttle(200,function() {
                    loading.css('width',(sound.bytesLoaded/sound.bytesTotal)*100+"%");
                  }),
                  whileplaying : throttle(200,function() {
                    progress.css('width',(sound.position/sound.durationEstimate)*100+"%");
                    $('.position',dom).html(formatMs(sound.position));
                    $('.duration',dom).html(formatMs(sound.durationEstimate));
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

          } else { // if inited, the toggle between play/pause
            togglePlay();
          }
          return false;
        });

      var togglePlay = function() {
        dom.hasClass("playing") ? stop() : play();
      };

      var stop = function() {
        if(sound) {
          sound.pause();
          dom.removeClass("playing");
        }
      };

      var play = function() {
        if(sound) {
          sound.paused ? sound.resume() : sound.play();
          dom.addClass("playing");
        }
      };

      // format millis into MM.SS
      var formatMs = function(ms) {
        var s = Math.floor((ms/1000) % 60);
        if (s < 10) { s = "0"+s; }
        return Math.floor(ms/60000) + "." + s;
      };
      
      // throttling function to minimize redraws caused by soundmanager
      var throttle = function(delay, fn) {
        var last = null,
            partial = fn;

        if (delay > 0) {
          partial = function() {
            var now = new Date(),
                scope = this,
                args = arguments;

            // We are the last call made, so cancel the previous last call
            clearTimeout(partial.futureTimeout);

            if (last === null || now - last > delay) { 
              fn.apply(scope, args);
              last = now;
            } else {
              // guarentee that the method will be called after the right delay
              partial.futureTimeout = setTimeout(function() { fn.apply(scope, args); }, delay);
            }
          };
        }
        return partial;
      }

    });
    };
})(jQuery);
