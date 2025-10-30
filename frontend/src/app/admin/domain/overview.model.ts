import {OrderModel} from '../../shared/domain/order.model';
import {ProductModel} from '../../shared/domain/product.model';
import {RevenueModel} from './revenue.model';

export class OverviewModel{
  orders:OrderModel[]=[];
  bestSellers:ProductModel[]=[];
  total:number=0;
  soldProducts:number=0;
  placedOrders:number=0;
  dailyRevenue:RevenueModel[]=[];
  weeklyRevenue:RevenueModel[]=[];
  monthlyRevenue:RevenueModel[]=[];
}
