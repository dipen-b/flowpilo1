# Real-time WebSocket Testing Guide

**Created:** 2026-07-29  
**Status:** Ready for Backend Integration Testing

---

## 🧪 Testing Real-time Features

### Prerequisites
1. Backend with Socket.IO server running on port 3001
2. Activity logging endpoints implemented
3. WebSocket event broadcasting configured

### Manual Testing Workflow

#### Setup Phase
```bash
# Terminal 1: Start Backend
cd backend
npm run dev
# Should output: Socket.IO server running on port 3001

# Terminal 2: Start Frontend
cd flowpilot-frontend
npm run dev
# Should output: Next.js running on port 3000
```

#### Test 1: Initial Connection
1. Open http://localhost:3000/notifications
2. Check top-right corner
3. **Expected:** Widget shows "🟢 Connected" (if backend running)
4. **If shows "⭕ Offline":** Backend not accessible

#### Test 2: Real-time Activity Creation
1. Create a task via API or UI:
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Task",
    "description": "Real-time test",
    "projectId": "proj-1"
  }'
```

2. **Expected Outcomes:**
   - Activity appears instantly in Notifications page
   - "All caught up!" changes to show unread count
   - Pulse effect animates briefly
   - Timestamps show "Just now"
   - Update count increments in real-time widget

#### Test 3: Multiple Activity Types
Create different activity types and verify filtering:

```bash
# Create project
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Project"}'

# Comment on task
curl -X POST http://localhost:3001/api/tasks/task-1/comments \
  -H "Content-Type: application/json" \
  -d '{"text": "Great progress!"}'

# Share file
curl -X POST http://localhost:3001/api/files/file-1/share \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-2", "permission": "view"}'

# Add team member
curl -X POST http://localhost:3001/api/teams/team-1/members \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-3", "role": "member"}'
```

**Expected:** All activities appear in Activity Feed filtered by type

#### Test 4: Live Pulse Animation
1. Have Activity page open
2. Create an activity from another window
3. **Expected:** Real-time widget briefly shows pulse effect (⚡)
4. Pulse fades after 3 seconds
5. Widget returns to "🟢 Connected"

#### Test 5: Connection Loss
1. Open DevTools (F12)
2. Go to Network tab
3. Create activity (note it arrives)
4. Disconnect backend
5. **Expected:** Widget changes to "⭕ Offline"
6. Restart backend
7. **Expected:** Widget reconnects and shows "🟢 Connected"

#### Test 6: Activity Filtering
1. Create 5 different activity types
2. Click "Project" filter button
3. **Expected:** Only project activities visible
4. Click multiple filters (e.g., "Project" + "Task")
5. **Expected:** Both project and task activities shown
6. Click filter again to deselect
7. **Expected:** Returns to all activities

#### Test 7: Search + Real-time
1. Keep Notifications page open
2. Search for "John" in actor name
3. Create activities with different actors
4. **Expected:** Only John's activities appear in real-time
5. Clear search
6. **Expected:** All activities visible again

#### Test 8: Mark as Read
1. Open Notifications page
2. Create new activity
3. **Expected:** Appears with blue dot (unread)
4. Click activity's mark-as-read button
5. **Expected:** Blue dot disappears, "All caught up!" appears
6. Create another activity
7. Click "Mark all as read"
8. **Expected:** All activities marked read

#### Test 9: Multiple Users (Collaborative Testing)
1. Open same page in 2 browsers (localhost:3000)
2. In browser 1: Have Notifications page open
3. In browser 2: Create activities via API
4. **Expected:** Activities appear in real-time in browser 1
5. Activities created by both users visible in both browsers

#### Test 10: Performance Under Load
1. Have Activity page open
2. Simulate 100 rapid activities:
```bash
for i in {1..100}; do
  curl -X POST http://localhost:3001/api/activities \
    -H "Content-Type: application/json" \
    -d "{\"type\": \"task\", \"action\": \"created\", \"target\": \"Task $i\"}"
done
```

3. **Expected:**
   - All activities load smoothly
   - No browser lag
   - Update count shows 100+
   - Pagination works if implemented
   - Memory usage doesn't spike

---

## 🔍 Debugging Tips

### Check WebSocket Connection
```javascript
// In browser console
localStorage.debug = 'socket.io-client:*'
// Reload page - see detailed Socket.IO logs

// Check connection status
const socket = io('http://localhost:3001');
socket.on('connect', () => console.log('Connected!'));
socket.on('disconnect', () => console.log('Disconnected!'));
```

### Verify Events Being Sent
```javascript
// In Node.js backend
io.on('connection', (socket) => {
  console.log('New connection:', socket.id);
  
  // Log all emitted events
  socket.on('activity:new', (data) => {
    console.log('Activity received:', data);
  });
});
```

### Check React State
```javascript
// In browser DevTools React tab
// Open "Realtime Store" component
// Inspect: isConnected, isLive, updateCount, lastUpdate
```

### Network Tab Analysis
1. Open DevTools → Network tab
2. Filter by "WS" (WebSocket)
3. Look for Socket.IO messages
4. Should see frames with `42` (emit event type)

---

## ✅ Test Checklist

- [ ] Connection shows "Connected" when backend running
- [ ] Connection shows "Offline" when backend stopped
- [ ] Activity appears in real-time in notifications
- [ ] Activity appears in activity feed
- [ ] Multiple activity types filter correctly
- [ ] Search works with real-time activities
- [ ] Mark as read updates in real-time
- [ ] Mark all as read works
- [ ] Pulse animation shows on new activity
- [ ] No console errors
- [ ] No memory leaks after 1 hour runtime
- [ ] Reconnection works after disconnect
- [ ] Works with 2+ simultaneous users
- [ ] Handles 100+ activities smoothly
- [ ] Mobile responsive (test on tablet)

---

## 🐛 Common Issues & Solutions

### Issue: "⭕ Offline" Always Shows
**Cause:** Backend Socket.IO not running or wrong port
**Solution:**
```bash
# Verify backend is running
lsof -i :3001
# Should show: node listening on port 3001

