import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

export interface ActivityPayload {
  type: 'project' | 'task' | 'file' | 'team' | 'comment' | 'sprint' | 'document';
  action: 'created' | 'updated' | 'deleted' | 'assigned' | 'shared' | 'completed' | 'commented' | 'mentioned';
  actor: string;
  target: string;
  description: string;
  metadata?: {
    targetId?: string;
    targetUrl?: string;
    icon?: string;
    color?: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
@Injectable()
export class ActivityGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private connectedClients = new Set<string>();

  afterInit(server: Server) {
    console.log('✅ WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`✅ Client connected: ${client.id}`);
    this.connectedClients.add(client.id);
    this.broadcastConnectionStatus();
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
    this.broadcastConnectionStatus();
  }

  /**
   * Broadcast a new activity to all connected clients
   * Called from services when activities occur
   */
  broadcastActivity(activity: ActivityPayload) {
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
  private broadcastConnectionStatus() {
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
  @SubscribeMessage('activity:create')
  handleActivityCreate(client: Socket, data: ActivityPayload) {
    console.log(`📝 Received activity:create from ${client.id}:`, data);
    this.broadcastActivity(data);
    return { status: 'received' };
  }

  /**
   * Handle client ping to keep connection alive
   */
  @SubscribeMessage('ping')
  handlePing(client: Socket) {
    return { status: 'pong' };
  }
}
