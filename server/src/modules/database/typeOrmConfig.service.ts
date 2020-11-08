import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm"
import { Injectable, Inject } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

export type DatabaseEnvironmentVariables = {
  NODE_ENV: string
  POSTGRES_PORT: number
  POSTGRES_HOST: string
  POSTGRES_DATABASE: string
  POSTGRES_USERNAME: string
  POSTGRES_PASSWORD: string
}

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService<DatabaseEnvironmentVariables>
  ) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const options: TypeOrmModuleOptions = {
      type: "postgres",
      host: this.configService.get<string>("POSTGRES_HOST"),
      port: this.configService.get<number>("POSTGRES_PORT"),
      database: this.configService.get<string>("POSTGRES_DATABASE"),
      username: this.configService.get<string>("POSTGRES_USERNAME"),
      password: this.configService.get<string>("POSTGRES_PASSWORD"),
      autoLoadEntities: true,
      migrations: [this.migrationsDir],
      cli: {
        entitiesDir: "src/modules/*/entity",
        migrationsDir: "src/migrations",
        subscribersDir: "src/subscribers"
      },
      synchronize: this.isTest || this.isDev,
      logging: !this.isProd
    }
    return options
  }

  private get isDev(): boolean {
    return this.configService.get<string>("NODE_ENV") === "development"
  }

  private get isProd(): boolean {
    return this.configService.get<string>("NODE_ENV") === "production"
  }

  private get isTest(): boolean {
    return this.configService.get<string>("NODE_ENV") === "test"
  }

  private get migrationsDir(): string {
    return this.isDev
      ? `${__dirname}/migrations/**/*.ts`
      : `${__dirname}/migrations/**/*.js`
  }

}
