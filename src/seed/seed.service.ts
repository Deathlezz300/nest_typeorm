import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
 
  constructor(
    private readonly productService:ProductsService,
    @InjectRepository(User)
    private readonly userRepository:Repository<User>
  ){

  }  


  async executeSeed(){

    return await this.insertNewProducts()

  }

  private async insertNewProducts(){
    await this.DeleteTables();

    const user=await this.insertUsers();

    await this.productService.deleteAllProducts();

    const products=initialData.products;

    const insertPromises=[];

    products.forEach(product=>{
      insertPromises.push(this.productService.create(product,user));
    })

    await Promise.all(insertPromises);

    return {
      ok:true
    }

  }

  private async insertUsers(){
    const SeedUsers=initialData.users;

    const users:User[]=[];

    SeedUsers.forEach(us=>{
      users.push(this.userRepository.create({
        ...us,
        password:bcrypt.hashSync(us.password,10)
      }))
    })

    const dbUsers=await this.userRepository.save(users);

    return dbUsers[0]

  }


  private async DeleteTables(){

    const queryBuilder=this.userRepository.createQueryBuilder();
    await queryBuilder
    .delete()
    .where({})
    .execute();

  }


}


