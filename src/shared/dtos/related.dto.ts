import { IsUUID } from 'class-validator'

export class RelatedDto {
    @IsUUID('4')
    id: string
}
