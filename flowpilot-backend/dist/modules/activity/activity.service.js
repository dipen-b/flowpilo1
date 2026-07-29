"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const common_1 = require("@nestjs/common");
const activity_gateway_1 = require("../../gateway/activity.gateway");
let ActivityService = class ActivityService {
    constructor(activityGateway) {
        this.activityGateway = activityGateway;
        // In-memory storage for demo (would be database in production)
        this.activities = [];
    }
    /**
     * Create a new activity and broadcast it
     */
    createActivity(payload) {
        const activity = {
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
    getAllActivities() {
        return this.activities;
    }
    /**
     * Get activities by type
     */
    getActivitiesByType(type) {
        return this.activities.filter((a) => a.type === type);
    }
    /**
     * Get recent activities
     */
    getRecentActivities(limit = 50) {
        return this.activities.slice(0, limit);
    }
    /**
     * Clear all activities (admin function)
     */
    clearActivities() {
        this.activities = [];
    }
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [activity_gateway_1.ActivityGateway])
], ActivityService);
//# sourceMappingURL=activity.service.js.map