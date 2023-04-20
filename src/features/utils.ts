import { camelCase } from "change-case";

export default {};

export function onlySpaces(value: string | number | string[] | undefined) {
	return /^\s*$/.test(`${value}`);
}

export function mergeObjects(target = {}, args = {}) {
	if (Object.keys(args).length === 0) return target;
	const merge = Object.assign(target, args);
	return merge;
}

export function parentNode(element: JQuery<HTMLElement>, num: number) {
	let current = element;
	for (let i = 0; i < num; i++) {
		current = current.parent();
	}
	return current;
}

export function htmlStringToFragment(html: string) {
	const docFragment = document.createDocumentFragment();
	const elContainer = document.createElement("div");
	elContainer.innerHTML = html;
	while (elContainer.childNodes[0]) {
		docFragment.appendChild(elContainer.childNodes[0]);
	}
	return docFragment;
}

export function getElementAttributes(element: HTMLElement) {
	const attrs: Record<string, string> = element.getAttributeNames().reduce((acc, name) => {
		return {
			...acc,
			[camelCase(
				name
					.replace(/^\w{4}[data]?(-)/, "")
					.toLowerCase()
					.replace("-", " ")
			)]: element.getAttribute(name),
		};
	}, {});
	return attrs;
}

export function setElementAttributes(element: HTMLElement | null, attr: Record<string, string> = {}) {
	if (Object.keys(attr).length === 0) return;
	if (element == null) return;
	for (const key in attr) {
		element.setAttribute(key, attr[key]);
	}
	return element;
}

export function removeElementAttributes(element: HTMLElement) {
	while (element.attributes.length > 0) {
		element.removeAttribute(element.attributes[0].name);
	}
}

export const validEmail = (email: string) => {
	return String(email)
		.toLowerCase()
		.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};
