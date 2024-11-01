import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@Injectable()
export class SpacesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const spaces = await this.prisma.space.findMany({});

    if (!spaces) throw new InternalServerErrorException('Something went wrong');

    return spaces;
  }

  async findById(id: number) {
    const spaces = await this.prisma.space.findFirst({
      where: {
        id,
      },
    });

    if (!spaces) throw new NotFoundException(`Space with ID ${id} not found`);

    return spaces;
  }

  async create(createSpaceDto: CreateSpaceDto) {
    const space = await this.prisma.space.create({
      data: {
        title: createSpaceDto.title,
        description: createSpaceDto.description,
        price: createSpaceDto.price,
        capacity: createSpaceDto.capacity,
        address: createSpaceDto.address,
        availableTime: createSpaceDto.availableTime,
      },
    });

    if (!space) throw new InternalServerErrorException('Something went wrong');

    return space;
  }

  async update(updateSpaceDto: UpdateSpaceDto, id: number) {
    try {
      const space = await this.prisma.space.update({
        where: {
          id,
        },
        data: {
          title: updateSpaceDto.title,
          description: updateSpaceDto.description,
          price: updateSpaceDto.price,
          capacity: updateSpaceDto.capacity,
          address: updateSpaceDto.address,
          availableTime: updateSpaceDto.availableTime,
          isAvailable: updateSpaceDto.isAvailable,
        },
      });

      if (!space)
        throw new InternalServerErrorException('Something went wrong');

      return space;
    } catch (error) {
      if (error.code === 'P2025') {
        // P2025 is the code for "Record to update not found"
        throw new NotFoundException(`Space with ID ${id} not found`);
      }
      throw error; // Re-throw any other errors
    }
  }

  async delete(id: number) {
    try {
      const space = await this.prisma.space.delete({
        where: {
          id,
        },
      });

      if (!space)
        throw new InternalServerErrorException('Something went wrong');

      return space;
    } catch (error) {
      if (error.code === 'P2025') {
        // P2025 is the code for "Record to update not found"
        throw new NotFoundException(`Space with ID ${id} not found`);
      }
      throw error; // Re-throw any other errors
    }
  }
}
