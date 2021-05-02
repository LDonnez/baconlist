import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Index,
  JoinColumn,
  ManyToOne
} from "typeorm"
import { User } from "../../users/entities/user.entity"

@Entity("refresh_token_states")
export class RefreshTokenState extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string

  @Index()
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  @Column("uuid", { name: "user_id" })
  public userId: string

  @Column("varchar", { name: "user_agent" })
  @Index()
  public userAgent: string

  @Column("boolean", { name: "revoked" })
  public revoked: boolean

  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt: Date
}
