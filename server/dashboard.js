module.exports = function(app,state) {

  app.ws('/dashboard', function(ws, req) {
    function renderState() {
      return JSON.stringify({loading : true, messages : []})
    }
    console.log("Connected");
    ws.send(renderState());

    ws.on('message', function(msg) {
      console.log("On message");
      ws.send(renderState())
    });
  });

}
