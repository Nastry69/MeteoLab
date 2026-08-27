import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WEATHER_MESSAGES } from '../../shared/weather-messages';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  /** Émis lorsque le formulaire est valide et soumis. */
  readonly citySubmit = output<string>();

  readonly invalidCityMessage = WEATHER_MESSAGES.invalidCity;

  readonly searchForm = new FormGroup({
    city: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  get cityControl(): FormControl<string> {
    return this.searchForm.controls.city;
  }

  get showInvalidMessage(): boolean {
    const control = this.cityControl;
    return control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    this.searchForm.markAllAsTouched();

    if (this.searchForm.invalid) {
      return;
    }

    const city = this.cityControl.value.trim();

    if (!city) {
      this.cityControl.setErrors({ required: true });
      return;
    }

    this.citySubmit.emit(city);
  }
}
