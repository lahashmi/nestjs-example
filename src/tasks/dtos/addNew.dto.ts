import { IsNotEmpty } from 'class-validator';

export class AddNewDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
}
