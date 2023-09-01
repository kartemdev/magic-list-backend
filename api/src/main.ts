import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Magic List')
    .setDescription('API для работы продукта Magic List')
    .setVersion('1.0.0 (beta)')
    .addTag('by kartemdev')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/swagger', app, swaggerDocument);

  const port = +process.env.PORT || 3000;
  await app.listen(port, () =>
    console.log(`listening at http://localhost:${port}`),
  );
}
bootstrap();
