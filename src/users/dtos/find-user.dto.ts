import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class FindUserDto {
    @IsUUID('4')
    @IsOptional()
    id?: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    login?: string
}
