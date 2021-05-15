import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PrismaClient } from "@prisma/client"

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(ConfigService) configService: ConfigService) {
    super({
      datasources: {
        db: { url: configService.get<string>("DATABASE_URL") as string }
      }
    })
  }

  public async onModuleInit(): Promise<void> {
    await this.$connect()
  }

  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect()
  }

  public async cleanAll(): Promise<void> {
    await this.$executeRaw("TRUNCATE users CASCADE;")
    await this.$executeRaw("TRUNCATE friend_requests CASCADE;")
    await this.$executeRaw("TRUNCATE refresh_token_states CASCADE;")
    await this.$executeRaw("TRUNCATE friends CASCADE;")
  }

  public async closeConnection(): Promise<void> {
    await this.$disconnect()
  }
}
