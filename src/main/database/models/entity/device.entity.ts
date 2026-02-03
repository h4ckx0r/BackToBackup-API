import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class DeviceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  refresh_token?: string;

  @Column({ type: 'bytea', nullable: true }) // TODO: Usar com.github.oshi en el servicio java para generar un identificador único
  deviceHash?: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  hostname?: string;

  @Column({ type: 'varchar', nullable: true })
  os?: string;

  @Column({ type: 'varchar', nullable: true })
  socketId?: string | null;

  @ManyToOne(() => UserEntity, (user) => user.devices)
  owner: UserEntity;
}
