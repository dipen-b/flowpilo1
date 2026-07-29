import { ActivityService, Activity } from './activity.service';
export declare class ActivityController {
    private activityService;
    constructor(activityService: ActivityService);
    createActivity(body: {
        type: Activity['type'];
        action: Activity['action'];
        actor: string;
        target: string;
        description: string;
        metadata?: Activity['metadata'];
    }): {
        status: string;
        data: Activity;
    };
    getAllActivities(): {
        status: string;
        data: Activity[];
    };
    getRecentActivities(limit: string): {
        status: string;
        data: Activity[];
    };
    getActivitiesByType(type: Activity['type']): {
        status: string;
        data: Activity[];
    };
    clearActivities(): {
        status: string;
        message: string;
    };
}
//# sourceMappingURL=activity.controller.d.ts.map