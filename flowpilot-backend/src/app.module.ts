import { Module } from '@nestjs/common';
import { ActivityGateway } from './gateway/activity.gateway';
import { ActivityService } from './modules/activity/activity.service';
import { TaskController } from './modules/tasks/task.controller';
import { ProjectController } from './modules/projects/project.controller';
import { ActivityController } from './modules/activity/activity.controller';
import { PlansModule } from './modules/plans/plans.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [PlansModule, PaymentsModule],
  controllers: [ActivityController, TaskController, ProjectController],
  providers: [ActivityGateway, ActivityService],
})
export class AppModule {}
