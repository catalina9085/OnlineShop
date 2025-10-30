import {ProductImageModel} from './productImage.model';
import {CategoryModel} from './category.model';
import {ReviewModel} from './review.model';

export class ProductModel{
  id:number=-1;
  images:ProductImageModel[]=[];
  name:string='';
  description:string='';
  price:number=0;
  rating:number=0;
  stock:number=0;
  discount:number=0;
  finalPrice:number=0;
  createdAt:Date=new Date();
  sales:number=0;
  inWishlist:boolean=false;
  category:CategoryModel=new CategoryModel();
  reviews:ReviewModel[]=[];
}
