# Real-time WebSocket Updates - Setup & Integration Guide

**Date:** 2026-07-29  
**Status:** ✅ Frontend Ready - Awaiting Backend Integration  
**Technology:** Socket.IO + Zustand

---

## 🚀 Overview

Real-time notification and activity updates are now fully integrated into FlowPilot's frontend. The system is ready to connect to a backend server that emits WebSocket events.

---

## 📦 Architecture

### Components

#### 1. Socket Service (`/src/services/socket.ts`)
Core Socket.IO client wrapper with automatic reconnection handling.

**Key Functions:**
- `initializeSocket(url)` - Initialize connection
- `getSocket()` - Get current socket instance
- `disconnectSocket()` - Disconnect safely
- `emitActivity(eventName, data)` - Send event to server
- `onActivityEvent(eventName, callback)` - Listen for events
- `offActivityEvent(eventName)` - Remove listener
- `isSocketConnected()` - Check connection status

**Features:**
- ✅ Automatic reconnection (up to 5 attempts)
- ✅ WebSocket + polling fallback
- ✅ Connection state management
- ✅ Error logging

#### 2. Socket Hook (`/src/hooks/useSocket.ts`)
React hook for using Socket.IO in components.

**Usage:**
```typescript
const { socket, isConnected, emit, on, off } = useSocket();

// Listen for events
on('activity:new', (activity) => {
  console.log('New activity:', activity);
});

// Emit events
emit('activity:create', { type: 'task', action: 'created' });
```

#### 3. Realtime Store (`/src/stores/realtimeActivity.ts`)
Zustand store for managing real-time connection state and updates.

**State:**
- `isConnected` - WebSocket connection status
- `isLive` - Whether new updates just arrived (pulse effect)
- `lastUpdate` - Timestamp of last activity
- `updateCount` - Total updates received

**Methods:**
- `initializeRealtime()` - Set up listeners
- `cleanup()` - Clean up listeners
- `updateRealtimeStatus()` - Update state

#### 4. Real-time Status Components (`/src/components/RealtimeStatus.tsx`)
Visual indicators for connection status.

**Components:**
- `RealtimeStatus` - Compact status indicator
- `RealtimeIndicator` - Icon-only indicator with animations
- `RealtimeWidget` - Full widget with update count

---

## 🔌 How It Works

### Flow Diagram
```
User Action (e.g., Create Task)
        ↓
    Backend API
        ↓
    Server emits: "activity:new" via Socket.IO
        ↓
    Frontend receives event
        ↓
    useRealtimeStore listener triggered
        ↓
    useActivityStore.addActivity() called
        ↓
    UI updates automatically (Zustand reactivity)
        ↓
    Visual pulse effect shows new activity
        ↓
    Notification appears in real-time
```

### Event Flow
```
Socket.IO Server                Frontend
         │                        │
         │ "activity:new"         │
         ├─────────────────────→  realtimeActivity store
         │                        │
         │                        └→ useActivityStore.addActivity()
         │                        │
         │                        └→ UI Updates
         │                        │
         │ "connect"              │
         ├─────────────────────→  realtimeActivity store
         │                        │
         │                        └→ Display "Connected"
         │
         │ "disconnect"
         ├─────────────────────→  realtimeActivity store
         │                        │
         │                        └→ Display "Offline"
```

---

## 🔧 Backend Integration

### Server-Side Setup Required

#### 1. Socket.IO Server (Node.js/NestJS)
```typescript
// Example NestJS gateway
import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})
export class ActivityGateway {
  @WebSocketServer()
  server: Server;

  // When activity is created in DB
  broadcastActivity(activity: any) {
    this.server.emit('activity:new', {
      type: activity.type,
      action: activity.action,
      actor: activity.actor,
      target: activity.target,
      description: activity.description,
      metadata: activity.metadata
    });
  }
}
```

#### 2. Event Triggers
Add activity broadcasts when actions occur:

