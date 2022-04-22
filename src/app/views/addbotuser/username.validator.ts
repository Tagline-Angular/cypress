import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
  
export class UsernameValidator {
    static noWhiteSpace(control: AbstractControl): ValidationErrors | null {
        if ((control.value as string)?.indexOf(' ') >= 0) {
          return { noWhiteSpace: true }
        }
        return null;
      }
}


