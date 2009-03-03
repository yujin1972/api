soundManager.flashVersion = 9;
//soundManager.url = '.';
soundManager.useConsole = true;
soundManager.consoleOnly = true;
soundManager.debugMode = true; // disable debug mode
soundManager.defaultOptions.multiShot = false;
soundManager.useHighPerformance = false;

soundManager.onload = function() {
  $("a.soundcloud-player").scPlayer();
}