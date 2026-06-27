import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('languages')
export class Language {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @Column()
  nativeName: string
}
