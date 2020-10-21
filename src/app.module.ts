import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
  ConfigModule.forRoot({ isGlobal: true }),
    Neo4jModule.fromEnv(),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {

  constructor(private readonly neo4jService: Neo4jService) {}

  onModuleInit() {
    return Promise.all([
      this.neo4jService.write('CREATE CONSTRAINT ON (u:User) ASSERT u.id IS UNIQUE').catch(e => {}),
      this.neo4jService.write('CREATE CONSTRAINT ON (u:User) ASSERT u.email IS UNIQUE').catch(e => {}),
    ])
  }
}