```typescript
// In Task Service
async createTask(data: CreateTaskDTO) {
  const task = await this.taskRepository.save(data);
  
  // Broadcast to all connected clients
  this.activityGateway.broadcastActivity({
    type: 'task',
    action: 'created',
    actor: `${user.firstName} ${user.lastName}`,
    target: task.title,
    description: `${user.firstName} created task ${task.title}`,
    metadata: {
      targetId: task.id,
      targetUrl: `/tasks/${task.id}`
    }
  });
  
  return task;
}
```

---

## 🚀 Configuration

### Default Settings
The frontend is configured to connect to:
- **URL:** `http://localhost:3001` (development)
- **Port:** 3001 (default backend port)

### Changing Connection URL

#### Option 1: Environment Variable
```env
# .env.local
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

#### Option 2: In Code
```typescript
import { useSocket } from '@/hooks/useSocket';

function MyComponent() {
  const { isConnected } = useSocket('http://api.example.com');
  // ...
}
```

#### Option 3: Global Initialization
```typescript
// In layout or root component
import { useSocket } from '@/hooks/useSocket';

export default function RootLayout() {
  useSocket(process.env.NEXT_PUBLIC_SOCKET_URL);
  return (
    // ...
  );
}
```

---

## 🎯 Usage Examples

### Example 1: Add Real-time to Any Page
```typescript
"use client";

import { useRealtimeStore } from "@/stores/realtimeActivity";
import { RealtimeWidget } from "@/components/RealtimeStatus";
import { useEffect } from "react";

export default function MyPage() {
  const { initializeRealtime, cleanup } = useRealtimeStore();

  useEffect(() => {
    const unsubscribe = initializeRealtime();
    return () => {
      unsubscribe?.();
      cleanup();
    };
  }, [initializeRealtime, cleanup]);

  return (
    <div>
      <RealtimeWidget /> {/* Shows connection status */}
      {/* Rest of your component */}
    </div>
  );
}
```

### Example 2: Listen to Specific Activity Type
```typescript
import { useSocket } from "@/hooks/useSocket";
import { useEffect } from "react";

export default function TaskNotifications() {
  const { on, off } = useSocket();

  useEffect(() => {
    const handleTaskActivity = (activity) => {
      if (activity.type === "task") {
        console.log(`Task ${activity.action}:`, activity.target);
        // Show notification, play sound, etc.
      }
    };

    on("activity:new", handleTaskActivity);

    return () => {
      off("activity:new", handleTaskActivity);
    };
  }, [on, off]);

  return <div>Listening for task updates...</div>;
}
```

### Example 3: Emit Custom Events
```typescript
import { useSocket } from "@/hooks/useSocket";

export default function ActivityCreator() {
  const { emit } = useSocket();

  const createActivity = () => {
    emit("activity:create", {
      type: "project",
      action: "created",
      target: "New Project"
    });
  };

  return <button onClick={createActivity}>Create Activity</button>;
}
```

---

## 📊 Real-time Status Indicators

### RealtimeWidget
Shows full status with update count:
```
🟢 Connected +5 updates
```

### RealtimeStatus
Compact indicator with optional label:
```
🟢 Connected    (with label)
🟢              (without label)
```

### RealtimeIndicator
Icon-only with animations:
```
⚡ (pulsing when live)
📡 (connected, not live)
📡 (offline)
```

---

## 🔄 Connection Lifecycle

### On Mount
1. Socket initializes with auto-reconnect config
2. Listeners set up for `activity:new`, `connect`, `disconnect`
3. Real-time status indicators ready

### On Activity Received
1. Event listener triggers
2. `useActivityStore.addActivity()` called
3. Activity added to store (reactive update)
4. `isLive` flag set to true (shows pulse)
5. After 3 seconds, pulse fades out
6. UI updates automatically

### On Unmount
1. Listeners cleaned up (no memory leaks)
2. Socket connection stays alive (for other components)
3. Store state persisted

---

## 🧪 Testing Real-time

### Manual Testing Steps

1. **Start Backend** (with Socket.IO server):
```bash
cd backend
npm run dev  # Starts on port 3001
```

2. **Start Frontend**:
```bash
npm run dev  # Starts on port 3000
```

3. **Open Browser DevTools**:
```javascript
// Check connection
localStorage.debug = 'socket.io-client:*'
```

4. **Trigger Activity** (via API or database):
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "New Task"}'
```

