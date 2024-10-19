const path = "./faker_noti.txt"
export class NotiService {
  sendNoti(message: string) {
    Bun.write(path, message)
  }
}