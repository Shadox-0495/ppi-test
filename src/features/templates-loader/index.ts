import Handlebars from "handlebars";
import template from "@assets/templates/templates.html";
import { showAlert } from "@components/alert";
import { ajax } from "@features/ajax";
const [templatesHtml, templatesError] = await ajax({ contentType: "", dataType: "text", cache: true }, { token: "" }, "GET", template);
if (templatesError) console.error(`Error while fetching the templates:${templatesError}`);
const templates = new DOMParser().parseFromString(templatesHtml, "text/html");

export default templates;

export function compileTemplate(templateID = "", templateData = {}) {
	if (templatesError || templateID === "") return "";
	const templateScript: string = $(templates).find(`#${templateID}`).html();
	if (templateScript.length == 0 || templateScript === "") {
		showAlert("", "error", `Error loading components, the component ${templateID} doesn't exists, make sure the components exists before trying to load it.`, { showConfirmButton: true });
		return "";
	}
	let compileTemplate: any = Handlebars.compile(templateScript);
	if (Object.keys(templateData).length !== 0) compileTemplate = compileTemplate(templateData);
	return compileTemplate;
}
