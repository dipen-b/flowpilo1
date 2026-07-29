# FlowPilot Backend - Real-time Activity Server

NestJS backend with Socket.IO for real-time activity notifications.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Server will start on `http://localhost:3001`

### Build
```bash
npm run build
```

### Start (Production)
```bash
npm run start
```

---

## 📡 WebSocket Events

### Server → Client

**`activity:new`** - New activity broadcast to all connected clients
```javascript
{
  type: 'task' | 'project' | 'file' | 'team' | 'comment' | 'sprint' | 'document',
  action: 'created' | 'updated' | 'deleted' | 'assigned' | 'shared' | 'completed',
  actor: 'John Doe',           // Who performed the action
  target: 'My Task',            // What it was on
  description: 'John created task My Task',
  timestamp: 1690000000000,
  metadata: {
    targetId: 'task-123',
    targetUrl: '/tasks/task-123'
  }
}
```

**`server:status`** - Connection status updates
```javascript
{
  connectedClients: 5,
  timestamp: '2024-01-01T12:00:00Z'
}
```

### Client → Server

**`activity:create`** - Create activity from client
```javascript
socket.emit('activity:create', {
  type: 'comment',
  action: 'commented',
  actor: 'Jane Smith',
  target: 'Task #123',
  description: 'Jane commented on Task #123'
});
```

**`ping`** - Keep connection alive
```javascript
socket.emit('ping');
```

---

## 🔌 REST API Endpoints

### Activities
- `POST /api/activities` - Create activity
- `GET /api/activities` - Get all activities
- `GET /api/activities/recent/:limit` - Get recent activities
- `GET /api/activities/type/:type` - Get activities by type
- `POST /api/activities/clear` - Clear all activities

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

---

## 📝 Example Usage

### Create a Task (with real-time broadcast)
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement authentication",
    "description": "Add JWT auth",
    "projectId": "proj-1",
    "createdBy": "John Doe"
  }'
```

**Result:**
- Task created in backend
- Activity broadcast to all connected WebSocket clients
- Frontend notification page updates in real-time with new activity
- Activity feed updates with timeline

### Create a Project
```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Design System",
    "description": "Build reusable components",
    "createdBy": "Jane Smith"
  }'
```

### Update Task Status
```bash
curl -X PUT http://localhost:3001/api/tasks/task-123 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "updatedBy": "John Doe"
  }'
```

---

## 🔥 Key Features

### Real-time Broadcasting
When any resource is created/updated/deleted:
1. REST API processes request
2. Activity created with details
3. **WebSocket broadcasts to all connected clients**
4. Frontend receives and updates instantly
5. No page refresh needed

### Activity Types
- `project` - Project create/update/delete
- `task` - Task create/update/delete
- `file` - File upload/share
- `team` - Team member add/remove
- `comment` - Comment posted/edited
- `sprint` - Sprint start/end
- `document` - Document create/share

### Activity Actions
- `created` - Resource created
- `updated` - Resource changed
- `deleted` - Resource removed
- `assigned` - Task/item assigned
- `shared` - Resource shared
- `completed` - Task marked done
- `commented` - Comment posted
- `mentioned` - User mentioned

---

## 📊 Architecture

```
┌─────────────────┐
│   Frontend      │
│  (localhost:3000) - WebSocket connected
└────────┬────────┘
         │ WebSocket
         │
┌────────▼──────────┐
│ ActivityGateway   │ - Broadcasts events
│  (Socket.IO)      │ - Manages connections
└────────┬──────────┘
         │
┌────────▼──────────┐
│ ActivityService   │ - Stores activities
│  (In-memory)      │ - Triggers broadcasts
└────────┬──────────┘
         │
┌────────▼──────────┐
│ Controllers       │ - Handle REST API
│ (Task, Project)   │ - Call ActivityService
└───────────────────┘
```

---

## 🧪 Testing

### Test Real-time with cURL
```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Create task (broadcasts to frontend)
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "projectId": "proj-1",
    "createdBy": "Test User"
  }'
```

### Test with Frontend
1. Start backend: `npm run dev`
2. Frontend connects automatically
3. Create activity via cURL
4. Watch real-time update on http://localhost:3000/notifications

---

## 📚 File Structure

```
src/
├── main.ts                    # Application entry
├── app.module.ts             # Root module
├── gateway/
│   └── activity.gateway.ts   # WebSocket server
├── modules/
│   ├── activity/
│   │   ├── activity.service.ts
│   │   └── activity.controller.ts
│   ├── tasks/
│   │   └── task.controller.ts
│   └── projects/
│       └── project.controller.ts
└── dto/                       # Data transfer objects (future)
```

---

## 🔒 Security Notes

- CORS configured to allow only localhost:3000
- Update CORS_ORIGIN for production
- Add JWT authentication for production
- Validate all incoming requests
- Rate limit API endpoints
- Add database persistence

---

## 📈 Production Checklist

- [ ] Replace in-memory storage with database
- [ ] Add authentication/authorization
- [ ] Configure production CORS origin
- [ ] Set up error logging
- [ ] Add request validation
- [ ] Implement rate limiting
- [ ] Set up monitoring/alerts
- [ ] Configure SSL/TLS
- [ ] Load test with multiple users
- [ ] Document API for frontend team

---

## 🤝 Integration with Frontend

The frontend automatically:
1. Connects to `http://localhost:3001` on page load
2. Listens for `activity:new` events
3. Updates activity store in real-time
4. Refreshes notifications page
5. Shows live pulse animation
6. Updates activity feed timeline

No additional frontend configuration needed!

---

## 📞 Support

For issues:
1. Check console logs for errors
2. Verify Socket.IO server is running
3. Check CORS configuration
4. Verify port 3001 is available

```bash
# Check if port 3001 is available
lsof -i :3001
```

---

**Status:** ✅ Ready for testing with frontend
