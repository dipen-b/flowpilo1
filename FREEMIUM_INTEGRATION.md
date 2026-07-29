# 🚀 Freemium System Integration Guide

**How to integrate plan limits into your existing API endpoints**

---

## ✅ What's Been Created

### Backend Files
1. **`/src/config/plans.ts`** - Plan limits and feature definitions
2. **`/src/modules/plans/plans.service.ts`** - Plan checking logic
3. **`/src/modules/plans/plans.controller.ts`** - Plan API endpoints
4. **`/src/modules/plans/plans.module.ts`** - Module definition
5. **`/src/app.module.ts`** - Updated to include PlansModule

### Available Endpoints
```bash
# Get all plans pricing
GET /api/plans

# Get specific plan
GET /api/plans/:plan

# Check feature access
POST /api/plans/check-feature
Body: { plan: "pro", feature: "ganttChart" }

# Check project limit
POST /api/plans/check-project-limit
Body: { plan: "free", currentProjectCount: 4 }

# Check team member limit
POST /api/plans/check-member-limit
Body: { plan: "free", currentMemberCount: 2 }

# Check storage limit
POST /api/plans/check-storage-limit
Body: { plan: "free", currentUsage: 400000000, fileSize: 150000000 }
```

---

## 🔧 How to Use in Controllers

### 1. Import PlansService in Your Controller

```typescript
// src/modules/tasks/task.controller.ts
import { Controller, Post, Body, Inject } from '@nestjs/common';
import { PlansService } from '../plans/plans.service';

@Controller('api/tasks')
export class TaskController {
  constructor(
    private readonly plansService: PlansService,
    private readonly taskService: TaskService
  ) {}
```

### 2. Add User Plan Info Retrieval

First, get the user's plan and usage info:

```typescript
private async getUserPlanInfo(userId: string) {
  // Replace with your actual user/database logic
  const user = await this.userService.findById(userId);
  const projectCount = await this.projectService.countByUser(userId);
  const teamMemberCount = await this.teamService.countMembers(userId);
  
  return {
    userId,
    plan: user.plan, // 'free', 'pro', 'enterprise'
    storageUsed: user.storageUsed || 0,
    projectCount,
    teamMemberCount
  };
}
```

### 3. Check Limits Before Creating Tasks

```typescript
@Post()
async createTask(@Body() createTaskDto: CreateTaskDTO) {
  const userInfo = await this.getUserPlanInfo(createTaskDto.userId);
  
  // Tasks are usually unlimited, but check project creation limits
  // if task creation is limited in your plan
  
  // Create task
  const task = await this.taskService.create(createTaskDto);
  
  return {
    status: 'success',
    data: task
  };
}
```

### 4. Check Project Limit Before Creating Projects

```typescript
@Post()
async createProject(@Body() createProjectDto: CreateProjectDTO) {
  const userInfo = await this.getUserPlanInfo(createProjectDto.userId);
  
  // Check if user can create more projects
  const canCreate = this.plansService.canCreateProject(userInfo);
  
  if (!canCreate.allowed) {
    return {
      status: 'error',
      code: 'PLAN_LIMIT_EXCEEDED',
      message: canCreate.message,
      currentCount: canCreate.currentValue,
      limit: canCreate.limit,
      upgradeUrl: '/pricing'
    };
  }
  
  // Create project
  const project = await this.projectService.create(createProjectDto);
  
  return {
    status: 'success',
    data: project
  };
}
```

### 5. Check Team Member Limit Before Adding Members

```typescript
@Post('members')
async addTeamMember(@Body() addMemberDto: AddMemberDTO) {
  const userInfo = await this.getUserPlanInfo(addMemberDto.userId);
  
  // Check if user can add more team members
  const canAdd = this.plansService.canAddTeamMember(userInfo);
  
  if (!canAdd.allowed) {
    return {
      status: 'error',
      code: 'PLAN_LIMIT_EXCEEDED',
      message: canAdd.message,
      currentCount: canAdd.currentValue,
      limit: canAdd.limit,
      upgradeUrl: '/pricing'
    };
  }
  
  // Add team member
  const member = await this.teamService.addMember(addMemberDto);
  
  return {
    status: 'success',
    data: member
  };
}
```

### 6. Check Storage Limit Before File Upload

```typescript
@Post('upload')
async uploadFile(@Body() uploadDto: UploadDTO) {
  const userInfo = await this.getUserPlanInfo(uploadDto.userId);
  
  // Check storage limit
  const canUpload = this.plansService.canUploadFile(userInfo, uploadDto.fileSize);
  
  if (!canUpload.allowed) {
    return {
      status: 'error',
      code: 'STORAGE_LIMIT_EXCEEDED',
      message: canUpload.message,
      currentUsage: canUpload.currentValue,
      limit: canUpload.limit,
      upgradeUrl: '/pricing'
    };
  }
  
  // Upload file
  const file = await this.fileService.upload(uploadDto);
  
  // Update user storage used
  await this.userService.updateStorageUsed(uploadDto.userId, uploadDto.fileSize);
  
  return {
    status: 'success',
    data: file
  };
}
```

