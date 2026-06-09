import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ContextMiddleware } from './middleware/context-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(ContextMiddleware);
  await app.listen(process.env.PORT ?? 8001);
}

bootstrap().catch(err => {
  console.error('启动失败', err);
  process.exit(1);
});

