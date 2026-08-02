export default class Validator {
    rule: string;
    error: boolean = false;
    success: boolean = false;
    hint: string = "";
    disabled: boolean = false;

    constructor(rule: string, hint: string) {
        this.rule = rule;
        this.error = false;
        this.success = false;
        this.disabled = false;
        this.hint = hint;
    }
}