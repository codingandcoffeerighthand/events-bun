import mongoose from "mongoose";
import type { MongoCfg } from "../../configs/config";

export function connectMongo(cfg: MongoCfg): boolean {
  let rs = false
  mongoose.connect(cfg.url).then(() => {
    console.log("MongoDB connected");
    rs = true;
  }).catch((err) => {
    console.log(err);
  })
  return rs
} 