import {ProductModel} from '../../home/models/product.model';

export class CartItemModel{
  id:number=0;
  product:ProductModel=new ProductModel();
  quantity:number=0;
}
