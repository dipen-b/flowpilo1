"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const activity_gateway_1 = require("./gateway/activity.gateway");
const activity_service_1 = require("./modules/activity/activity.service");
const task_controller_1 = require("./modules/tasks/task.controller");
const project_controller_1 = require("./modules/projects/project.controller");
const activity_controller_1 = require("./modules/activity/activity.controller");
const plans_module_1 = require("./modules/plans/plans.module");
const payments_module_1 = require("./modules/payments/payments.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [plans_module_1.PlansModule, payments_module_1.PaymentsModule],
        controllers: [activity_controller_1.ActivityController, task_controller_1.TaskController, project_controller_1.ProjectController],
        providers: [activity_gateway_1.ActivityGateway, activity_service_1.ActivityService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map