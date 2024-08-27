export const getIdsWithoutUpdates = <T extends GetIdsWithoutUpdatesDto<T>>(
    dtos: GetIdsWithoutUpdatesDto<T>[],
): string[] =>
    dtos
        .filter(({ id, ...rest }) => {
            const hasNonEmptyValue = Object.values(rest).some(
                (value) => value !== undefined,
            )
            return !hasNonEmptyValue || !id
        })
        .map(({ id }) => id)

export type GetIdsWithoutUpdatesDto<T extends { id: string }> = {
    id: string
} & Partial<T>
