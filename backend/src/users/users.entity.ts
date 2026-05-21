import { Column, Entity, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity('users')
export class UserEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column()
  icon: string;
}
