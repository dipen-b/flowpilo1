import { PlansService } from '../plans/plans.service';
import { ActivityService } from '../activity/activity.service';
export declare class ProjectController {
    private readonly plansService;
    private readonly activityService;
    constructor(plansService: PlansService, activityService: ActivityService);
    createProject(createProjectDto: any): Promise<{
        status: string;
        code: string;
        message: string | undefined;
        currentCount: number | undefined;
        limit: number | undefined;
        upgradeUrl: string;
        data?: undefined;
    } | {
        status: string;
        data: {
            id: string;
            name: any;
            createdBy: any;
            createdAt: Date;
        };
        code?: undefined;
        message?: undefined;
        currentCount?: undefined;
        limit?: undefined;
        upgradeUrl?: undefined;
    }>;
    updateProject(projectId: string, updateProjectDto: any): Promise<{
        status: string;
        data: any;
    }>;
    deleteProject(projectId: string, body: {
        deletedBy: string;
    }): Promise<{
        status: string;
        message: string;
    }>;
    getProjects(userId: string): Promise<{
        status: string;
        data: {
            id: string;
            name: string;
            createdBy: string;
        }[];
    }>;
    addTeamMember(projectId: string, body: any): Promise<{
        status: string;
        code: string;
        message: string | undefined;
        currentCount: number | undefined;
        limit: number | undefined;
        upgradeUrl: string;
    } | {
        status: string;
        message: string;
        code?: undefined;
        currentCount?: undefined;
        limit?: undefined;
        upgradeUrl?: undefined;
    }>;
}
//# sourceMappingURL=project.controller.d.ts.map