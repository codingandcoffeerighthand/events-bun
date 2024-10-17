import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import { errHandler } from './middleware/errHandler'

export class App {
  private app : express.Application
  constructor() {
    this.app = express()
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(compression())
    this.app.use(morgan('dev'))
    this.app.use(helmet())
  }

  addRouter(router: express.Router) {
    this.app.use(router)
  }

  start(port: number) {
    this.app.use(errHandler)
    const server = this.app.listen(port,() => {
      console.log(`Listening on port ${port}`)
    })
    process.on('SIGTERM', () => {
      server.close()
    })
  }
}