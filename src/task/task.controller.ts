// src/task/task.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from 'src/common/enums/task-status.enum';

@ApiTags('tasks')
@UseGuards(AuthTokenGuard)
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.taskService.create(createTaskDto, tokenPayload);
  }

  @Get()
  findAll(@TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.taskService.findAll(tokenPayload);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.taskService.findOne(id, tokenPayload);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.taskService.remove(id, tokenPayload);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.taskService.update(id, updateTaskDto, tokenPayload);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: TaskStatus },
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.taskService.updateStatus(id, body.status, tokenPayload);
  }
}
