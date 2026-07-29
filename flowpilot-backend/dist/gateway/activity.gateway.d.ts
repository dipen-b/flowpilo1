import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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
export declare class ActivityGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private connectedClients;
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    /**
     * Broadcast a new activity to all connected clients
     * Called from services when activities occur
     */
    broadcastActivity(activity: ActivityPayload): void;
    /**
     * Broadcast connection status to all clients
     */
    private broadcastConnectionStatus;
    /**
     * Handle test activity creation from client
     */
    handleActivityCreate(client: Socket, data: ActivityPayload): {
        status: string;
    };
    /**
     * Handle client ping to keep connection alive
     */
    handlePing(client: Socket): {
        status: string;
    };
}
//# sourceMappingURL=activity.gateway.d.ts.map