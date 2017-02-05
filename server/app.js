var express = require('express')
var app = express();
var expressWs = require('express-ws')(app);

app.use(express.static('server/public'))


const state = {
  initializing : true
}
require('./dashboard')(app,state);
require('./worker')(app,state);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});


//
// app.ws('/dashboard', function(ws, req) {
//
//   console.log("Connected");
//
//   ws.on('message', function(msg) {
//     ws.send(msg);
//   });
// });
