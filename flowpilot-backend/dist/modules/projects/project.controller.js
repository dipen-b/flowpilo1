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
exports.ProjectController = void 0;
const common_1 = require("@nestjs/common");
const plans_service_1 = require("../plans/plans.service");
const activity_service_1 = require("../activity/activity.service");
let ProjectController = class ProjectController {
    constructor(plansService, activityService) {
        this.plansService = plansService;
        this.activityService = activityService;
    }
    async createProject(createProjectDto) {
        const userPlan = 'free';
        const currentProjectCount = 5;
        const userInfo = {
            userId: createProjectDto.createdBy,
            plan: userPlan,
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
        });
        console.log(`✅ Project created: ${project.name}`);
        return { status: 'success', data: project };
    }
    async updateProject(projectId, updateProjectDto) {
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
        });
        return { status: 'success', data: project };
    }
    async deleteProject(projectId, body) {
        console.log(`🗑️ Deleting project ${projectId}`);
        await this.activityService.createActivity({
            type: 'project',
            action: 'deleted',
            actor: body.deletedBy,
            target: projectId,
            description: `Deleted project: ${projectId}`,
        });
        return { status: 'success', message: 'Project deleted' };
    }
    async getProjects(userId) {
        console.log(`📋 Getting projects for user ${userId}`);
        return {
            status: 'success',
            data: [
                { id: 'proj-1', name: 'Project 1', createdBy: userId },
                { id: 'proj-2', name: 'Project 2', createdBy: userId },
            ],
        };
    }
    async addTeamMember(projectId, body) {
        const userPlan = 'free';
        const currentMemberCount = 3;
        const userInfo = {
            userId: body.userId,
            plan: userPlan,
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
};
exports.ProjectController = ProjectController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "createProject", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "updateProject", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "deleteProject", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getProjects", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "addTeamMember", null);
exports.ProjectController = ProjectController = __decorate([
    (0, common_1.Controller)('api/projects'),
    __metadata("design:paramtypes", [plans_service_1.PlansService,
        activity_service_1.ActivityService])
], ProjectController);
//# sourceMappingURL=project.controller.js.map