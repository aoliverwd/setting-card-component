// Settings card component
export class SettingCard extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        const template = this.getTemplate();
        const elementHTML = this.innerHTML;

        this.innerHTML = "";
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector(".setting_card .content").innerHTML = elementHTML;
    }

    getTemplate() {
        const title = this.getAttribute("title");
        const template = document.createElement('template');
        template.innerHTML = `
        <div class="setting_card">
            <div class="content"></div>
        </div>`;
        return template;
    }
}

window.customElements.define('setting-card', SettingCard);



// Form input component
export class FormInput extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        const template = this.getTemplate();
        const elementHTML = this.innerHTML;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        //this.shadowRoot.querySelector(".card").setAttribute("data-type", this.getAttribute("type"));
        //this.shadowRoot.querySelector(".card .content").innerHTML = this.innerHTML;
    }

    getTemplate() {
        const template = document.createElement('template');
        template.innerHTML = ``;

        return template;
    }
}

window.customElements.define('form-input', FormInput);