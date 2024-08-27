import { BigNumber } from 'bignumber.js'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from '../../shared/entities'
import { BigNumberFieldTransformer } from '../../shared/transformers'
import { UserEntity } from '../../users/entities/user.entity'

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
    @Column({
        type: 'decimal',
        transformer: new BigNumberFieldTransformer(),
    })
    amount: BigNumber

    @ManyToOne(() => UserEntity, (user) => user.outgoingTransactions)
    @JoinColumn({ name: 'from' })
    from: UserEntity

    @ManyToOne(() => UserEntity, (user) => user.incomingTransactions)
    @JoinColumn({ name: 'to' })
    to: UserEntity
}
