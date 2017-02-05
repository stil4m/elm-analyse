var express = require('express')
var app = express();
var expressWs = require('express-ws')(app);

app.use(express.static('server/public'))


const state = {
  initializing : true
}
const elm = require('./worker')(app,state);
require('./dashboard')(app, elm,expressWs);


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
