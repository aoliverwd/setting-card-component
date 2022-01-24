/**
 * Settings card component
 */
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
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/aoliverwd/setting-card-component@main/dist/card-styles.css">

        <div class="setting_card">
            <h1 class="card_title">${title}</h1>
            <div class="content"></div>
        </div>`;
        return template;
    }

    updateSettings(button) {
        const button_text = button.textContent;
        const content = button.closest('.content');

        // Form processing status
        button.textContent = 'Processing';
        button.classList.add('processing');
        content.classList.add('processing');

        // Get post data and convert into base64
        const post_data = btoa(JSON.stringify(this.getInputFields()));

        // Send post request
        this.sendPostRequest(post_data).then((data) => {
            console.log(data);
        }).catch((err) => {
            console.error(err);
        });

        content.classList.remove('processing');
        button.classList.remove('processing');
        button.textContent = button_text;
    }

    getInputFields() {
        const inputs = {};

        this.shadowRoot.querySelectorAll('form-input').forEach((input) => {
            const this_input = input.shadowRoot.querySelector('input');
            try {
                inputs[this_input.name] = {
                    value: this_input.value,
                    name: this_input.name,
                    type: this_input.type,
                    required: this_input.required || false
                };

                switch (this_input.type) {
                case 'checkbox':
                case 'radio':
                    inputs[this_input.name].checked = (this_input.checked ? true : false);
                    break;
                }
            } catch (err) {
                console.error('Input not found or is missing attributes');
            }
        });

        return inputs;
    }

   async  sendPostRequest(post_data) {
        const post_to_endpoint = this.getAttribute('post-to-endpoint') || false;

        const response = await fetch(post_to_endpoint, {
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow',
            cache: 'no-cache',
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                base: post_data
            })
        });

        return response.json();
    }
}

window.customElements.define('setting-card', SettingCard);



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
    }

    getTemplate() {
        const template = document.createElement('template');
        const this_input = this.getInput();

        template.innerHTML = `
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/aoliverwd/setting-card-component@main/dist/input-styles.css">
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