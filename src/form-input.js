/**
 * Form input component
 */
export class FormInput extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        const template = this.getTemplate();
        this.innerHTML = '';
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.shadowRoot.updateInput = (value) => {
            let input;

            switch (this.getAttribute('type')) {
                case 'textarea':
                    input = this.shadowRoot.querySelector('textarea');
                    if (input) { input.value = value; }
                    break;
                default:
                    input = this.shadowRoot.querySelector('input');
                    if (input) { input.value = value; }
            }
        };
    }

    getTemplate() {
        const template = document.createElement('template');
        const this_input = this.getInput();

        const style_path_element = this.closest('[data-style_path]');
        const style_path = style_path_element ? style_path_element.getAttribute('data-style_path') : './';

        template.innerHTML = `
        <link rel="stylesheet" href="${style_path}input-styles.css">
        ${this_input}`;

        return template;
    }

    getInput() {
        const input_defaults = this.gerDefaults();

        switch (input_defaults.type) {
        case 'toggle':
            return `
            <p>
                <label for="${input_defaults.name}">${input_defaults.title}:</label>
                <small class="helper">${input_defaults.helper_text}</small>
                <label class="toggle">
                    <input
                        type="checkbox"
                        ` + (input_defaults.checked ? `checked="checked"` : '') + `
                        name="${input_defaults.name}"
                        value="${input_defaults.value}"
                        aria-label="${input_defaults.title}"
                    >
                    <span class="slider"></span>
                </label>
            </p>`;
        case 'hidden':
            return `
            <input
                type="hidden"
                name="${input_defaults.name}"
                value="${input_defaults.value}"
            >`;
        case 'textarea':
            return `
            <p>
                <label for="${input_defaults.name}">${input_defaults.title}:</label>
                <small class="helper">${input_defaults.helper_text}</small>
                <textarea
                    type="${input_defaults.type}"
                    name="${input_defaults.name}"
                    id="${input_defaults.name}"
                    ` + (input_defaults.required ? `required="required" ` : '') + `
                    ` + (input_defaults.disabled ? `disabled ` : '') + `
                    placeholder="${input_defaults.placeholder}"
                    aria-label="${input_defaults.title}"
                    rows="${input_defaults.rows}"
                >${input_defaults.value}</textarea>
            </p>`;
        default:
            return `
            <p>
                <label for="${input_defaults.name}">${input_defaults.title}:</label>
                <small class="helper">${input_defaults.helper_text}</small>
                <input
                    type="${input_defaults.type}"
                    name="${input_defaults.name}"
                    id="${input_defaults.name}"
                    value="${input_defaults.value}"
                    ` + (input_defaults.required ? `required="required" ` : '') + `
                    ` + (input_defaults.disabled ? `disabled` : '') + `
                    placeholder="${input_defaults.placeholder}"
                    aria-label="${input_defaults.title}"
                >
            </p>`;
        }

        return '';
    }

    gerDefaults() {
        return {
            type: this.getAttribute('type') || 'text',
            title: this.getAttribute('title') || '',
            name: this.getAttribute('name') || '',
            required: this.getAttribute('required') || false,
            disabled: this.getAttribute('disabled') || false,
            value: this.getAttribute('value') || '',
            placeholder: this.getAttribute('placeholder') || '',
            checked: this.getAttribute('checked') || false,
            helper_text: this.textContent || this.getAttribute('helper') || '',
            rows: this.getAttribute('rows') || 5,
        };
    }
}

window.customElements.define('form-input', FormInput);