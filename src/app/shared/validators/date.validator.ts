import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function dateValidator(): ValidatorFn {

    return (ctrl: AbstractControl): null | ValidationErrors => {

        const value = ctrl.value;

        return (value) ? null: { date: true };

    };

}
