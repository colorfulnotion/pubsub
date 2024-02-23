const { PubSub } = require('@google-cloud/pubsub');

const pubSubClient = new PubSub();
const subscriptionName = 'ethereum_token_transfers_usdt';
const subscription = pubSubClient.subscription(subscriptionName);

subscription.on('message', messageHandler);

function messageHandler(message) {
  console.log(`Received message: ${message.id}`);
  console.log(`Data: ${message.data}`);
  message.ack();
}

subscription.on('error', error => {
  console.error(`Received error: ${error.message}`);
  process.exitCode = 1;
});

console.log(`Listening for messages on subscription: ${subscriptionName}`);



