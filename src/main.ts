import { NestFactory } from '@nestjs/core';
import { Neo4jErrorFilter } from 'nest-neo4j/dist';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new Neo4jErrorFilter)
  await app.listen(3000);
}
bootstrap();
