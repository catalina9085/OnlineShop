import {Component, forwardRef, signal} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-star-rating',
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StarRatingComponent),
    multi: true
  }]
})
export class StarRatingComponent implements ControlValueAccessor {
  stars = Array(5).fill(0);
  rating = signal(0);
  private onChange = (value: number) => {};
  private onTouched = () => {};

  writeValue(value: number): void { this.rating.set(value); }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState?(isDisabled: boolean): void { }

    onClick(value: number): void {
      this.rating.set(value);
      this.onChange(value);
      this.onTouched();
    }
  }

