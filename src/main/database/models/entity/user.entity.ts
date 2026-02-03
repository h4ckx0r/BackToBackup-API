import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceEntity } from './device.entity';
import { RoleEntity } from './role.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @ManyToMany(() => RoleEntity)
  @JoinTable()
  roles: RoleEntity[];

  @OneToMany(() => DeviceEntity, (device) => device.owner)
  devices: DeviceEntity[];
}
