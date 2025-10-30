import {Component, effect, input, model, OnChanges, OnInit, signal, SimpleChanges} from '@angular/core';
import {ReviewModel} from '../../shared/domain/review.model';
import {ReviewRequestModel} from '../domain/review-request.model';
import {FormsModule, NgForm} from '@angular/forms';
import {StarRatingComponent} from '../star-rating/star-rating.component';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule, MatIconButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ProductService} from '../services/product.service';

@Component({
  selector: 'app-reviews',
  imports: [
    FormsModule,
    StarRatingComponent,
    MatInputModule,
    MatButtonModule,
    MatIconButton,
    MatIconModule
  ],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent{
  productId=input<number>(0);
  reviews=model<ReviewModel[]>([]);
  newReview=signal<ReviewRequestModel>(new ReviewRequestModel());

  constructor(private productService:ProductService){}

  ratingChanged($event:number){
    this.newReview.set({...this.newReview(),rating:$event});
  }

  textChanged($event:string){
    this.newReview.set({...this.newReview(),text:$event});
  }

  onSubmit(form:NgForm){
    if(form.valid){
      this.newReview.set({...this.newReview(),productId:this.productId()});
      this.productService.saveReview(this.newReview()).subscribe(_=>{
        this.productService.getReviews(this.productId()).subscribe(reviews=>this.reviews.set(reviews));
      })
    }
  }

  getStars(rating: number) {
    return new Array(rating);
  }

  getDate(date:string){
    return new Date(date).toLocaleDateString();
  }
}
