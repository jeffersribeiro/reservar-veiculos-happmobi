import { Component } from '@angular/core';
import { ToggleComponent } from '../../shared/components/toggle/toggle.component';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';

type FilterKey = 'bodyTypes' | 'engineSizes' | 'seats';

@Component({
  selector: 'app-filter-screen',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToggleComponent,
    CheckboxComponent,
    ButtonComponent,
  ],
  templateUrl: './filter-screen.component.html',
  styleUrl: './filter-screen.component.scss',
})
export class FilterScreenComponent {
  filters = {
    bodyTypes: {
      options: [
        { id: 'HATCH_COMPACTO', label: 'Hatch compacto' },
        { id: 'HATCH_MEDIO', label: 'Hatch médio' },
        { id: 'SUV_COMPACTO', label: 'SUV compacto' },
        { id: 'SUV_MEDIO', label: 'SUV médio' },
        { id: 'SUV_GRANDE', label: 'SUV grande' },
        { id: 'CROSSOVER', label: 'Crossover' },
        { id: 'COUPE', label: 'Coupé' },
        { id: 'PICAPE_LEVE', label: 'Picape leve' },
        {
          id: 'PICAPE_LEVE_MEDIA',
          label: 'Picape leve-média',
        },
        { id: 'PICAPE_MEDIA', label: 'Picape média' },
        { id: 'SEDAN_COMPACTO', label: 'Sedan Compacto' },
        { id: 'SEDAN_MEDIO', label: 'Sedan Médio' },
        { id: 'SEDAN_GRANDE', label: 'Sedan Grande' },
        {
          id: 'MINIVAN_MONOVOLUME',
          label: 'Minivan/monovolume',
        },
        { id: 'UTILITARIO_LEVE', label: 'Utilitário leve' },
        { id: 'UTILITARIO', label: 'Utilitário' },
      ],
    },
    engineSizes: {
      options: [
        {
          id: '1_0',
          label: 'Motor 1.0',
          value: 1.0,
          unit: 'L',
        },
        {
          id: '1_4',
          label: 'Motor 1.4',
          value: 1.4,
          unit: 'L',
        },
        {
          id: '1_6',
          label: 'Motor 1.6',
          value: 1.6,
          unit: 'L',
        },
        {
          id: '1_8',
          label: 'Motor 1.8',
          value: 1.8,
          unit: 'L',
        },
        {
          id: '2_0',
          label: 'Motor 2.0',
          value: 2.0,
          unit: 'L',
        },
      ],
    },
    seats: {
      options: [
        { id: '02', label: '02', value: 2 },
        { id: '03', label: '03', value: 3 },
        { id: '04', label: '04', value: 4 },
        { id: '05', label: '05', value: 5 },
        { id: '06', label: '06', value: 6 },
        { id: '07', label: '07', value: 7 },
      ],
    },
  };

  form: FormGroup<{
    bodyTypes: FormArray<FormControl<boolean>>;
    engineSizes: FormArray<FormControl<boolean>>;
    seats: FormArray<FormControl<boolean>>;
  }>;

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.nonNullable.group({
      bodyTypes: this.buildBooleanArray('bodyTypes'),
      engineSizes: this.buildBooleanArray('engineSizes'),
      seats: this.buildBooleanArray('seats'),
    });
  }

  private buildBooleanArray(key: FilterKey): FormArray<FormControl<boolean>> {
    const opts = this.filters[key].options;
    return this.fb.nonNullable.array(
      opts.map(() => this.fb.nonNullable.control(false))
    );
  }

  onTogglePill(filterKey: FilterKey, index: number): void {
    const arr = this.form.controls[filterKey];
    const current = arr.at(index).value;
    arr.at(index).setValue(!current);
  }

  buildApplyPayload(): Record<FilterKey, string[]> {
    const out = {} as Record<FilterKey, string[]>;

    (Object.keys(this.filters) as FilterKey[]).forEach((key) => {
      const bools = this.form.controls[key].value;
      const ids = this.filters[key].options
        .filter((_, idx) => !!bools[idx])
        .map((opt) => opt.id);

      out[key] = ids;
    });

    return out;
  }

  onSubmit() {
    const filters = this.buildApplyPayload();

    const queryParams: Record<string, string[]> = {};

    if (filters.bodyTypes) queryParams['bodyTypes'] = filters.bodyTypes;
    if (filters.seats) queryParams['seats'] = filters.seats;
    if (filters.engineSizes) queryParams['engineSizes'] = filters.engineSizes;

    this.router.navigate(['/vehicles'], { queryParams });
  }

  onCancel() {
    this.router.navigate(['/home']);
  }

  onClear() {
    this.form.reset();
  }
}
