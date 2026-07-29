import { ActivityGateway } from '../../gateway/activity.gateway';
export interface Activity {
    id: string;
    type: 'project' | 'task' | 'file' | 'team' | 'comment' | 'sprint' | 'document';
    action: 'created' | 'updated' | 'deleted' | 'assigned' | 'shared' | 'completed' | 'commented' | 'mentioned';
    actor: string;
    target: string;
    description: string;
    timestamp: number;
    metadata?: {
        targetId?: string;
        targetUrl?: string;
        icon?: string;
        color?: string;
    };
}
export declare class ActivityService {
    private activityGateway;
    private activities;
    constructor(activityGateway: ActivityGateway);
    /**
     * Create a new activity and broadcast it
     */
    createActivity(payload: Omit<Activity, 'id' | 'timestamp'>): Activity;
    /**
     * Get all activities
     */
    getAllActivities(): Activity[];
    /**
     * Get activities by type
     */
    getActivitiesByType(type: Activity['type']): Activity[];
    /**
     * Get recent activities
     */
    getRecentActivities(limit?: number): Activity[];
    /**
     * Clear all activities (admin function)
     */
    clearActivities(): void;
}
//# sourceMappingURL=activity.service.d.ts.map