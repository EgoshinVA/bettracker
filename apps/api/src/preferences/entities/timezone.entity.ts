import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('timezones')
export class Timezone {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @Column()
  offset: string
}
