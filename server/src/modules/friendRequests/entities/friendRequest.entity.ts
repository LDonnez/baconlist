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

@Entity("friend_requests")
export class FriendRequest extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @ApiProperty()
  @Index()
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "receiver_id", referencedColumnName: "id" })
  @Column("uuid")
  public receiverId: string

  @ApiProperty({ type: User })
  @Index()
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "requester_id", referencedColumnName: "id" })
  @Column("uuid")
  public requesterId: string

  @ApiProperty({ required: true })
  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date

  @ApiProperty({ required: true })
  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt: Date
}
