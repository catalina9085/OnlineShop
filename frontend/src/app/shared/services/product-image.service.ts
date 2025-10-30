import { Injectable } from '@angular/core';
import {ProductModel} from '../domain/product.model';
import {OrderProductModel} from '../domain/orderProduct.model';

@Injectable({
  providedIn: 'root'
})
export class ProductImageService {

  constructor() { }

  getImageUrlFromBase64(product:ProductModel,mimeType: string = 'image/jpeg') {
    if (product.images && product.images.length > 0 && product.images[0].savingOption == 1) {
      const base64 = product.images[0].imageBase64;
      const byteString = atob(base64);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const intArray = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([intArray], {type: mimeType});
      return URL.createObjectURL(blob); // asta returnează un link de forma blob:http://...
    }
    else return '';
  }

  getImageUrlFromBase641(imageBase64:string,mimeType: string = 'image/jpeg'){
    const byteString = atob(imageBase64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([intArray], {type: mimeType});
    return URL.createObjectURL(blob);
  }

  getImageUrlsForProducts(products:OrderProductModel[],mimeType: string = 'image/jpeg')
  {
    const urls = products.map(product => {
      if (product.savingOption == 1) {
        const base64 = product.imageBase64;
        const byteString = atob(base64);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          intArray[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([intArray], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
      }
      return ''; // fallback url gol
    });
    return urls;
  }

  getImageUrlsForProduct(product:ProductModel,mimeType: string = 'image/jpeg')
  {
    const urls = product.images.map(image => {
      if (image.savingOption == 1) {
        const base64 = image.imageBase64;
        const byteString = atob(base64);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          intArray[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([intArray], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
      }
      return ''; // fallback url gol
    });
    return urls;
  }


}
