export interface Config {
  redis: RedisConfig
}

export interface RedisConfig {
  url: string
}