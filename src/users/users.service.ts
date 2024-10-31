import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateAuthDto } from 'src/users/dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangePasswordDto } from './dto/changepassword.dto';
import * as argon from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<any> {
    return await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          name: updateAuthDto.name,
          image: updateAuthDto.imagePath,
        },
      });

      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        // P2025 is the code for "Record to update not found"
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error; // Re-throw any other errors
    }
  }

  async remove(id: number) {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id,
        },
      });

      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        // P2025 is the code for "Record to update not found"
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error; // Re-throw any other errors
    }
  }

  async changepassword(id: number, changePasswordDto: ChangePasswordDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) throw new NotFoundException(`User with ID ${id} not found`);

      const verifyPassword = await argon.verify(
        user.password,
        changePasswordDto.old_password,
      );

      const hashPassword = await argon.hash(changePasswordDto.new_password);
      if (user && verifyPassword) {
        await this.prisma.user.update({
          where: {
            id,
          },
          data: {
            password: hashPassword,
          },
        });

        return { message: 'Password changed sucessfully' };
      } else {
        throw new ForbiddenException('Invalid Password');
      }
    } catch (error) {
      if (error.code === 'P2025') {
        // P2025 is the code for "Record to update not found"
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error; // Re-throw any other errors
    }
  }
}
