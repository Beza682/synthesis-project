import { Column, Entity, OneToMany } from 'typeorm'

import { BaseEntity } from '../../shared/entities'
import { UserEntity } from '../../users/entities/user.entity'

@Entity('currencies')
export class CurrencyEntity extends BaseEntity {
    @Column()
    name: string

    @Column()
    code: string

    @OneToMany(() => UserEntity, (user) => user.currency)
    users: UserEntity[]
}
