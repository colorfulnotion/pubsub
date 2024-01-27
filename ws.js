const { PubSub } = require('@google-cloud/pubsub');
const WebSocket = require('ws');

// Creates a PubSub client
const pubSubClient = new PubSub();

// References an existing subscription, or creates a new one
const subscriptionName = 'ethereum_token_transfers_usdt'; // Choose your subscription name
const subscription = pubSubClient.subscription(subscriptionName);
const wss = new WebSocket.Server({ port: 1234 });

// Listen for new WebSocket connections
wss.on('connection', ws => {
  console.log('Client connected');

  // Listen for new messages from Pub/Sub and send them to connected clients
  subscription.on('message', messageHandler);

  function messageHandler(message) {
      console.log(`Received message: ${message.id}`);
      console.log(`Data: ${message.data}`);
      ws.send(message.data.toString());
    message.ack();
  }

  // Handle any errors that occur during the WebSocket connection
  ws.on('error', error => {
    console.error(`WebSocket error: ${error.message}`);
  });

  // Handle WebSocket closure
  ws.on('close', () => {
    console.log('Client disconnected');
    // Remove Pub/Sub listener when the client disconnects
    subscription.removeListener('message', messageHandler);
  });
});

console.log(`WebSocket server is running on port 1234`);
