const ws = require('ws');

let websocketServer;

function init(server) {
    websocketServer = new ws.Server({ 
        server,
        path: "/ws",
    });

    websocketServer.on('connection', () => {
        // Don't listen to messages
        console.log("New websocket connection");
    });
}

module.exports = {
    init,
    broadCastMessage(message) {
        if (!websocketServer) {
            throw new Error("Websocket server not initialized")
        }

        for (const client of websocketServer.clients) {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify(message));
            }
        }
    }
}