import { getElementAttributes, removeElementAttributes } from "@features/utils";
export default class jsTextBox extends HTMLElement {
	constructor() {
		super();
	}

	static get observedAttributes() {
		return ["cssClass", "data-id", "data-icon", "data-viewbox", "data-type", "data-placeholder", "data-autocomplete", "data-required"];
	}

	connectedCallback() {
		this.render();
	}

	render() {
		const component = this;
		//const { getElementAttributes, removeElementAttributes } = await import("@features/utils");
		const { id, record, name, cssClass, icon, viewbox, type, placeholder, autocomplete, required, disabled, minlength, maxlength, value } = getElementAttributes(this);
		removeElementAttributes(component);
		component.setAttribute("class", "js-textbox");
		component.setAttribute("data-name", name ?? id ?? "");
		if (icon && viewbox) component.classList.add("w-icon");
		if (cssClass) component.classList.add(cssClass);

		const textboxType: any = {
			common() {
				return `
				${
					!icon || !viewbox
						? ""
						: `<div class="svg-icon">
							<svg viewBox="${viewbox}"> <use xlink:href="${icon}"></use></svg>
						</div>`
				}
				<input 
					class="js-textbox__input"
					type="${type ?? "text"}"
					${!id ? "" : `id="${id}"`}
					${!record ? "" : `data-record="${record}"`}
					${!minlength ? "" : `maxlength=${minlength}`}
					${!maxlength ? "" : `maxlength=${maxlength}`}
					${!placeholder ? "" : `placeholder="${placeholder}"`}
					${!autocomplete ? "" : `autocomplete="${autocomplete}"`}
					${!required ? "" : `required`}
					${!disabled ? "" : `disabled`}
					${!value ? "" : `value="${value}"`}
				>
				${!placeholder ? "" : `<div class="js-textbox__label">${placeholder}</div>`}`;
			},
		};

		component.innerHTML = textboxType["common"]();

		component.addEventListener("click", () => {
			const textBox = <HTMLElement>component.querySelector(".js-textbox__input");
			textBox.focus();
		});
	}
}
