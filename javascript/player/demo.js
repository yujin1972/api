soundManager.flashVersion = 9;
soundManager.debugMode = false; // disable debug mode
soundManager.defaultOptions.multiShot = false;
//soundManager.url = '.'; // change to 'http://a1.soundcloud.com/swf/soundmanager2_flash9.swf' for crossdomain playback
//soundManager.useConsole = true;
//soundManager.consoleOnly = true;
//soundManager.useHighPerformance = false;

$(function() {
  $("a.soundcloud-player#basic").scPlayer();
  $("a.soundcloud-player#custom-width").scPlayer({width:600,collapse:false});
  $("a.soundcloud-player#custom-css").scPlayer();
  $("a.soundcloud-player#custom-size").scPlayer({width:"100%",collapse:false});
});
