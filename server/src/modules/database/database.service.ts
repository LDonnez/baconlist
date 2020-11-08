import { InjectConnection } from "@nestjs/typeorm"
import { Connection, EntityMetadata } from "typeorm"

export class DatabaseService {

  constructor(@InjectConnection() private readonly connection: Connection) {}

  public async cleanAll(): Promise<void> {
    const entities = this.getEntities()
    for (const entity of entities) {
      const tableType = entity.tableType
      if (tableType === "regular") {
        const respository = this.connection.getRepository(entity.name)
        await respository.query(`TRUNCATE TABLE ${entity.tableName} CASCADE;`)
      }
    }
  }

  public async closeConnection(): Promise<void> {
    await this.connection.close()
  }

  private getEntities(): EntityMetadata[] {
    return this.connection.entityMetadatas
  }

}
