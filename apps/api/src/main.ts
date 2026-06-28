import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'

const buildLogger = () => {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context }) =>
          `${timestamp} [${String(context ?? 'App')}] ${level}: ${String(message)}`,
        ),
      ),
    }),
  ]

  if (process.env.LOKI_URL) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const LokiTransport = require('winston-loki')
    transports.push(
      new LokiTransport({
        host: process.env.LOKI_URL,
        labels: { app: 'bettracker-api', env: process.env.NODE_ENV ?? 'development' },
        json: true,
        format: winston.format.json(),
        replaceTimestamp: true,
        onConnectionError: (err: Error) => console.error('Loki connection error:', err.message),
      }),
    )
  }

  return WinstonModule.createLogger({ transports })
}

async function bootstrap() {
  const logger = buildLogger()

  const app = await NestFactory.create(AppModule, { logger })

  app.use(helmet())

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  app.useGlobalFilters(new AllExceptionsFilter())

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  })

  const port = process.env.PORT ?? 3001
  await app.listen(port)
  logger.log(`API running on http://localhost:${port}/api`, 'Bootstrap')
}

bootstrap()
