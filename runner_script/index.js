// Process to automatically restart chrome every x hours due to memory leaking

const spawn = require('child_process').spawn;
const path = require('path');
const schedule = require('node-schedule');

const killInterval = 2*60*60*1000;
const restartTimeout = 60*1000;
//const killInterval = 13*1000;

const startHour = 9;
const stopHour = 23;


var proc = null;

function killProcess() {
  if (proc == null) return;
  proc.kill('SIGTERM');
}

function startProcess() {
  //proc = spawn('bash', [path.join(__dirname, './test.sh')]);
  proc = spawn('chromium-browser', ['--kiosk', '--incognito', '--disable-3d-apis', '--disable-webgl', '--safebrowsing-disable-auto-update', '--safebrowsing-disable-download-protection', '--remote-debugging-port=9222', 'http://localhost:8080/player.html']);

  proc.on('close', function() {
    setTimeout(startProcess, restartTimeout);
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

function turnScreen(on) {
  var dpmsProc = spawn('xset', ['dpms', 'force', (on ? 'on' : 'off')]);

  setTimeout(function() {
    dpmsProc.kill('SIGTERM');
  }, 10000);
}


setInterval(killProcess, killInterval);

startProcess();

schedule.scheduleJob('0 ' + startHour + ' * * *', function() {
  turnScreen(true);
});

schedule.scheduleJob('0 ' + stopHour + ' * * *', function() {
  turnScreen(false);
});
