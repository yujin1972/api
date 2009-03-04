soundManager.flashVersion = 9;
soundManager.debugMode = false; // disable debug mode
soundManager.defaultOptions.multiShot = false;
//soundManager.url = '.'; // change to 'http://a1.soundcloud.com/swf/soundmanager2_flash9.swf' for crossdomain playback
//soundManager.useConsole = true;
//soundManager.consoleOnly = true;
//soundManager.useHighPerformance = false;

$(function() {
  $("a.soundcloud-player").scPlayer();
});
