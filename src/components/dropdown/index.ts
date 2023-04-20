import { htmlStringToFragment, getElementAttributes, setElementAttributes } from "@features/utils";
export default class jsDropDown extends HTMLElement {
	constructor() {
		super();
	}

	static get observedAttributes() {
		return ["data-icon", "data-viewbox", "data-label", "data-drop", "data-css-class", "data-menu-class"];
	}

	connectedCallback() {
		this.render();
	}

	render() {
		//const { htmlStringToFragment, getElementAttributes, setElementAttributes } = await import("@features/utils");
		const { cssClass, drop, icon, viewbox, label } = getElementAttributes(this);
		while (this.attributes.length > 0) {
			this.removeAttribute(this.attributes[0].name);
		}
		setElementAttributes(this, { class: `js-dropdown ${cssClass || ""}`, "data-drop": drop });

		const childs = htmlStringToFragment(this.innerHTML);
		this.innerHTML = `<div class='js-dropdown__button' data-toggle='dropdown' data-target='parent(1)'>
                                ${
									!icon && !viewbox
										? ""
										: `<div class="svg-icon">
										<svg viewBox="${viewbox}"> <use xlink:href="${icon}"></use></svg>
										</div>`
								}
                                ${!label ? "" : `<span>${label}</span>`}
                          </div>
                          <div class='js-dropdown__menu'></div>`;
		const menu: HTMLElement | null = this.querySelector(".js-dropdown__menu");
		if (menu === null) return;
		menu.appendChild(childs);
		for (const child of Array.from(menu?.children)) {
			child.classList.add("js-dropdown__menu-item");
		}
	}
}
