import { BigNumber } from 'bignumber.js'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { CurrencyEntity } from '../../currencies/entities/currency.entity'
import { BaseEntity } from '../../shared/entities'
import { BigNumberFieldTransformer } from '../../shared/transformers'
import { TransactionEntity } from '../../transactions/entities/transaction.entity'

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column({ unique: true })
    login: string

    @Column()
    password: string

    @Column({
        type: 'decimal',
        transformer: new BigNumberFieldTransformer(),
        default: new BigNumber(0)
    })
    balance: BigNumber

    @ManyToOne(() => CurrencyEntity, (currency) => currency.users)
    @JoinColumn({ name: 'currency_id' })
    currency: CurrencyEntity

    @OneToMany(() => TransactionEntity, (transaction) => transaction.from)
    outgoingTransactions: TransactionEntity[]

    @OneToMany(() => TransactionEntity, (transaction) => transaction.to)
    incomingTransactions: TransactionEntity[]
}