# Check backend has Socket.IO
# Backend package.json should have: "socket.io": "^4.x"
```

### Issue: Activities Not Appearing
**Cause:** Server not emitting "activity:new" event
**Solution:**
```typescript
// Backend should emit like this:
io.emit('activity:new', {
  type: 'task',
  action: 'created',
  actor: 'John Doe',
  target: 'My Task',
  description: 'John created task My Task'
});
```

### Issue: Duplicate Activities
**Cause:** Event listener registered multiple times
**Solution:**
```typescript
// Ensure only one useEffect initializes
useEffect(() => {
  const unsubscribe = initializeRealtime();
  return unsubscribe;
}, []); // Empty dependency array!
```

### Issue: Console Errors About Socket
**Cause:** Trying to access socket when not initialized
**Solution:**
```typescript
// Always check isConnected first
if (isConnected) {
  emit('event', data);
}
```

### Issue: High Memory Usage
**Cause:** Activities list growing unbounded
**Solution:** Activity store limits to 500 (auto-cleanup)
```typescript
// In activity store
activities: [activity, ...state.activities].slice(0, 500)
```

---

## 📊 Performance Benchmarks

### Expected Metrics
- **Connection Time:** < 500ms
- **Event Latency:** < 100ms
- **Update Render Time:** < 50ms
- **Memory per 100 activities:** ~2MB
- **CPU on event:** < 5% spike
- **Concurrent Users:** 100+ (with proper scaling)

### How to Measure
```javascript
// In browser console
console.time('socket-emit');
socket.emit('activity:create', data);
console.timeEnd('socket-emit');

// In DevTools Performance tab
// Record 10 activity creations
// Check: Main thread time, JS execution time
```

---

## 🔒 Security Testing

### Test 1: Unauthorized Access
```javascript
// Without valid JWT
const socket = io('http://localhost:3001');
// Should fail or receive no events
```

### Test 2: Activity Validation
```bash
# Try invalid activity structure
curl -X POST http://localhost:3001/api/activities \
  -d '{"invalid": "data"}'
# Should reject with error
```

### Test 3: Rate Limiting
```bash
# Send 1000 requests in 1 second
for i in {1..1000}; do
  curl -X POST http://localhost:3001/api/activities -d '{...}'
done
# Should rate limit after N requests
```

---

## 📈 Load Testing Script

```bash
#!/bin/bash
# load-test.sh

BACKEND_URL="http://localhost:3001"
NUM_ACTIVITIES=1000
CONCURRENT=10

echo "Starting load test..."
echo "Creating $NUM_ACTIVITIES activities with $CONCURRENT concurrent requests"

for ((i=1; i<=NUM_ACTIVITIES; i+=CONCURRENT)); do
  for ((j=0; j<CONCURRENT && i+j<=NUM_ACTIVITIES; j++)); do
    curl -X POST "$BACKEND_URL/api/activities" \
      -H "Content-Type: application/json" \
      -d "{
        \"type\": \"task\",
        \"action\": \"created\",
        \"target\": \"Activity $((i+j))\"
      }" &
  done
  wait
  echo "Completed $((i-1+j)) activities..."
done

echo "Load test complete!"
```

Run with:
```bash
chmod +x load-test.sh
./load-test.sh
```

---

## 📱 Mobile Testing

### Test on Mobile Device
1. Get local machine IP: `ifconfig` (macOS) or `ipconfig` (Windows)
2. Access from mobile: `http://YOUR_IP:3000`
3. Open Notifications page
4. Test real-time updates
5. **Check:**
   - Widget displays correctly
   - Touch interactions work
   - Animations smooth
   - No layout issues

---

## 🎬 Demo Scenario

Perfect for showcasing real-time:

1. **Setup:** 2 browser windows, both on localhost:3000/notifications
2. **Window 1:** Show Notifications page
3. **Window 2:** Open API playground or backend dashboard
4. **Action:** Create 5 activities from Window 2
5. **Result:** All appear instantly in Window 1
6. **Demo:** Show pulse animation, filtering, marking as read

---

## 📞 Support

For issues during testing:
1. Check browser console for errors
2. Check backend logs for broadcast errors
3. Verify Socket.IO version matches: `4.8.3`
4. Restart both frontend and backend
5. Clear browser cache (Shift + Refresh)

---

**Status:** Ready for Testing ✅
**Next:** Complete backend implementation and integration testing
