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
exports.ActivityGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let ActivityGateway = class ActivityGateway {
    constructor() {
        this.connectedClients = new Set();
    }
    afterInit(server) {
        console.log('✅ WebSocket Gateway Initialized');
    }
    handleConnection(client) {
        console.log(`✅ Client connected: ${client.id}`);
        this.connectedClients.add(client.id);
        this.broadcastConnectionStatus();
    }
    handleDisconnect(client) {
        console.log(`❌ Client disconnected: ${client.id}`);
        this.connectedClients.delete(client.id);
        this.broadcastConnectionStatus();
    }
    /**
     * Broadcast a new activity to all connected clients
     * Called from services when activities occur
     */
    broadcastActivity(activity) {
        console.log(`📢 Broadcasting activity: ${activity.action} on ${activity.target}`);
        this.server.emit('activity:new', {
            type: activity.type,
            action: activity.action,
            actor: activity.actor,
            target: activity.target,
            description: activity.description,
            metadata: activity.metadata,
            timestamp: Date.now(),
        });
    }
    /**
     * Broadcast connection status to all clients
     */
    broadcastConnectionStatus() {
        const status = {
            connectedClients: this.connectedClients.size,
            timestamp: new Date().toISOString(),
        };
        console.log(`📊 Connection status: ${status.connectedClients} clients connected`);
        this.server.emit('server:status', status);
    }
    /**
     * Handle test activity creation from client
     */
    handleActivityCreate(client, data) {
        console.log(`📝 Received activity:create from ${client.id}:`, data);
        this.broadcastActivity(data);
        return { status: 'received' };
    }
    /**
     * Handle client ping to keep connection alive
     */
    handlePing(client) {
        return { status: 'pong' };
    }
};
exports.ActivityGateway = ActivityGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ActivityGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('activity:create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ActivityGateway.prototype, "handleActivityCreate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ActivityGateway.prototype, "handlePing", null);
exports.ActivityGateway = ActivityGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    }),
    (0, common_1.Injectable)()
], ActivityGateway);
//# sourceMappingURL=activity.gateway.js.map