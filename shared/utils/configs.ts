import yaml from 'yaml'

export async function getConfigs<T>(pathfile = 'configs.yaml'): Promise<T> {
  try{
    const bytesConfig = await Bun.file(pathfile).text()
    return yaml.parse(bytesConfig) as T
  } catch (error) {
    throw new Error(`Can't read config : ${pathfile}`)
  }
}
