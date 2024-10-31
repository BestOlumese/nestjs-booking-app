import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAuthDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  imagePath?: string;
}
