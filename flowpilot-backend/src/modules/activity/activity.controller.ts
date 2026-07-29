import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ActivityService, Activity } from './activity.service';

@Controller('api/activities')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Post()
  createActivity(
    @Body()
    body: {
      type: Activity['type'];
      action: Activity['action'];
      actor: string;
      target: string;
      description: string;
      metadata?: Activity['metadata'];
    },
  ) {
    const activity = this.activityService.createActivity({
      type: body.type,
      action: body.action,
      actor: body.actor,
      target: body.target,
      description: body.description,
      metadata: body.metadata,
    });

    return {
      status: 'success',
      data: activity,
    };
  }

  @Get()
  getAllActivities() {
    return {
      status: 'success',
      data: this.activityService.getAllActivities(),
    };
  }

  @Get('recent/:limit')
  getRecentActivities(@Param('limit') limit: string) {
    return {
      status: 'success',
      data: this.activityService.getRecentActivities(parseInt(limit, 10)),
    };
  }

  @Get('type/:type')
  getActivitiesByType(@Param('type') type: Activity['type']) {
    return {
      status: 'success',
      data: this.activityService.getActivitiesByType(type),
    };
  }

  @Post('clear')
  clearActivities() {
    this.activityService.clearActivities();
    return {
      status: 'success',
      message: 'All activities cleared',
    };
  }
}
