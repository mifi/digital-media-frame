// Process to automatically restart chrome every x hours due to memory leaking

const spawn = require('child_process').spawn;
const path = require('path');

const restartInterval = 2*60*60*1000;
//const restartInterval = 13*1000;

var proc = null;

function killProcess() {
  if (proc == null) return;
  proc.kill('SIGTERM');
}

function startProcess() {
  //proc = spawn('bash', [path.join(__dirname, './test.sh')]);
  proc = spawn('chromium-browser', ['--kiosk', '--incognito', '--disable-3d-apis', '--disable-webgl', '--safebrowsing-disable-auto-update', '--safebrowsing-disable-download-protection', 'http://localhost:8080/player.html']);

  proc.on('close', function() {
    setTimeout(startProcess, 10000);
  });

  proc.on('error', function(err) {
    console.log('Server error:', err);
  });

  proc.stdout.on('data', function (data) {
    console.log(data.toString());
  });

  proc.stderr.on('data', function (data) {
    console.log(data.toString());
  });
}

setInterval(killProcess, restartInterval);

startProcess();