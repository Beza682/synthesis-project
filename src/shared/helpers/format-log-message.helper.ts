import { SendMessageDto } from '../../telegram-bot/dtos'

const SPACE_IN_DATA_OBJECT = 4

export const formatLogMessage = <T>(dto: SendMessageDto<T>): string => {
    const { title, description, data } = dto

    const header = `\u{2714}  ${title}`

    let defaultMessage = `${header} \n\n<b>Description:</b> ${description}`

    if (data) {
        const dataJSON = JSON.stringify(
            data,
            (_, value) => (typeof value === 'undefined' ? 'undefined' : value),
            SPACE_IN_DATA_OBJECT,
        )

        defaultMessage += `\n<b>Data:</b> <pre>${dataJSON}</pre>`
    }

    return `${defaultMessage} \n\n<b>Date:</b> ${new Date()}`
}
