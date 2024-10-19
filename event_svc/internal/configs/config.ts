
export interface RedisConfig {
  url: string;
};

export interface MongoCfg {
  url: string;
}

export interface Config {
  redis: RedisConfig
  mongo: MongoCfg
  addr: string
}

