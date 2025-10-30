import {AdminService} from '../../admin.service';
import {patchState, signalStore, withHooks, withMethods, withState} from '@ngrx/signals';
import {inject, input, signal} from '@angular/core';
import {NewProductModel} from '../../domain/newProduct.model';
import {CategoryModel} from '../../../shared/domain/category.model';
import {ReviewModel} from '../../../shared/domain/review.model';
import {ProductImageModel} from '../../../shared/domain/productImage.model';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {of, pipe, switchMap, tap} from 'rxjs';
import {NewProductComponent} from '../new-product.component';
import {ProductImageService} from '../../../shared/services/product-image.service';
import {NgForm} from '@angular/forms';


export const productStore=signalStore(
  withState({
    productId:undefined as number|undefined,
    newProduct:new NewProductModel(),
    categories: [] as CategoryModel[],
    reviews:[] as ReviewModel[],
    images:[] as ProductImageModel[],
    imageUrls:[] as string[],
    message:''
  }),
  withMethods((state,adminService=inject(AdminService),imageService=inject(ProductImageService))=>({
    loadCategories:rxMethod<void>(
      pipe(
        switchMap(()=>adminService.getCategories()),
        tap(categories=>patchState(state,{categories:categories}))
      )
    ),
    loadProduct:rxMethod<number|undefined>(
      pipe(
        tap(productId=>console.log("i am loading products "+productId)),
        switchMap(productId=>{
          if (productId)
            return adminService.getProduct(productId).pipe(
              tap(product=>{
                let updatedProduct=new NewProductModel();
                Object.assign(updatedProduct,{...product,...state.newProduct,productCategory:product.category.name});
                patchState(state,{
                  newProduct:updatedProduct,
                  reviews:product.reviews,
                  images:product.images,
                  imageUrls:imageService.getImageUrlsForProduct(product)
                })
              })
            );
          else return of(null)
        }
        ),
      )
    ),
    updateProduct(product:NewProductModel){
      patchState(state,{newProduct:product})
    },
    updateProductId(productId:number|undefined){
      console.log("i am updating the id: ",productId)
      patchState(state,{productId:productId})
    },
    onSubmit(form:NgForm){
      if(form.valid){
        let formData=new FormData();
        formData.append("name",state.newProduct().name);
        formData.append("description",state.newProduct().description);
        formData.append("price",state.newProduct().price.toString());
        formData.append("stock",state.newProduct().stock.toString());
        formData.append("productCategory",state.newProduct().productCategory);
        formData.append("newCategory",state.newProduct().newCategory);
        formData.append("savingOption", state.newProduct().savingOption.toString());
        formData.append("discount", state.newProduct().discount.toString());
        state.newProduct().files.forEach((file, index) => {
          formData.append('files', file);
        });
        const request$ = state.productId()==undefined
          ? adminService.addProduct(formData)
          : adminService.editProduct(formData, state.productId());

        request$.subscribe(product => {
          let updatedProduct=new NewProductModel();
          Object.assign(updatedProduct,{...state.newProduct,...product,productCategory:product.category.name});
          patchState(state,{
            newProduct:updatedProduct,
            reviews:product.reviews,
            images:product.images,
            imageUrls:imageService.getImageUrlsForProduct(product)
          })
          if (state.productId() == null) {
            form.resetForm();
            patchState(state,{message:"Product successfully added!"})
          }
          else patchState(state,{message:"Product successfully edited!"})
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    },
    deleteImage(imageId: number,index:number) {
      adminService.deleteImage(imageId,state.productId()).subscribe(
        _=>{
          let imagesUpdated=[...state.images()];
          imagesUpdated.splice(index,1);
          patchState(state,{images:imagesUpdated});
          let imageUrlsUpdated=[...state.imageUrls()];
          imageUrlsUpdated.splice(index,1);
          patchState(state,{imageUrls:imageUrlsUpdated});
        }
      )
    },
    deleteReview(reviewId: number, i: number) {
      adminService.deleteReview(reviewId).subscribe(_=>{
        let updatedReviews=[...state.reviews()];
        updatedReviews.splice(i,1);
        patchState(state,{reviews:updatedReviews})
      })
    },
    filesChanged($event:Event){
      const input=$event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const files = Array.from(input.files);
        let updatedProduct=new NewProductModel();
        Object.assign(updatedProduct,{...state.newProduct(),files:files});
        patchState(state,{newProduct:updatedProduct})
      }
    }
  })),
  withHooks({
    onInit(store){
        store.loadCategories();
        store.loadProduct(store.productId);//rxMethod poate primi un signal direct ca argument
    }
  })
);
