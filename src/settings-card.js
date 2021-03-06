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

            // Add return field
            const return_text = document.createElement('p');
            return_text.id = 'return_text';
            this.shadowRoot.querySelector('.setting_card').appendChild(return_text);

        } catch (err) {
            console.error('Save settings button does not exist');
        }

        // Button actions
        this.shadowRoot.querySelectorAll('button[data-action]').forEach((this_button) => {
            const class_instance = this;
            this_button.addEventListener('click', () => {
                const action = this_button.getAttribute('data-action');
                if (action.length > 0 && typeof window[action] === 'function') {
                    window[action].call(this, this_button, class_instance);
                }
            });
        });

        setTimeout(() => {
            this.shadowRoot.querySelector('.setting_card').classList.add('loaded');
        }, 500);
    }

    getTemplate() {
        const title = this.getAttribute('card-title');
        const template = document.createElement('template');
        const style_path = this.getAttribute('style_path') || './';
        const external_style = this.getAttribute('external_style') || './';
        let external_style_file = '';

        if (external_style.length > 0) {
            external_style_file = `<link rel="stylesheet" href="${external_style}">`;
        }

        template.innerHTML = `
        <link rel="stylesheet" href="${style_path}card-styles.css">
        ${external_style_file}

        <div class="setting_card" data-style_path="${style_path}">
            <h1 class="card_title">${title}</h1>
            <div class="content"></div>
        </div>`;
        return template;
    }

    formProcessing(button) {
        const content = button.closest('.content');
        const button_text = button.textContent;
        button.textContent = 'Processing';
        button.classList.add('processing');
        content.classList.add('processing');
        return button_text;
    }

    formFinishedProcessing(button, button_text) {
        const content = button.closest('.content');
        content.classList.remove('processing');
        button.classList.remove('processing');
        button.textContent = button_text;
    }

    updateSettings(button) {
        // Form processing status
        const button_text = this.formProcessing(button);
        let is_error = true;

        // Get post data
        const inputs = this.getInputFields();

        // Check inputs are valid
        if (!inputs.valid) {
            this.formFinishedProcessing(button, button_text);
            this.showReturnField(['Some fields did not validate'], is_error);
            return;
        }

        // convert inputs into base64
        const post_data = btoa(JSON.stringify(inputs));
        let messages = ['No message to display'];

        // Send post request
        this.sendPostRequest(post_data).then((data) => {
            if (data.success) {
                console.debug(data.messages);
                messages = data.messages;
                is_error = false;
            } else {
                console.error(data.messages);
                messages = data.messages;
                is_error = true;
            }

            this.formFinishedProcessing(button, button_text);
            this.showReturnField(messages, is_error);

        }).catch((err) => {
            console.error(err);
        });
    }

    showReturnField (messages, is_error) {
        const return_field = this.shadowRoot.querySelector('#return_text');
        return_field.innerHTML = messages.join(', ');
        return_field.setAttribute('class', '');

        if (is_error) {
            return_field.classList.add('error');
        }

        return_field.classList.add('show');

        setTimeout(() => {
            return_field.classList.remove('show');
        }, 3000);
    }

    validateInput (input) {
        return input.value.length > 0 ? true : false;
    }

    getInputFields() {
        const inputs = {
            valid: true
        };

        this.shadowRoot.querySelectorAll('form-input').forEach((input) => {
            const this_input = input.shadowRoot.querySelector('input, textarea');
            if (this_input) {
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
                        inputs[this_input.name].value = inputs[this_input.name].checked;
                        break;
                    }

                    if (this_input.type !== 'hidden') {
                        const is_valid = this_input.required ? this.validateInput(this_input) : true;
                        inputs[this_input.name].valid = is_valid;
                        this_input.parentNode.classList.remove('invalid');
                        if (!is_valid) {
                            this_input.parentNode.classList.add('invalid');
                            inputs.valid = false;
                        }
                    }
                } catch (err) {
                    console.error('Input not found or is missing attributes', this_input);
                }
            }
        });

        console.debug(inputs);
        return inputs;
    }

   async sendPostRequest(post_data, endpoint, method) {
        const post_to_endpoint = typeof endpoint === 'string' && endpoint.length > 0 ? endpoint : this.getAttribute('post-to-endpoint') || false;

        let http_method = 'POST';

        if (typeof method === 'string' && method.length > 0) {
            switch(method.toLowerCase()) {
            case 'get':
            case 'put':
            case 'delete':
                http_method = method.toUpperCase();
                break;
            }
        }

        const fetch_paramaters = {
            headers: {
              'Content-Type': 'application/json',
              'X-WP-Nonce': this.getAttribute('wp_nonce') || ''
            },
            redirect: 'follow',
            cache: 'no-cache',
            method: http_method,
            mode: 'cors',
            body: JSON.stringify({base: post_data})
        };

        if (http_method === 'GET') {
            delete fetch_paramaters.body;
        }

        const response = await fetch(post_to_endpoint, fetch_paramaters);
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
        const style_path = this.closest('.setting_card').getAttribute('data-style_path') || './';

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
                    ` + (input_defaults.required ? `required="required"` : '') + `
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
                    ` + (input_defaults.required ? `required="required"` : '') + `
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
            value: this.getAttribute('value') || '',
            placeholder: this.getAttribute('placeholder') || '',
            checked: this.getAttribute('checked') || false,
            helper_text: this.textContent || '',
            rows: this.getAttribute('rows') || 5,
        };
    }
}

window.customElements.define('form-input', FormInput);