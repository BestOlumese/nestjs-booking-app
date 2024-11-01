import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateSpaceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  availableTime: string;

  @IsBoolean()
  isAvailable: boolean;
}
