import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { isUUID } from 'class-validator';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { ProductImage } from './entities/productImage.entity';

@Injectable()
export class ProductsService {

  private readonly logger=new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository:Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository:Repository<ProductImage>
  ){}

  async create(createProductDto: CreateProductDto) {
    
    try{

      // if(!createProductDto.slug){
      //   createProductDto.slug=createProductDto.title.toLowerCase()
      //   .replaceAll(' ','_')
      //   .replaceAll("'",'');
      // }

      const {images=[],...productDetails}=createProductDto;

      const producto=this.productRepository.create({
        ...productDetails,
        images:images.map(image=>this.productImageRepository.create({url:image}))
      })

      await this.productRepository.save(producto);

      return producto;


    }catch(error){
      this.handleExceptions(error);
    }



  }

  async findAll(paginationDto:PaginationDTO) {
    try{


      const {limit=10,offset=0}=paginationDto;

      const productos=this.productRepository.find({
          take:limit,
          skip:offset,
          relations:{
            images:true
          }
      });

      return (await productos).map(product=>({
        ...product,
        images:product.images.map(img=>img.url)
      }));

    }catch(error){
      this.handleExceptions(error)
    }
  }

  async findOne(id: string) {
    
    let producto:Product;

    if(isUUID(id)){
      producto=await this.productRepository.findOne({
        where:[{id}]
      })
    }else{
      const queryBuilder=this.productRepository.createQueryBuilder('prod');

      producto=await queryBuilder
      .where('LOWER(title) =:title or slug =:slug',{
        title:id.toLocaleLowerCase(),
        slug:id.toLocaleLowerCase()
      })
      .leftJoinAndSelect('prod.images','prodImages')
      .getOne()

    }

    if(!producto) throw new NotFoundException(`There isn't a product by ${id}`)

    return producto;

  }

  async findOnePlain(term:string){

    const {images=[],...rest}=await this.findOne(term);

    return{
      ...rest,
      images:images.map(img=>img.url)
    }

  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    
    try{

      const productoFind=updateProductDto.title ? await this.findOne(updateProductDto.title) : null;

      if(productoFind){
        throw new BadRequestException(`A product with ${updateProductDto.title} already exists`);
      }

      const productToUpdate=await this.productRepository.preload({
        id:id,
        ...updateProductDto,
        images:[]
      })

      if(!productToUpdate){
        throw new BadRequestException(`Product with ${id} doesn't exists`)
      }

      const productUpdated=await this.productRepository.save(productToUpdate);

      return productUpdated;

    }catch(error){
       return this.handleExceptions(error)
    }

  }

  async remove(id: string) {

      const productoToDelete=await this.findOne(id);

      await this.productRepository.remove(productoToDelete);

      return{
        ok:true
      }

  }

  private handleExceptions(error:any){


    if(error.code==='23505'){
      throw new BadRequestException(error.detail);
    }

    if(error.status){
      return error.response;
    }

    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, check server logs')

  }

}
