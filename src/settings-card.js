// Settings card component
export class SettingCard extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        const template = this.getTemplate();
        const elementHTML = this.innerHTML;

        this.innerHTML = '';
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector('.setting_card .content').innerHTML = elementHTML;

        // Save settings button
        try{
            this.shadowRoot.querySelector('button.update_settings').onclick = (element) => {
                this.updateSettings(element.target);
            };
        } catch (err) {
            console.error('Save settings button does not exist');
        }
    }

    getTemplate() {
        const title = this.getAttribute('card-title');
        const template = document.createElement('template');
        template.innerHTML = `
        <link rel="stylesheet" href="./dist/card-styles.css">

        <div class="setting_card">
            <h1 class="card_title">${title}</h1>
            <div class="content"></div>
        </div>`;
        return template;
    }

    updateSettings(button) {
        //const button_text = button.textContent;
        button.textContent = 'Processing';
        button.classList.add('processing');
        button.closest('.content').classList.add('processing');

        this.getInputFields();
    }

    getInputFields() {
        this.shadowRoot.querySelectorAll('form-input').forEach((input) => {
            console.log(input.shadowRoot);
        });
    }
}

window.customElements.define('setting-card', SettingCard);



// Form input component
export class FormInput extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        const template = this.getTemplate();

        this.innerHTML = '';
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    getTemplate() {
        const template = document.createElement('template');
        const this_input = this.getInput();

        template.innerHTML = `
        <link rel="stylesheet" href="./dist/input-styles.css">
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
                <label class="toggle">
                    <input
                        type="checkbox"
                        ` + (input_defaults.checked ? `checked="checked"` : '') + `
                        name="${input_defaults.name}"
                        value="${input_defaults.value}"
                    >
                    <span class="slider"></span>
                </label>
            </p>`;
        default:
            return `
            <p>
                <label for="${input_defaults.name}">${input_defaults.title}:</label>
                <input
                    type="${input_defaults.type}"
                    name="${input_defaults.name}"
                    id="${input_defaults.name}"
                    value="${input_defaults.value}"
                    ` + (input_defaults.required ? `required="required"` : '') + `
                    placeholder="${input_defaults.placeholder}"
                >
                <small>${input_defaults.helper_text}</small>
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
            value: this.getAttribute('value') || '',
            placeholder: this.getAttribute('placeholder') || '',
            checked: this.getAttribute('checked') || false,
            helper_text: this.textContent || ''
        };
    }
}

window.customElements.define('form-input', FormInput);