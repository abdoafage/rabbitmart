import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @Transform(({ value }) => value?.trim()) // to remove leading and trailing white spaces
  @IsNotEmpty()
  @IsString()
  name: string;

  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  category: string;

  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  area: string;
}
