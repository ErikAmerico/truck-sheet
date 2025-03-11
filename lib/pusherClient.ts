//pusher-js is the client side verison of pusher
//used to connect to the pusher service and listen for events
import Pusher from "pusher-js";

//check if the environment variables are set
if (
  !process.env.NEXT_PUBLIC_PUSHER_KEY ||
  !process.env.NEXT_PUBLIC_PUSHER_CLUSTER
) {
  throw new Error("Pusher client environment variables are missing");
}

//creates an instance of the pusher client
//cluster is the region where the pusher service is hosted
//key is the public key of the pusher service
//this instance allows compnents to subscribe to pusher channels and get realtime updates
const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

export default pusherClient;
