import { EventPub } from "./evenPub";

const client = new EventPub({
  url: "redis://:yourpassword@localhost:6379"
});

client.connect();
for (let i = 0; i < 10; i++) {
  console.log(`publish event: ${i}`)
  await client.publishUpdateEvent({
    event_id: `${i}`
  })
  await new Promise(resolve => setTimeout(resolve, 1000))
}
await new Promise(resolve => setTimeout(resolve, 100000))
client.quit()