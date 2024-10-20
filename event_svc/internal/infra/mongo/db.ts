import mongoose from "mongoose";
import type { MongoCfg } from "../../configs/config";

export async function connectMongo(cfg: MongoCfg): Promise<boolean> {
  try {
    await mongoose.connect(cfg.url)
    return true
  } catch (error) {
    return false
  }
}