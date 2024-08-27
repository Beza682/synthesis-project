import { BigNumber } from 'bignumber.js'

const DEFAULT_BASE = 10

export class BigNumberFieldTransformer {
    to(value: BigNumber): string | undefined {
        if (value) {
            return value.toString(DEFAULT_BASE)
        }

        return undefined
    }

    from(value: string): BigNumber | undefined {
        if (value) {
            return new BigNumber(value)
        }

        return undefined
    }
}
