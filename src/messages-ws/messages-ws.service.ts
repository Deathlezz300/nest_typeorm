import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClientes{
    [id:string]:{
        socket:Socket,
        user:User
    }
}

@Injectable()
export class MessagesWsService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>
    ){}

    private connectedClientes:ConnectedClientes={};


    async registerClient(client:Socket,id:string){

        const user=await this.userRepository.findOneBy({id})

        if(!user || !user.isActive) {
            throw new Error('User not found')
        }

        this.checkUserConnected(user)

        this.connectedClientes[client.id]={
            socket:client,
            user
        };
    }

    removeClient(clientId:string){
        delete this.connectedClientes[clientId];
    }

    getConnectedClients(){
        return Object.keys(this.connectedClientes);
    }

    getUserFullName(socketId:string){

        return this.connectedClientes[socketId].user.fullName

    }

    private checkUserConnected(user:User){

        for(const clientId of Object.keys(this.connectedClientes)){
         
            const connectedClient=this.connectedClientes[clientId];

            if(connectedClient.user.id===user.id){
                connectedClient.socket.disconnect();
                break;
            }

        }

    }

}
