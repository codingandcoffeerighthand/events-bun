import { EventSub } from "./event_sub";

const sub = new EventSub({
  url: "redis://:yourpassword@localhost:6379",
})

sub.connect();
console.log("wait for event...")
await sub.subscribeUpdateEvent((event) => {
  console.log(`update event: ${event.event_id}`)
})
await sub.subscribeCancelEvent((event) => {
  console.log(`cancel event: ${event.event_id}`)
})

while (true) {
  await new Promise(resolve => setTimeout(resolve, 100000))
}
sub.quit()