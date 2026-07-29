import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PlansService } from '../plans/plans.service';
import { ActivityService } from '../activity/activity.service';

@Controller('api/projects')
export class ProjectController {
  constructor(
    private readonly plansService: PlansService,
    private readonly activityService: ActivityService
  ) {}

  @Post()
  async createProject(@Body() createProjectDto: any) {
    const userPlan = 'free';
    const currentProjectCount = 5;
    
    const userInfo = {
      userId: createProjectDto.createdBy,
      plan: userPlan as any,
      storageUsed: 0,
      projectCount: currentProjectCount,
      teamMemberCount: 0,
    };

    const canCreate = this.plansService.canCreateProject(userInfo);

    if (!canCreate.allowed) {
      console.log(`⚠️ Project limit reached for ${userPlan} plan`);
      return {
        status: 'error',
        code: 'PLAN_LIMIT_EXCEEDED',
        message: canCreate.message,
        currentCount: canCreate.currentValue,
        limit: canCreate.limit,
        upgradeUrl: '/pricing',
      };
    }

    const project = {
      id: `proj-${Date.now()}`,
      name: createProjectDto.name,
      createdBy: createProjectDto.createdBy,
      createdAt: new Date(),
    };

    await this.activityService.createActivity({
      type: 'project',
      action: 'created',
      actor: createProjectDto.createdBy,
      target: project.name,
      description: `Created project: ${project.name}`,
    } as any);

    console.log(`✅ Project created: ${project.name}`);

    return { status: 'success', data: project };
  }

  @Put(':id')
  async updateProject(@Param('id') projectId: string, @Body() updateProjectDto: any) {
    console.log(`✏️ Updating project ${projectId}`);

    const project = {
      id: projectId,
      ...updateProjectDto,
      updatedAt: new Date(),
    };

    await this.activityService.createActivity({
      type: 'project',
      action: 'updated',
      actor: updateProjectDto.updatedBy,
      target: project.name,
      description: `Updated project: ${project.name}`,
    } as any);

    return { status: 'success', data: project };
  }

  @Delete(':id')
  async deleteProject(@Param('id') projectId: string, @Body() body: { deletedBy: string }) {
    console.log(`🗑️ Deleting project ${projectId}`);

    await this.activityService.createActivity({
      type: 'project',
      action: 'deleted',
      actor: body.deletedBy,
      target: projectId,
      description: `Deleted project: ${projectId}`,
    } as any);

    return { status: 'success', message: 'Project deleted' };
  }

  @Get()
  async getProjects(@Query('userId') userId: string) {
    console.log(`📋 Getting projects for user ${userId}`);
    
    return {
      status: 'success',
      data: [
        { id: 'proj-1', name: 'Project 1', createdBy: userId },
        { id: 'proj-2', name: 'Project 2', createdBy: userId },
      ],
    };
  }

  @Post(':id/members')
  async addTeamMember(@Param('id') projectId: string, @Body() body: any) {
    const userPlan = 'free';
    const currentMemberCount = 3;

    const userInfo = {
      userId: body.userId,
      plan: userPlan as any,
      storageUsed: 0,
      projectCount: 0,
      teamMemberCount: currentMemberCount,
    };

    const canAdd = this.plansService.canAddTeamMember(userInfo);

    if (!canAdd.allowed) {
      console.log(`⚠️ Team member limit reached for ${userPlan} plan`);
      return {
        status: 'error',
        code: 'PLAN_LIMIT_EXCEEDED',
        message: canAdd.message,
        currentCount: canAdd.currentValue,
        limit: canAdd.limit,
        upgradeUrl: '/pricing',
      };
    }

    console.log(`👤 Added team member to project ${projectId}`);

    return {
      status: 'success',
      message: `Team member ${body.email} added to project`,
    };
  }
}
