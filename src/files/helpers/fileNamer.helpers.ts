import {Request} from 'express'


export const fileNamer=(req:Request,file:Express.Multer.File,cb:Function)=>{

   if(!file) return cb(new Error('File is empty'),false);

   const fileExtension=file.mimetype.split('/')[1];

   const fileName=`${crypto.randomUUID()}.${fileExtension}`

    cb(null,fileName)

}