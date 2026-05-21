import { ObjectId } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

@Entity('passwords')
@Index(['vaultId'])
@Index(['vaultId', 'favorite'])
export class PasswordEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  vaultId: string;

  @Column()
  service: string;

  @Column()
  website: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: false })
  favorite: boolean;

  @Column()
  creationDate: Date;

  @Column()
  modifiedDate: Date;
}
