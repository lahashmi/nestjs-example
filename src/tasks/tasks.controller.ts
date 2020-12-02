import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

import { AddNewDto } from './dtos/addNew.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() addNewDto: AddNewDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(addNewDto, user);
  }

  @Delete('/:id')
  async deleteTask(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
