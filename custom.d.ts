declare module "*.svg" {
	const content: any;
	export default content;
}

declare module "*.png" {
	const content: any;
	export default content;
}

declare module "*.html" {
	const content: any;
	export default content;
}

declare interface Window {
	JSZip: any;
	clipboardData: any;
}

declare interface Event {
	originalEvent: any;
}
