import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Get()
  findAll() {
    return this.spacesService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.spacesService.findById(id);
  }

  @Post()
  @Roles(Role.Admin)
  create(@Body() createSpaceDto: CreateSpaceDto) {
    return this.spacesService.create(createSpaceDto);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(
    @Body() updateSpaceDto: UpdateSpaceDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.spacesService.update(updateSpaceDto, id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.spacesService.delete(id);
  }
}
