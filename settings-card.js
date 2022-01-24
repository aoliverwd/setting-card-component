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
            this.shadowRoot.querySelector('button.update_settings').onclick = () => {
                this.updateSettings();
            };
        } catch (err) {
            console.error('Save settings button does not exist');
        }
    }

    getTemplate() {
        const title = this.getAttribute('title');
        const template = document.createElement('template');
        template.innerHTML = `
        <link rel="stylesheet" href="./dist/card-styles.css">

        <div class="setting_card">
            <h3>${title}</h3>
            <div class="content"></div>
        </div>`;
        return template;
    }

    updateSettings() {
        console.log('saving');
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
        return `
        <p>
            <label for="${input_defaults.name}">${input_defaults.title}</label>
            <input
                type="${input_defaults.type}"
                name="${input_defaults.name}"
                id="${input_defaults.name}"
                value="${input_defaults.value}"
                required="${input_defaults.required}"
                placeholder="${input_defaults.placeholder}"
            >
            <small>${input_defaults.helper_text}</small>
        </p>`;
    }

    gerDefaults() {
        return {
            type: this.getAttribute('type') || '',
            title: this.getAttribute('title') || '',
            name: this.getAttribute('name') || '',
            required: this.getAttribute('required') || '',
            value: this.getAttribute('value') || '',
            placeholder: this.getAttribute('placeholder') || '',
            helper_text: this.textContent || ''
        };
    }
}

window.customElements.define('form-input', FormInput);