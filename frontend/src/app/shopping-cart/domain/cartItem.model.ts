import {ProductModel} from '../../shared/domain/product.model';

export class CartItemModel{
  id:number=0;
  product:ProductModel=new ProductModel();
  quantity:number=0;
}
