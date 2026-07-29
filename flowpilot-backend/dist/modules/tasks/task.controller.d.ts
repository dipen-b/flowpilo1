import { PlansService } from '../plans/plans.service';
import { ActivityService } from '../activity/activity.service';
export declare class TaskController {
    private readonly plansService;
    private readonly activityService;
    constructor(plansService: PlansService, activityService: ActivityService);
    createTask(createTaskDto: any): Promise<{
        status: string;
        data: {
            id: string;
            title: any;
            projectId: any;
            createdBy: any;
            createdAt: Date;
        };
    }>;
    updateTask(taskId: string, updateTaskDto: any): Promise<{
        status: string;
        data: any;
    }>;
    deleteTask(taskId: string, body: {
        deletedBy: string;
    }): Promise<{
        status: string;
        message: string;
    }>;
    getTasks(userId: string): Promise<{
        status: string;
        data: {
            id: string;
            title: string;
            projectId: string;
        }[];
    }>;
}
//# sourceMappingURL=task.controller.d.ts.map