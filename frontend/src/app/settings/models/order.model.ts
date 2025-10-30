import {ProductModel} from '../../home/models/product.model';
import {OrderProductModel} from './orderProduct.model';

export class OrderModel{
  id:number=0;
  products:OrderProductModel[]=[];
  total:number=0;
  status:string='';
  createdAt:Date=new Date();
}
