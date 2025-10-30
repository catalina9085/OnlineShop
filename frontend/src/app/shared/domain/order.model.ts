import {ProductModel} from './product.model';
import {OrderProductModel} from './orderProduct.model';
import {UserModel} from './user.model';

export class OrderModel{
  id:number=0;
  products:OrderProductModel[]=[];
  total:number=0;
  status:string='';
  createdAt:Date=new Date();
  user:UserModel=new UserModel();
}


