import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {

  getStaticProductImage(imagenName:string){

    const path=join(__dirname,'../../static/products',imagenName);

    if(!existsSync(path)){

      throw new BadRequestException(`No product found with image ${imagenName}`);
    }

    

    return path;

  }

}