### 7. Check Feature Access for Protected Features

```typescript
@Post('advanced-reports')
async generateAdvancedReport(@Body() reportDto: ReportDTO) {
  const user = await this.userService.findById(reportDto.userId);
  
  // Check if feature is available in plan
  const canAccess = this.plansService.checkFeatureAccess(user.plan, 'advancedReports');
  
  if (!canAccess.allowed) {
    return {
      status: 'error',
      code: 'FEATURE_NOT_AVAILABLE',
      message: canAccess.message,
      upgradeUrl: '/pricing'
    };
  }
  
  // Generate report
  const report = await this.reportService.generate(reportDto);
  
  return {
    status: 'success',
    data: report
  };
}
```

---

## 📋 Updated Task Controller Example

```typescript
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PlansService } from '../plans/plans.service';
import { ActivityService } from '../activity/activity.service';

@Controller('api/tasks')
export class TaskController {
  constructor(
    private readonly plansService: PlansService,
    private readonly activityService: ActivityService,
    private readonly taskService: TaskService,
    private readonly userService: UserService,
    private readonly projectService: ProjectService
  ) {}

  private async getUserPlanInfo(userId: string) {
    const user = await this.userService.findById(userId);
    const projectCount = await this.projectService.countByUser(userId);
    
    return {
      userId,
      plan: user.plan,
      storageUsed: user.storageUsed || 0,
      projectCount,
      teamMemberCount: 0
    };
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDTO) {
    const userInfo = await this.getUserPlanInfo(createTaskDto.userId);
    
    // Create task (no limit check needed for tasks usually)
    const task = await this.taskService.create(createTaskDto);

    // Broadcast activity
    await this.activityService.createActivity({
      type: 'task',
      action: 'created',
      actor: createTaskDto.userId,
      target: task.title,
      description: `Created task: ${task.title}`,
      timestamp: Date.now()
    });

    return {
      status: 'success',
      data: task
    };
  }

  @Put(':id')
  async updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDTO
  ) {
    const task = await this.taskService.update(taskId, updateTaskDto);

    // Broadcast activity
    await this.activityService.createActivity({
      type: 'task',
      action: 'updated',
      actor: updateTaskDto.updatedBy,
      target: task.title,
      description: `Updated task: ${task.title}`,
      timestamp: Date.now()
    });

    return {
      status: 'success',
      data: task
    };
  }

  @Delete(':id')
  async deleteTask(
    @Param('id') taskId: string,
    @Body() body: { deletedBy: string }
  ) {
    const task = await this.taskService.findById(taskId);
    await this.taskService.delete(taskId);

    // Broadcast activity
    await this.activityService.createActivity({
      type: 'task',
      action: 'deleted',
      actor: body.deletedBy,
      target: task.title,
      description: `Deleted task: ${task.title}`,
      timestamp: Date.now()
    });

    return {
      status: 'success',
      message: 'Task deleted'
    };
  }

  @Get()
  async getTasks(@Query('userId') userId: string) {
    return {
      status: 'success',
      data: await this.taskService.findByUser(userId)
    };
  }
}
```

---

## 📋 Updated Project Controller Example

