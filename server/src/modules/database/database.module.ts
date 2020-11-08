import { DynamicModule } from "@nestjs/common"
import { DotenvParseOutput, parse } from "dotenv"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConnectionOptions } from "typeorm"
import { DatabaseService } from "./database.service"
import { existsSync, readFileSync } from "fs"
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type"
import { ConfigService } from "@nestjs/config"
import {
  TypeOrmConfigService,
  DatabaseEnvironmentVariables
} from "./typeOrmConfig.service"

export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      imports: [
        TypeOrmModule.forRootAsync({
          useClass: TypeOrmConfigService
        })
      ],
      global: true,
      module: DatabaseModule,
      providers: [DatabaseService],
      exports: [TypeOrmModule, DatabaseModule, DatabaseService]
    }
  }

  static forFeature(entities: EntityClassOrSchema[]): DynamicModule {
    return {
      imports: [TypeOrmModule.forFeature(entities)],
      module: DatabaseModule,
      providers: [DatabaseService],
      exports: [TypeOrmModule, DatabaseService, DatabaseModule]
    }
  }

  static generateTypeOrmConfig(rootDir: string): ConnectionOptions {
    const configService: ConfigService<DatabaseEnvironmentVariables> = new ConfigService<
      DatabaseEnvironmentVariables
    >(this.getConfig())
    const config: ConnectionOptions = {
      type: "postgres",
      host: configService.get<string>("POSTGRES_HOST"),
      port: configService.get<number>("POSTGRES_PORT"),
      username: configService.get<string>("POSTGRES_USERNAME"),
      password: configService.get<string>("POSTGRES_PASSWORD"),
      database: configService.get<string>("POSTGRES_DATABASE"),
      entities: [rootDir + "/**/*.entity{.ts,.js}"],
      synchronize: false,
      migrationsRun: true,
      logging: true,
      logger: "file",
      migrations: [rootDir + "/migrations/**/*{.ts,.js}"],
      cli: {
        migrationsDir: "src/migrations"
      }
    }
    return config
  }

  private static getConfig(): DotenvParseOutput {
    const filePath = `.env.${process.env.NODE_ENV ?? "development"}`
    if (existsSync(filePath)) {
      const config = readFileSync(filePath)
      return parse(config)
    }
    return process.env as DotenvParseOutput
  }
}
