import {getInputFields} from './settings-card.js';

/**
 * Add rows component
 */
export class AddRows extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        // Add template content
        const template = this.getTemplate();
        this.innerHTML = '';
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Load rows
        this.loadData();

        // Action buttons
        this.shadowRoot.addEventListener('click', (element) => {
            if (element.target.nodeName.toLowerCase() === 'button') {
                const action = element.target.getAttribute('data-action');
                if (action && typeof this[action] === 'function') {
                    this[action].call(this, element.target);
                }
            }
        });
    }

    getTemplate() {
        const template = document.createElement('template');
        const style_path = this.closest('.setting_card').getAttribute('data-style_path') || './';
        const current_template = this.querySelector('template');
        const template_content = current_template ? current_template.innerHTML : '';

        template.innerHTML = `
        <link rel="stylesheet" href="${style_path}card-styles.css">
        <link rel="stylesheet" href="${style_path}add-row.css">
        <div class="content">
            <div id="rows"></div>
            <div id="buttons">
                <button type="button" data-action="addRow">Add Row</button>
                <button type="button" data-action="saveData">Save</button>
            </div>
        </div>
        <textarea id="rows_data" disabled style="display: none;"></textarea>
        <template id="row_template">${template_content}</template>`;

        return template;
    }

    getCurrentTemplate() {
        const current_template = this.shadowRoot.querySelector('#row_template');
        if (current_template) {
            const template_content = document.createElement('div');
            const remove_button = document.createElement('button');
            remove_button.setAttribute('data-action', 'removeRow');
            remove_button.classList.add('warning');
            remove_button.textContent = 'Remove row';

            template_content.innerHTML = current_template.innerHTML;
            template_content.appendChild(remove_button);

            return template_content.innerHTML;
        }

        return ``;
    }

    addRow(this_button, data) {
        const rows_container = this.shadowRoot.querySelector('#rows');
        const new_row_element = document.createElement('div');
        const style_path_element = this.closest('[data-style_path]');

        new_row_element.setAttribute('class', 'row');

        if (style_path_element) {
            new_row_element.setAttribute('data-style_path', style_path_element.getAttribute('data-style_path'));
        }

        new_row_element.innerHTML = this.getCurrentTemplate();

        if (typeof data == 'object') {
            Object.keys(data).forEach((key) => {
                if (typeof data[key] === 'object') {
                    const input = new_row_element.querySelector(`form-input[name="${key}"]`);
                    input.shadowRoot.updateInput(data[key] && data[key].value ? data[key].value : '');
                }
            });
        }

        rows_container.appendChild(new_row_element);
    }

    removeRow(this_button) {
        this_button.parentNode.remove();
    }

    saveData(this_button) {
        const rows_data_textfield = this.shadowRoot.querySelector('textarea#rows_data');
        const save_action = this.getAttribute('save-action');
        const rows = [];
        let is_valid = false;

        if (rows_data_textfield) {
            is_valid = true;
            this.shadowRoot.querySelectorAll('#rows > .row').forEach((this_row) => {
                const input_values = getInputFields(this_row);
                rows.push(input_values);
                is_valid = !input_values.valid || !is_valid ? false : is_valid;
            });

            if (is_valid && save_action && typeof window[save_action] === 'function') {
                window[save_action].call(this, rows, this_button);
            }
        }
    }

    loadData() {
        const load_data = this.getAttribute('load-data');
        if (load_data && load_data.length > 0) {
            const data = JSON.parse(atob(load_data));
            if (Array.isArray(data)) {
                data.forEach((row) => {
                    this.addRow(null, row);
                });
            }
        }
    }
}

window.customElements.define('add-row', AddRows);