```typescript
import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { PlansService } from '../plans/plans.service';
import { ActivityService } from '../activity/activity.service';

@Controller('api/projects')
export class ProjectController {
  constructor(
    private readonly plansService: PlansService,
    private readonly activityService: ActivityService,
    private readonly projectService: ProjectService,
    private readonly userService: UserService
  ) {}

  private async getUserPlanInfo(userId: string) {
    const user = await this.userService.findById(userId);
    const projectCount = await this.projectService.countByUser(userId);
    
    return {
      userId,
      plan: user.plan,
      storageUsed: user.storageUsed || 0,
      projectCount,
      teamMemberCount: 0
    };
  }

  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDTO) {
    const userInfo = await this.getUserPlanInfo(createProjectDto.createdBy);

    // Check project creation limit
    const canCreate = this.plansService.canCreateProject(userInfo);
    if (!canCreate.allowed) {
      return {
        status: 'error',
        code: 'PLAN_LIMIT_EXCEEDED',
        message: canCreate.message,
        currentCount: canCreate.currentValue,
        limit: canCreate.limit,
        upgradeUrl: '/pricing'
      };
    }

    // Create project
    const project = await this.projectService.create(createProjectDto);

    // Broadcast activity
    await this.activityService.createActivity({
      type: 'project',
      action: 'created',
      actor: createProjectDto.createdBy,
      target: project.name,
      description: `Created project: ${project.name}`,
      timestamp: Date.now()
    });

    return {
      status: 'success',
      data: project
    };
  }

  @Put(':id')
  async updateProject(
    @Param('id') projectId: string,
    @Body() updateProjectDto: UpdateProjectDTO
  ) {
    const project = await this.projectService.update(projectId, updateProjectDto);

    // Broadcast activity
    await this.activityService.createActivity({
      type: 'project',
      action: 'updated',
      actor: updateProjectDto.updatedBy,
      target: project.name,
      description: `Updated project: ${project.name}`,
      timestamp: Date.now()
    });

    return {
      status: 'success',
      data: project
    };
  }

  @Delete(':id')
  async deleteProject(
    @Param('id') projectId: string,
    @Body() body: { deletedBy: string }
  ) {
    const project = await this.projectService.findById(projectId);
    await this.projectService.delete(projectId);

    // Broadcast activity
    await this.activityService.createActivity({
      type: 'project',
      action: 'deleted',
      actor: body.deletedBy,
      target: project.name,
      description: `Deleted project: ${project.name}`,
      timestamp: Date.now()
    });

    return {
      status: 'success',
      message: 'Project deleted'
    };
  }

  @Get()
  async getProjects(@Query('userId') userId: string) {
    return {
      status: 'success',
      data: await this.projectService.findByUser(userId)
    };
  }
}
```

---

## 🎯 Testing the Plans API

### Test Get All Plans
```bash
curl http://localhost:3001/api/plans | jq
```

### Test Get Specific Plan
```bash
curl http://localhost:3001/api/plans/pro | jq
```

### Test Feature Check
```bash
curl -X POST http://localhost:3001/api/plans/check-feature \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "free",
    "feature": "ganttChart"
  }' | jq
```

Expected response:
```json
{
  "status": "success",
  "data": {
    "allowed": false,
    "message": "This feature is only available on the Pro plan",
    "upgradeUrl": "/pricing"
  }
}
```

### Test Project Limit
```bash
curl -X POST http://localhost:3001/api/plans/check-project-limit \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "free",
    "currentProjectCount": 5
  }' | jq
```

Expected response:
```json
{
  "status": "success",
  "data": {
    "allowed": false,
    "message": "You've reached the limit of 5 projects for the free plan",
    "currentValue": 5,
    "limit": 5,
    "upgradeUrl": "/pricing"
  }
}
```

---

## 📊 Plan Structure

### Free Plan
- **Price:** $0/month
- **Projects:** 5
- **Team Members:** 3
- **Storage:** 500MB
- **Activity Entries:** 100
- **Features:** Basic views, search, comments
- **Disabled:** Gantt charts, reports, integrations

### Pro Plan
- **Price:** $29/month ($290/year)
- **Projects:** Unlimited
- **Team Members:** 50
- **Storage:** 10GB
- **Activity Entries:** 10,000
- **Features:** All of Free + Advanced views, integrations, custom workflows
- **Disabled:** SSO/SAML

### Enterprise Plan
- **Price:** Custom
- **Everything:** Unlimited
- **Features:** All features including SSO/SAML, white-label, compliance

---

## 🔐 Security Considerations

1. **Always validate on backend** - Never trust client-side checks
2. **Check auth before limit checks** - Ensure user is authenticated
3. **Log limit violations** - Track when users hit limits (for analytics)
4. **Don't expose limits in error** - Be vague about why features are unavailable
5. **Cache user info** - Don't query database on every check

Example with caching:
```typescript
private userPlanCache = new Map<string, any>();

private async getUserPlanInfo(userId: string) {
  // Check cache first (5 minute TTL)
  const cached = this.userPlanCache.get(userId);
  if (cached && cached.expireAt > Date.now()) {
    return cached.data;
  }

  // Fetch from database
  const userInfo = {
    userId,
    plan: user.plan,
    storageUsed: user.storageUsed || 0,
    projectCount,
    teamMemberCount
  };

  // Cache for 5 minutes
  this.userPlanCache.set(userId, {
    data: userInfo,
    expireAt: Date.now() + 5 * 60 * 1000
  });

  return userInfo;
}
```

---

## ✅ Next Steps

1. ✅ Plans module created and integrated
2. ⏳ Update task/project controllers to check limits
3. ⏳ Add plan field to user database
4. ⏳ Implement Stripe integration
5. ⏳ Create frontend pricing page
6. ⏳ Add upgrade modals in frontend

Ready to implement the next part! 🚀
