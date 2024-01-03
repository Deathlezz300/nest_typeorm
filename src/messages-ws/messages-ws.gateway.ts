import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/newMessage.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt.interface';

@WebSocketGateway({cors:true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss:Server

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService:JwtService
    ) {}
  
  async handleConnection(client:Socket) {


    const token=client.handshake.headers.authentication as string;
    let payload:JwtPayload;

    try{

      payload=this.jwtService.verify(token);

      await this.messagesWsService.registerClient(client,payload.id);      

    }catch(error){
      client.disconnect();
    }


    //unir al usuario a una sala y enviar un mensaje para 
    //esa sala en especifico

    // client.join('ventas');

    // this.wss.to('ventas').emit('message-server-ventas','hola');

    //emitir mensaje a todos los usuarios
      this.wss.emit('clients-updated',this.messagesWsService.getConnectedClients());

  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);

    this.wss.emit('clients-updated',this.messagesWsService.getConnectedClients());

  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(cliente:Socket,payload:NewMessageDto){

    //emitir este mensaje a todo el mundo menos al dueño del socket
    cliente.broadcast.emit('message-from-server',{
      fullName:this .messagesWsService.getUserFullName(cliente.id),
      message:payload.message
    });

  }

  

}
