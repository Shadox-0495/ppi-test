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

export function getUserPermitions(credentials: Array<any>, moduleName: string, subModuleName: string) {
	const permisions: Record<string, string> = {};

	const submodules = Object.values(credentials)
		.filter((module: Record<string, string>) => module.name == moduleName)
		.reduce((resp, element) => element.subModules, []);

	const actions = submodules.filter((submodule: Record<string, string>) => submodule.name == subModuleName).reduce((resp: any, element: any) => element.actions, []);

	for (const key in actions) {
		permisions[`data-${key.toLocaleLowerCase()}`] = `${actions[key]}`;
	}

	return permisions;
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

export function getElementAttributes2(element: HTMLElement) {
	const attrs: any = {};
	element.getAttributeNames().forEach((name) => {
		if (name.startsWith("data-")) {
			if (!attrs.data) attrs.data = {};
			attrs["data"][
				camelCase(
					name
						.replace(/^\w{4}[data]?(-)/, "")
						.toLowerCase()
						.replace("-", " ")
				)
			] = element.getAttribute(name);
			return false;
		}
		if (name.startsWith("aria-")) {
			if (!attrs.aria) attrs.aria = {};
			attrs["aria"][
				camelCase(
					name
						.replace(/^\w{4}[aria]?(-)/, "")
						.toLowerCase()
						.replace("-", " ")
				)
			] = element.getAttribute(name);
			return false;
		}
		attrs[camelCase(name.toLowerCase().replace("-", " "))] = element.getAttribute(name);
	});
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

export async function waitForHTMLElement(HTMLElementSelector: string) {
	return new Promise((resolve) => {
		if (document.querySelector(HTMLElementSelector)) {
			return resolve(document.querySelector(HTMLElementSelector));
		}

		const observer = new MutationObserver(() => {
			if (document.querySelector(HTMLElementSelector)) {
				resolve(document.querySelector(HTMLElementSelector));
				observer.disconnect();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	});
}
