import {Directive, Input} from "@angular/core";

@Directive({
    selector: 'input[validators]'
})
export class ValidatorsDirective {
    @Input() validators: string[] = [];
}