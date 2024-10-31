import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/users', // Save files to the 'uploads' folder
        filename: (req, file, callback) => {
          // Generate a unique filename by appending a timestamp and a random number
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname); // Get the original file extension
          const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
          callback(null, filename);
        },
      }),
    }),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
