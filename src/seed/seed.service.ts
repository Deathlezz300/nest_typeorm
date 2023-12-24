import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
 
  constructor(
    private readonly productService:ProductsService
  ){

  }  


  async executeSeed(){

    return await this.insertNewProducts()

  }

  private async insertNewProducts(){
    await this.productService.deleteAllProducts();

    const products=initialData.products;

    const insertPromises=[];

    products.forEach(product=>{
      insertPromises.push(this.productService.create(product));
    })

    await Promise.all(insertPromises);

    return {
      ok:true
    }

  }


}


