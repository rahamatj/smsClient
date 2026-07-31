
import { Component } from '@angular/core';
import { ComponentCardComponent } from '@/shared/components/common/component-card/component-card.component';
import { InputFieldComponent } from '@/shared/components/input/input-field.component';
import { LabelComponent } from '@/shared/components/label/label.component';

@Component({
  selector: 'app-input-states',
  imports: [
    ComponentCardComponent,
    InputFieldComponent,
    LabelComponent
],
  templateUrl: './input-states.component.html',
  styles: ``
})
export class InputStatesComponent {

  email = '';
  emailTwo = 'hello.pimjo@gmail.com';
  error = false;

  validateEmail(value: string): boolean {
    const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    this.error = !isValidEmail;
    return isValidEmail;
  }

  handleEmailChange(value: string | number) {
    this.email = value.toString();
    this.validateEmail(this.email);
  }
  
  handleEmailTwoChange(value: string | number) {
    this.emailTwo = value.toString();
    this.validateEmail(this.emailTwo);
  }
}
