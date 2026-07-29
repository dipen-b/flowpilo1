import { Injectable } from '@nestjs/common';
import { ActivityGateway, ActivityPayload } from '../../gateway/activity.gateway';

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

@Injectable()
export class ActivityService {
  // In-memory storage for demo (would be database in production)
  private activities: Activity[] = [];

  constructor(private activityGateway: ActivityGateway) {}

  /**
   * Create a new activity and broadcast it
   */
  createActivity(payload: Omit<Activity, 'id' | 'timestamp'>): Activity {
    const activity: Activity = {
      ...payload,
      id: `activity-${Date.now()}`,
      timestamp: Date.now(),
    };

    // Store activity
    this.activities.unshift(activity);
    // Keep only last 500 activities
    if (this.activities.length > 500) {
      this.activities = this.activities.slice(0, 500);
    }

    // Broadcast to all connected clients
    this.activityGateway.broadcastActivity(payload);

    return activity;
  }

  /**
   * Get all activities
   */
  getAllActivities(): Activity[] {
    return this.activities;
  }

  /**
   * Get activities by type
   */
  getActivitiesByType(type: Activity['type']): Activity[] {
    return this.activities.filter((a) => a.type === type);
  }

  /**
   * Get recent activities
   */
  getRecentActivities(limit: number = 50): Activity[] {
    return this.activities.slice(0, limit);
  }

  /**
   * Clear all activities (admin function)
   */
  clearActivities(): void {
    this.activities = [];
  }
}
