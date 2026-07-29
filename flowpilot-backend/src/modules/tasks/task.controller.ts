import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PlansService } from '../plans/plans.service';
import { ActivityService } from '../activity/activity.service';

@Controller('api/tasks')
export class TaskController {
  constructor(
    private readonly plansService: PlansService,
    private readonly activityService: ActivityService
  ) {}

  @Post()
  async createTask(@Body() createTaskDto: any) {
    const userPlan = 'free';
    
    console.log(`📝 Creating task for user with ${userPlan} plan`);

    const task = {
      id: `task-${Date.now()}`,
      title: createTaskDto.title,
      projectId: createTaskDto.projectId,
      createdBy: createTaskDto.createdBy,
      createdAt: new Date(),
    };

    await this.activityService.createActivity({
      type: 'task',
      action: 'created',
      actor: createTaskDto.createdBy,
      target: task.title,
      description: `Created task: ${task.title}`,
    } as any);

    return { status: 'success', data: task };
  }

  @Put(':id')
  async updateTask(@Param('id') taskId: string, @Body() updateTaskDto: any) {
    console.log(`✏️ Updating task ${taskId}`);

    const task = {
      id: taskId,
      ...updateTaskDto,
      updatedAt: new Date(),
    };

    await this.activityService.createActivity({
      type: 'task',
      action: 'updated',
      actor: updateTaskDto.updatedBy,
      target: task.title,
      description: `Updated task: ${task.title}`,
    } as any);

    return { status: 'success', data: task };
  }

  @Delete(':id')
  async deleteTask(@Param('id') taskId: string, @Body() body: { deletedBy: string }) {
    console.log(`🗑️ Deleting task ${taskId}`);

    await this.activityService.createActivity({
      type: 'task',
      action: 'deleted',
      actor: body.deletedBy,
      target: taskId,
      description: `Deleted task: ${taskId}`,
    } as any);

    return { status: 'success', message: 'Task deleted' };
  }

  @Get()
  async getTasks(@Query('userId') userId: string) {
    console.log(`📋 Getting tasks for user ${userId}`);
    
    return {
      status: 'success',
      data: [
        { id: 'task-1', title: 'Task 1', projectId: 'proj-1' },
        { id: 'task-2', title: 'Task 2', projectId: 'proj-1' },
      ],
    };
  }
}
