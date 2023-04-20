import { htmlStringToFragment, getElementAttributes, removeElementAttributes, setElementAttributes } from "@features/utils";
export default class jsModal extends HTMLElement {
	constructor() {
		super();
	}

	static get observedAttributes() {
		return ["type"];
	}

	connectedCallback() {
		this.render();
	}

	render() {
		const component = this;
		const { id, modal, title, cssClass, record } = getElementAttributes(component);
		removeElementAttributes(component);
		const content = htmlStringToFragment(component.innerHTML);
		setElementAttributes(component, { class: `js-modal ${cssClass || ""}`, id: id || "" });
		if (modal) component.setAttribute("data-modal", modal);
		if (record) component.setAttribute("data-record", record);
		component.innerHTML = `<div class="js-modal__content">
                            <div class="js-modal__content-header">
                                <h5 class="js-modal__content-header-title">${!title ? "" : title}</h5>
                                <button class="js-modal__content-header-close-btn" data-type="danger" data-toggle="modal" data-target="${!id ? "parent(3)" : `#${id}`}">
									<div class="svg-icon"><svg viewBox="-1 -1.5 14 14"><use xlink:href="#svg-times"></use></svg></div>
								</button>
                            </div>
                            <div class="js-modal__content-body"></div><div class="js-modal__content-footer"></div>
                        </div>`;

		const modalBody: HTMLElement | null = this.querySelector(".js-modal__content-body");
		if (modalBody === null) return;
		modalBody.appendChild(content);
	}
}
