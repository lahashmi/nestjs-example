import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { AddNewDto } from './dtos/addNew.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(getTasksFilterDto: GetTasksFilterDto, user: User) {
    return this.taskRepository.getTasks(getTasksFilterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const response = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async createTask(addNewDto: AddNewDto, user: User): Promise<Task> {
    const res = await this.taskRepository.createTask(addNewDto, user);
    return res;
  }

  async deleteTask(id, user: User): Promise<any> {
    const { affected } = await this.taskRepository.delete({
      id,
      userId: user.id,
    });
    if (!affected) throw new NotFoundException();
    return { affected };
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<any> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}
