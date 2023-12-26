
export const fileFilter=(req:Request,file:Express.Multer.File,cb:Function)=>{

   if(!file) return cb(new Error('File is empty'),false);

   const fileExtension=file.mimetype.split('/')[1]
    
   const validaExtensions=['jpg','jpeg','png','gif'];

   if(!validaExtensions.includes(fileExtension)){

     return cb(null,false)

   }

    cb(null,true)

}