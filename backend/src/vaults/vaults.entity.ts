import { ObjectId } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

@Entity('vaults')
@Index(['ownerId'])
export class VaultEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  ownerId: string;

  @Column()
  name: string;

  @Column()
  description?: string;

  @Column()
  color: string;
}
