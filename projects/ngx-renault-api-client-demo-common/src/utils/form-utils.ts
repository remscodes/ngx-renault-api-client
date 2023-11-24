import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

type Controls = Record<string, AbstractControl>

export function basicForm(keys: string[]): FormGroup {
  return new FormGroup(keys.reduce((controls: Controls, key: string) => {
    controls[key] = basicControl();
    return controls;
  }, {}));
}

export function basicControl(): FormControl {
  return new FormControl('', Validators.required);
}
