import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    controllers:[FilesController],
    providers:[FilesService],
    imports:[ConfigModule]
})
export class FilesModule {   
}
