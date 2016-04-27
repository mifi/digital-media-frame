const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const yrno = require('yr.no-forecast');

const weatherLocation = {
  lat: 59.91387,
  lon: 10.75225
};
const weatherIntervalMinutes = 60;

var weatherData = null;


app.use(express.static('static'));

io.on('connection', function(socket){
    console.log('socket connection');

    socket.on('getData', function() {
        io.sockets.emit('getData');
    });
    socket.on('data', function(data) {
        io.sockets.emit('data', data);
    });
    socket.on('playPlaylist', function(playlist) {
        io.sockets.emit('playPlaylist', playlist);
    });
    socket.on('nextVideo', function() {
        io.sockets.emit('nextVideo');
    });
    socket.on('nextPlaylist', function() {
        io.sockets.emit('nextPlaylist');
    });
    socket.on('reload', function() {
        io.sockets.emit('reload');
    });
    socket.on('getWeatherData', function() {
        io.sockets.emit('weatherData', weatherData);
    });
});

http.listen(8080, function(){
    console.log('listening');
});

function refreshWeather() {
  yrno.getWeather(weatherLocation, function(err, location) {
    if (err) {
      console.log(err);
      return;
    }

    location.getCurrentSummary(function(err, newWeatherData) {
      if (err) {
        console.log(err);
        return;
      }
      weatherData = newWeatherData;
      console.log(newWeatherData);
    });
  });
}

setInterval(refreshWeather, weatherIntervalMinutes*60*1000);
refreshWeather();
