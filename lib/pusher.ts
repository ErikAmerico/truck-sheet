//pusher is the server side verison of pusher (not client side pusher-js)
//used to broadcast events to clients (pusher-js ?)
import Pusher from "pusher";

//check if the environment variables are set
if (
  !process.env.PUSHER_APP_ID ||
  !process.env.PUSHER_KEY ||
  !process.env.PUSHER_SECRET ||
  !process.env.PUSHER_CLUSTER
) {
  throw new Error("Pusher environment variables are missing");
}

//creates an instance of the pusher server
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  //enables tls (ssl encryption) for security?
  useTLS: true,
});

// Why Use TLS?
// Ensures secure communication between the server and Pusher.
// Encrypts data over the network.
// Required for production environments.

export default pusher;
