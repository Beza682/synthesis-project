import { BigNumber } from 'bignumber.js'

import { BaseType } from '../../shared/types/base.type'

export class TransactionType extends BaseType {
    amount: BigNumber
    fromId: string
    toId: string
}
