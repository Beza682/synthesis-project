export const arrayToFormatString = <T>(
    array: T[],
    withoutQuotes = false,
): string => withoutQuotes
        ? array.map((element) => `${element}`).join(', ')
        : array.map((element) => `'${element}'`).join(', ')
