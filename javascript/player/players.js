soundManager.flashVersion = 9;
soundManager.debugMode = false; // disable debug mode
soundManager.defaultOptions.multiShot = false;
//soundManager.url = '.';
//soundManager.useConsole = true;
//soundManager.consoleOnly = true;
//soundManager.useHighPerformance = false;

$(function() {
  $("a.soundcloud-player").scPlayer();
});
