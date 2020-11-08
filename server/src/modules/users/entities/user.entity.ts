import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Index
} from "typeorm"
import { ApiProperty } from "@nestjs/swagger"

@Entity("users")
export class User extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ApiProperty()
  @Column("varchar", { name: "first_name" })
  public firstName: string

  @ApiProperty()
  @Column("varchar", { name: "last_name" })
  public lastName: string

  @ApiProperty()
  @Column("varchar")
  @Index()
  public email: string

  @Column("varchar", { nullable: false })
  public password?: string

  @ApiProperty({ required: true })
  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date

  @ApiProperty({ required: true })
  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt: Date
}
