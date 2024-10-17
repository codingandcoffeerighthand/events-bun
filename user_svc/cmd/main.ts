import {getFlag} from '@shared/utils/getFlag'
import { getConfigs } from '@shared/utils/configs'
import type {IConfig} from '../internal/config/config'
import { App } from '@shared/server'
async function main() {
    const config = await getConfigs<IConfig>(getFlag('-c')) 
    const app = new App()
    app.addRouter(require('../internal/api/hello').default)
    app.start(config.port)
}

try {
  await main()
} catch (error) {
  // biome-ignore lint/complexity/noUselessCatch: <explanation>
  throw error;
}