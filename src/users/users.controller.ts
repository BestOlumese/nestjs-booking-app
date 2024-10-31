import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  ParseFilePipeBuilder,
  Patch,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateAuthDto } from 'src/users/dto/update-auth.dto';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChangePasswordDto } from './dto/changepassword.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Patch('/edit')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Request() req,
    @Body() updateAuthDto: UpdateAuthDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /\/(jpeg|png|jpg)$/,
        })
        // .addMaxSizeValidator({
        //   maxSize: 1000,
        // })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file?: Express.Multer.File,
  ) {
    if (file) {
      const filePath = `${req.protocol}://${req.get('host')}/uploads/users/${file.filename}`; // Adjust path as needed
      updateAuthDto.imagePath = filePath; // Assuming 'imagePath' is the field in your DTO and DB
    }

    return this.userService.update(req.user.id, updateAuthDto);
  }

  @Delete('/delete')
  remove(@Request() req) {
    return this.userService.remove(req.user.id);
  }

  @Patch('/changepassword')
  changepassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changepassword(req.user.id, changePasswordDto);
  }
}
