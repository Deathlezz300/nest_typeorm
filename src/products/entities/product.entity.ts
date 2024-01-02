import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./productImage.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name:'products'})
export class Product {

    @ApiProperty({
        example:'24bc22b5-f647-4b12-9c3d-649577cdf972',
        description:'Product ID',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ApiProperty({
        example:'T-shirt teslo',
        description:'Product title',
        uniqueItems:true
    })
    @Column('text',{
        unique:true
    })
    title:string;

    @ApiProperty({
        example:0,
        description:'Product Price',
        
    })
    @Column('float',{
        default:0
    })
    price:number;

    @ApiProperty()
    @Column('text',{
        nullable:true
    })
    description:string;

    @ApiProperty({
        example:'teslo_t_shirt',
        description:'Product slug',
        uniqueItems:true
    })
    @Column('text',{
        unique:true
    })
    slug:string

    @ApiProperty()
    @Column('int',{
        default:0
    })
    stock:number;

    @ApiProperty({
        example:['S','M','L','XL'],
        description:'Product sizes',
    })
    @Column('text',{
        array:true
    })
    sizes:string[];

    @ApiProperty()
    @Column('text')
    gender:string;

    @ApiProperty()
    @Column('text',{
        array:true,
        default:[]
    })
    tags:string[]


    @ApiProperty()
    @OneToMany(
        ()=>ProductImage,
        productImage=>productImage.product,
        {cascade:true,eager:true}
    )
    images?:ProductImage[]

    @ManyToOne(
        ()=>User,
        user=>user.product,
        {onDelete:'CASCADE'}
    )
    user:User;

    @BeforeInsert()
    checkLogInsert(){
        if(!this.slug){
            this.slug=this.title;
        }
        this.slug=this.slug.toLowerCase()
        .replaceAll(" ",'_')
        .replaceAll("'",'');

    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug=this.slug.toLowerCase()
        .replaceAll(' ','_')
        .replaceAll("'",'');
    }

}
