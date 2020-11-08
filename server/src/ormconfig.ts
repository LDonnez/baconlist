import { ConnectionOptions } from "typeorm"
import { DatabaseModule } from "./modules/database/database.module"

const config: ConnectionOptions = DatabaseModule.generateTypeOrmConfig(
  __dirname
)

export = config
