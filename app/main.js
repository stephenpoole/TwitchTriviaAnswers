var triviabot = require('./triviabot.js');
var opts = {
	me: 'Nnehl',
	password: 'oauth:hwrrgqqazda3h30xoxrutz9c15qiq8',
	email: 'stephenwpoole@gmail.com',
	celebrate: 'I WON!'
};
var bot = new triviabot(opts);

/* web app */
var express = require('express');
var app = new express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/../html'));
app.get('/', function(req, res) {
	res.sendFile(__dirname+'/../html/index.html');
});

io.on('connection', function(socket) {
	socket.emit('init', bot.getMonitors());
	
	/* client -> server */
	socket.on('addmonitor', function(opts) {bot.addMonitor(opts)});
	socket.on('removemonitor', function(data) {bot.removeMonitor(data)});
	socket.on('connectmonitor', function(data) {bot.connectMonitor(data)});
	socket.on('disconnectmonitor', function(data) {bot.disconnectMonitor(data)});
	socket.on('connectallmonitors', function() {bot.connectAllMonitors()});
	socket.on('disconnectallmonitors', function() {bot.disconnectAllMonitors()});
	socket.on('message', function(data) {bot.sendMessage(data.streamer, data.message)});
	socket.on('kappa', function(data) {bot.kappa(data.streamer)});
	socket.on('nokappa', function(data) {bot.nokappa(data.streamer)});
	
	/* server -> client */
	bot.events.on('know', function(data) {socket.emit('know', data)});
	bot.events.on('dontknow', function(data) {socket.emit('dontknow', data)});
	bot.events.on('answered', function(data) {socket.emit('answered', data)});
	bot.events.on('won', function(data) {socket.emit('won', data)});
	bot.events.on('lost', function(data) {socket.emit('lost', data)});
	bot.events.on('connectmonitor', function(opts) {socket.emit('connectmonitor', opts)});
	bot.events.on('disconnectmonitor', function(opts) {socket.emit('disconnectmonitor', opts)});
	bot.events.on('removemonitor', function(opts) {socket.emit('removemonitor', opts)});
	bot.events.on('addmonitor', function(data) {socket.emit('addmonitor', data)});
	bot.events.on('enterraffle', function(data) {socket.emit('enterraffle', data)});
	bot.events.on('wonraffle', function(opts) {socket.emit('wonraffle', opts)});
	bot.events.on('lostraffle', function(data) {socket.emit('lostraffle', data)});
	bot.events.on('kappa', function(opts) {socket.emit('kappa', opts)});
	bot.events.on('nokappa', function(opts) {socket.emit('nokappa', opts)});
	bot.events.on('streamonline', function(opts) {socket.emit('streamonline', opts)});
	bot.events.on('streamoffline', function(opts) {socket.emit('streamoffline', opts)});
	
	socket.on('disconnect', function() {
		socket.removeAllListeners();
		bot.events.removeAllListeners();
	});
});
http.listen(3443);
/* end web app */