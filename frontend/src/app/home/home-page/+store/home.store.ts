import {patchState, signalStore, withHooks, withMethods, withState} from '@ngrx/signals';
import {ProductModel} from '../../../shared/domain/product.model';
import {CategoryModel} from '../../../shared/domain/category.model';
import {HomeService} from '../../home.service';
import {inject} from '@angular/core';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {catchError, of, pipe, switchMap, tap} from 'rxjs';
import {FilterModel} from '../../../shared/domain/filter.model';

export const productsStore=signalStore(
  withState({
    products:[] as ProductModel[],
    categories:[] as CategoryModel[],
    filter:null as FilterModel | null
  }),
  withMethods((state,homeService=inject(HomeService))=>({
    loadProducts:rxMethod<FilterModel|null>(
      pipe(
        switchMap(filter=>homeService.getProducts(filter)
          .pipe(
            catchError(err=>of([] as ProductModel[]))
          )),
        tap(products=>patchState(state,{products:products}))
      )
    ),
    loadCategories:rxMethod<void>(
      pipe(
        switchMap(()=>homeService.getCategories()),
        tap(categories=>patchState(state,{categories:categories}))
      )
    ),
    updateFilter(filter:FilterModel|null){
      patchState(state,{filter:filter})
    },
    updateProducts(products:ProductModel[]){
      patchState(state,{products:products})
    },
  })),
  withHooks({
    onInit(store){
      store.loadProducts(store.filter);
      store.loadCategories();
    }
  })
);
