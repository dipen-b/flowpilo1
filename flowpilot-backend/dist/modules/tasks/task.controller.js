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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const common_1 = require("@nestjs/common");
const plans_service_1 = require("../plans/plans.service");
const activity_service_1 = require("../activity/activity.service");
let TaskController = class TaskController {
    constructor(plansService, activityService) {
        this.plansService = plansService;
        this.activityService = activityService;
    }
    async createTask(createTaskDto) {
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
        });
        return { status: 'success', data: task };
    }
    async updateTask(taskId, updateTaskDto) {
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
        });
        return { status: 'success', data: task };
    }
    async deleteTask(taskId, body) {
        console.log(`🗑️ Deleting task ${taskId}`);
        await this.activityService.createActivity({
            type: 'task',
            action: 'deleted',
            actor: body.deletedBy,
            target: taskId,
            description: `Deleted task: ${taskId}`,
        });
        return { status: 'success', message: 'Task deleted' };
    }
    async getTasks(userId) {
        console.log(`📋 Getting tasks for user ${userId}`);
        return {
            status: 'success',
            data: [
                { id: 'task-1', title: 'Task 1', projectId: 'proj-1' },
                { id: 'task-2', title: 'Task 2', projectId: 'proj-1' },
            ],
        };
    }
};
exports.TaskController = TaskController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "createTask", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "deleteTask", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTasks", null);
exports.TaskController = TaskController = __decorate([
    (0, common_1.Controller)('api/tasks'),
    __metadata("design:paramtypes", [plans_service_1.PlansService,
        activity_service_1.ActivityService])
], TaskController);
//# sourceMappingURL=task.controller.js.map