export class FormInput extends HTMLElement{constructor(){super();this.attachShadow({mode:'open'});var a=this.getTemplate();this.innerHTML='';this.shadowRoot.appendChild(a.content.cloneNode(!0));this.shadowRoot.updateInput=A=>{let b;switch(this.getAttribute('type')) {case 'textarea':b=this.shadowRoot.querySelector('textarea');b&&(b.value=A);break;case 'select':b=this.shadowRoot.querySelector('select');b&&(b.value=A);break;case 'toggle':b=this.shadowRoot.querySelector('input');b&&(b.checked=A);break;default:b=this.shadowRoot.querySelector('input');b&&(b.value=A)}}}getTemplate(){var a=document.createElement('template'),b=this.getInput();a.innerHTML=`
        <style>p{font-size:1rem}p input,p textarea,p select{background-color:#efeff0;border:solid 1px #d5d5d7;width:calc(100% - 1.9rem);font-family:inherit;margin-block:0.5em;border-radius:4px;font-size:inherit;display:block;padding:0.8em}p input:focus,p textarea:focus,p select:focus{outline:solid 1px var(--accent_button, #fd3599);border-color:var(--accent_button, #fd3599)}p input:is(select),p textarea:is(select),p select:is(select){background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='hsl(0, 0%, 30%)' d='M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z'/></svg>");background-position-x:calc(100% - 0.8em);background-repeat:no-repeat;background-position-y:50%;width:calc(100% - 3px);background-size:14px;appearance:none}p textarea{min-height:100px;max-height:300px;resize:vertical}p .helper{margin-block:5px 0;display:block;opacity:0.6}p .toggle{margin-block:0.5em;border-radius:4px;position:relative;font-size:0.9rem;overflow:hidden;cursor:pointer;display:block;height:34px;width:105px}p .toggle input{opacity:0;height:0;width:0}p .toggle input:checked+.slider:before{transform:translate(calc(100% + 44px), -50%);background-color:var(--accent_button_color, white)}p .toggle input:checked+.slider:after{color:var(--accent_button_color, white);content:"Enabled";right:auto;left:10px}p .toggle input:checked+.slider{background-color:var(--accent_button, #fd3599)}p .toggle .slider{background-color:var(--input_background, #efeff0);transition:background ease 200ms;position:absolute;bottom:0;right:0;left:0;top:0}p .toggle .slider::before{transition-property:transform, border-radius;transition-timing-function:ease;transition-duration:200ms;background-color:var(--body_color, #333);transform:translateY(-50%);border-radius:4px;position:absolute;opacity:0.9;height:22px;content:"";width:22px;left:8px;top:50%}p .toggle .slider::after{transform:translateY(-50%);color:var(--body_color, #333);position:absolute;content:"Disabled";right:10px;top:50%}p.invalid{color:var(--input_error, #fd3599)}p.invalid input,p.invalid textarea,p.invalid select{background-color:var(--input_error_background, #fff5fa);border-color:var(--input_error, #fd3599)}p.invalid input:focus,p.invalid textarea:focus,p.invalid select:focus{outline:solid 1px var(--input_error, #fd3599);border-color:var(--input_error, #fd3599)}p.invalid .helper{opacity:1}
</style>
        ${b}`;return a}getInput(){var a=this.gerDefaults();switch(a.type) {case 'toggle':return `
            <p>
                <label for="${a.name}">${a.title}:</label>
                <small class="helper">${a.helper_text}</small>
                <label class="toggle">
                    <input
                        type="checkbox"
                        `+(a.checked?`checked="checked"`:'')+`
                        name="${a.name}"
                        value="${a.value}"
                        aria-label="${a.title}"
                    >
                    <span class="slider"></span>
                </label>
            </p>`;case 'hidden':return`
            <input
                type="hidden"
                name="${a.name}"
                value="${a.value}"
            >`;case 'textarea':return `
            <p>
                <label for="${a.name}">${a.title}:</label>
                <small class="helper">${a.helper_text}</small>
                <textarea
                    type="${a.type}"
                    name="${a.name}"
                    id="${a.name}"
                    `+(a.required?`required="required" `:'')+`
                    `+(a.disabled?`disabled `:'')+`
                    placeholder="${a.placeholder}"
                    aria-label="${a.title}"
                    rows="${a.rows}"
                >${a.value}</textarea>
            </p>`;case 'select':a.helper_text=this.getAttribute('helper')?this.getAttribute('helper'):'';return `
            <p>
                <label for="${a.name}">${a.title}:</label>
                <small class="helper">${a.helper_text}</small>
                <select
                    name="${a.name}"
                    id="${a.name}"
                    `+(a.required?`required="required" `:'')+`>
                    ${a.content}
                </select>
            </p>`;default:return `
            <p>
                <label for="${a.name}">${a.title}:</label>
                <small class="helper">${a.helper_text}</small>
                <input
                    type="${a.type}"
                    name="${a.name}"
                    id="${a.name}"
                    value="${a.value}"
                    `+(a.required?`required="required" `:'')+`
                    `+(a.disabled?`disabled`:'')+`
                    placeholder="${a.placeholder}"
                    aria-label="${a.title}"
                >
            </p>`}return''}gerDefaults(){return{type:this.getAttribute('type')||'text',title:this.getAttribute('title')||'',name:this.getAttribute('name')||'',required:this.getAttribute('required')||!1,disabled:this.getAttribute('disabled')||!1,value:this.getAttribute('value')||'',placeholder:this.getAttribute('placeholder')||'',checked:this.getAttribute('checked')||!1,helper_text:this.getAttribute('helper')||this.textContent||'',rows:this.getAttribute('rows')||5,content:this.innerHTML}}}window.customElements.define('form-input',FormInput);