5. **Verify Real-time**:
   - Check Notifications page - activity appears instantly
   - Check Activity page - new entry in timeline
   - RealtimeWidget shows pulse effect
   - Console shows "Received real-time activity"

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to server"
**Solution:** Verify backend is running on correct port
```bash
# Check if port 3001 is listening
lsof -i :3001
```

### Issue: Events not received
**Solution:** Check server is broadcasting events
```typescript
// Add logging in server
console.log('Broadcasting activity:', activity);
```

### Issue: Connection keeps dropping
**Solution:** Check CORS configuration
```typescript
const io = new Server({
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
```

### Issue: Duplicate activities
**Solution:** Ensure single initialization
```typescript
// ✅ Good - Only in one place
useEffect(() => {
  initializeRealtime();
}, []);

// ❌ Bad - Multiple initializations
initializeRealtime();
initializeRealtime();
```

---

## 📈 Performance Considerations

### Optimizations Included
- ✅ Memoized selectors (no unnecessary re-renders)
- ✅ Event listener cleanup (no memory leaks)
- ✅ Automatic reconnection (reliable connection)
- ✅ Activity limit (500 max, prevents memory bloat)
- ✅ Live pulse timeout (resets after 3s, not continuous)

### Scaling Tips
1. **For 1000+ users:** Implement room-based subscriptions
```typescript
socket.emit('subscribe:workspace', { workspaceId: '123' });
server.to(`workspace:123`).emit('activity:new', activity);
```

2. **For heavy traffic:** Add activity batching
```typescript
// Emit every 100ms instead of immediately
const batch = [];
const emitBatch = () => server.emit('activities:batch', batch);
```

3. **For network efficiency:** Compress activity payload
```typescript
// Only send essential fields
const compactActivity = {
  t: activity.type,      // type
  a: activity.action,    // action
  x: activity.actor,     // actor
  r: activity.target     // target
};
```

---

## 🔒 Security Considerations

### Implemented
- ✅ Client validates connection URL
- ✅ Automatic reconnection prevents hammering
- ✅ Events logged for debugging
- ✅ No sensitive data in activity payload

### Recommended Backend
- Add authentication middleware
- Validate user has permission to see activity
- Rate limit activity creation
- Implement activity encryption for sensitive data

---

## ✅ Checklist for Production

- [ ] Backend Socket.IO server deployed
- [ ] CORS configured for production domain
- [ ] Environment variable set: `NEXT_PUBLIC_SOCKET_URL`
- [ ] Activity creation logged on backend
- [ ] Reconnection tested on poor network
- [ ] Real-time tested with multiple users
- [ ] Performance tested with 500+ concurrent users
- [ ] Error logging configured
- [ ] Monitoring set up for connection health

---

## 📚 References

- [Socket.IO Documentation](https://socket.io/docs/)
- [Socket.IO React Integration](https://socket.io/how-to/use-with-react)
- [NestJS WebSocket Gateway](https://docs.nestjs.com/websockets/gateways)

---

## 🎯 Next Steps

1. **Backend Development:**
   - Set up Socket.IO server
   - Implement activity broadcasting
   - Add event triggers in services

2. **Testing:**
   - Integration testing with backend
   - Load testing with 100+ concurrent users
   - Network failure simulation

3. **Monitoring:**
   - Connection health dashboard
   - Activity volume metrics
   - Latency tracking

4. **Polish:**
   - Sound notifications on activity
   - Browser notifications
   - Activity grouping/summarization
   - Notification preferences

---

**Status:** ✅ Frontend Complete - Ready for Backend Integration
