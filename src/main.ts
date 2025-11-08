import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true,
    exceptionFactory(errors) {
      const result = errors.map(error => ({
        property: error.property,
        error: error.constraints
      }));
      return new BadRequestException({
        statusCode: 400,
        message: 'Bad request',
        errors: result 
      });
    },
  }));
  app.enableCors({ origin: '*' });
  await app.listen(3001);
}
bootstrap();
