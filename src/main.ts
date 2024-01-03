import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,
    transform:true,
    transformOptions:{
      enableImplicitConversion:true
    }
  }))

  app.enableCors();

  const config=new DocumentBuilder()
    .setTitle('Teslo nest')
    .setDescription('Teslo shop API')
    .setVersion('1.0')
    .build();  

  const document=SwaggerModule.createDocument(app,config);

  SwaggerModule.setup('api',app,document);

  await app.listen(process.env.PORT);
  Logger.log(`App running on port ${process.env.PORT}`)
}
bootstrap();
