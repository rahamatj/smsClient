import {CommonModule} from '@angular/common';
import {Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '@/environments/environment';

@Component({
    selector: 'app-input-field',
    imports: [CommonModule, FormsModule],
    template: `
        <div class="relative">
            <input
                    [type]="type"
                    [id]="id"
                    [value]="value"
                    [placeholder]="placeholder"
                    [min]="min"
                    [max]="max"
                    [step]="step"
                    [ngClass]="inputClasses(state)"
                    (input)="onInput($event)"
            />

            @if (hints.length) {
                <ul class="mt-1.5 text-xs"
                   [ngClass]="{
                              'text-error-500': error,
                              'text-success-500': success,
                              'text-gray-500': !error && !success
                          }">
                    @for (message of hints; track message) {
                        <li>{{ message }}</li>
                    }
                </ul>
            }
        </div>
    `,
})
export class InputFieldComponent implements OnInit, OnChanges {
    @Input() type: string = 'text';
    @Input() id?: string = '';
    @Input() name?: string = '';
    @Input() placeholder?: string = '';
    @Input() value: string | number = '';
    @Input() min?: string;
    @Input() max?: string;
    @Input() step?: number;
    @Input() className: string = '';
    @Input() validators: string = '';
    @Output() valueChange = new EventEmitter<string | number>();
    @Output() errorChange = new EventEmitter<boolean>();

    api: string = environment.apiUrl;
    http: HttpClient = inject(HttpClient);

    error = true;
    success = false;
    disabled = false;
    hints: string[] = [];
    state: 'default' | 'error' | 'success' | 'disabled' = 'default';
    private lastUniqueCheckValue = '';

    inputClasses(state: any): string {
        let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${this.className}`;

        if (state === 'disabled') {
            inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 opacity-40`;
        } else if (state === 'error') {
            inputClasses += ` border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
        } else if (state === 'success') {
            inputClasses += ` border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
        } else if (state === 'default') {
            inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800`;
        }
        return inputClasses;
    }

    ngOnInit(): void {
        this.validateValue(this.value);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['value'] || changes['validators']) {
            this.validateValue(this.value);
        }
    }

    onInput(event: Event) {
        const input = event.target as HTMLInputElement;
        const value = this.type === 'number' ? +input.value : input.value;
        this.value = value;
        this.valueChange.emit(value);
        this.validateValue(value);
    }

    private validateValue(value: string | number): void {
        this.hints = [];
        this.error = false;
        this.success = false;
        this.state = this.disabled ? 'disabled' : 'default';

        const rules = this.validators.split('|').map(rule => rule.trim());
        const valueText = typeof value === 'string' ? value : String(value ?? '');
        const hasUniqueRule = rules.includes('unique');
        let hasError = false;

        for (const rule of rules) {
            if (!rule) {
                continue;
            }

            if (rule === 'required' && valueText.trim().length === 0) {
                hasError = true;

                this.hints = [...this.hints, 'This field is required.'];
            } else if (rule.startsWith('minLength')) {
                const minLength = parseInt(rule.split(':')[1], 10);
                if (!Number.isNaN(minLength) && valueText.length < minLength) {
                    hasError = true;

                    this.hints = [...this.hints, `Minimum length is ${minLength} characters.`];
                }
            } else if (rule.startsWith('maxLength')) {
                const maxLength = parseInt(rule.split(':')[1], 10);
                if (!Number.isNaN(maxLength) && valueText.length > maxLength) {
                    hasError = true;

                    this.hints = [...this.hints, `Maximum length is ${maxLength} characters.`];
                }
            } else if (rule === 'no-space' && /\s/.test(valueText)) {
                hasError = true;
                this.hints = [...this.hints, 'Spaces are not allowed.'];
            } else if (rule === 'confirm-password' && valueText.length > 0) {
                const passwordInput = document.querySelector<HTMLInputElement>('input[type="password"]');
                if (passwordInput && passwordInput.value !== valueText) {
                    hasError = true;
                    this.hints = [...this.hints, 'Passwords do not match.'];
                }
            }

        }

        this.error = hasError;
        this.success = !hasError && valueText.length > 0 && !hasUniqueRule;
        this.state = this.disabled ? 'disabled' : (this.error ? 'error' : (this.success ? 'success' : 'default'));
        this.errorChange.emit(this.error);

        if (!hasError && hasUniqueRule && valueText.trim()) {
            this.checkUnique(valueText.trim());
        }
    }

    private checkUnique(username: string): void {
        this.lastUniqueCheckValue = username;

        this.http.get(`${this.api}/api/admins/does-username-exist/${username}`)
            .subscribe({
                next: (exists: any) => {
                    if (this.lastUniqueCheckValue !== username) {
                        return;
                    }

                    this.hints = this.hints.filter(hint => hint !== 'Username already exists.');

                    if (exists) {
                        this.error = true;
                        this.success = false;
                        this.state = this.disabled ? 'disabled' : 'error';
                        this.hints = [...this.hints, 'Username already exists.'];
                        this.errorChange.emit(true);
                        return;
                    }

                    this.error = this.hints.length > 0;
                    this.success = !this.error && username.length > 0;
                    this.state = this.disabled ? 'disabled' : (this.error ? 'error' : (this.success ? 'success' : 'default'));
                    this.errorChange.emit(this.error);
                },
                error: (err) => {
                    console.error(err);
                }
            });
    }
}
