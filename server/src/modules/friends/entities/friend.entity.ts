import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Index,
  OneToOne,
  JoinColumn
} from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "../../users/entities/user.entity"

@Entity("friends")
export class Friend extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ApiProperty({ type: User })
  @Index()
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  @Column("uuid")
  public userId: string

  @ApiProperty({ type: User })
  @Index()
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "friend_id", referencedColumnName: "id" })
  @Column("uuid")
  public friendId: string

  @ApiProperty({ required: true })
  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date

  @ApiProperty({ required: true })
  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt: Date
}
