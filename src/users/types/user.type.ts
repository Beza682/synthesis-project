import { BigNumber } from 'bignumber.js'

import { BaseType } from '../../shared/types/base.type'

export class UserType extends BaseType {
    login: string
    balance: BigNumber
    currencyId: string
}
