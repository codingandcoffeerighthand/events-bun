import { Schema } from "mongoose"

const path = "./faker_noti.txt"
export class NotiService {
  async sendNoti(message: string) {
    const content = await Bun.file(path).text()
    Bun.write(path, `${content}\n${message}`)
  }
}

const MessageEventSchema = new Schema(
  {
    event_id: { type: String, required: true },
    user_id: { type: String, required: true },
    message: String
  },
)