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

        template.innerHTML = `
        <link rel="stylesheet" href="${style_path}card-styles.css">

        <div class="setting_card" data-style_path="${style_path}">
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
        let is_error = false;
        let messages;

        // Send post request
        this.sendPostRequest(post_data).then((data) => {
            if (data.success) {
                console.debug(data.messages);
                messages = data.messages;
            } else {
                console.error(data.messages);
                messages = data.messages;
                is_error = true;
            }
        }).catch((err) => {
            console.error(err);
        });

        setTimeout(() => {
            content.classList.remove('processing');
            button.classList.remove('processing');
            button.textContent = button_text;
            this.showReturnField(messages, is_error);
        }, 1000);
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
        }, 2500);
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
                    inputs[this_input.name].value = inputs[this_input.name].checked;
                    break;
                }
            } catch (err) {
                console.error('Input not found or is missing attributes');
            }
        });

        return inputs;
    }

   async sendPostRequest(post_data) {
        const post_to_endpoint = this.getAttribute('post-to-endpoint') || false;

        const response = await fetch(post_to_endpoint, {
            headers: {
              'Content-Type': 'application/json',
              'X-WP-Nonce': this.getAttribute('wp_nonce') || ''
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