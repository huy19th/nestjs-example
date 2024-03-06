import { IsString, IsNotEmpty } from 'class-validator';

export class UploadOneFileDto {

    @IsString()
    @IsNotEmpty()
    uploader: string;

}