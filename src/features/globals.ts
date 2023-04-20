import "@sass/index.scss";
import { parentNode } from "@features/utils";
import { showAlert } from "@components/alert";
import { actions } from "@features/configs";
import { ajax } from "@features/ajax";
import jsTextBox from "@components/textbox";
import jsModal from "@components/modal";
import jsDropDown from "@components/dropdown";

customElements.define("js-textbox", jsTextBox);
customElements.define("js-modal", jsModal);
customElements.define("js-dropdown", jsDropDown);

document.addEventListener("click", (Event) => {
	const clickedElement = <HTMLElement>Event.target;

	if (clickedElement.closest("[data-toggle]")) {
		//get the clicked element
		const el: JQuery<HTMLElement> = $(clickedElement).closest("[data-toggle]");
		let $target: string | JQuery<HTMLElement> = el.attr("data-target") || el;
		const htmlEvent: string = el.attr("data-toggle") || "";
		//check if the element has a data-toggle attribute otherwise return the same element
		if (htmlEvent === "logOff") {
			logOff();
			return;
		}
		//if the target is a string
		if (typeof $target === "string") {
			//check if the string contain parent, get the parent element
			if ($target.indexOf("parent") !== -1) {
				const num = parseInt($target.split("(")[1].slice(0, -1));
				$target = parentNode(el, num);
			} else {
				//else get the element by the selector
				$target = $($target);
			}
		}
		//based on the data-toggle attribute get the action
		actions[htmlEvent].toggle($target);
	}

	if (clickedElement.closest(".js-txt-resize")) {
		const el = $(clickedElement).closest(".js-txt-resize");
		el.removeClass("close").addClass("open");
	}

	if (!clickedElement.closest("[data-toggle]")) {
		actions.dropdown.beforeOpen(undefined);
	}

	if (!clickedElement.closest(".js-txt-resize")) {
		$(".js-txt-resize").each((index, element) => {
			if ($(element).find("span[contenteditable]").html().length == 0) {
				$(element).removeClass("open").addClass("close");
			}
		});
	}
});

document.addEventListener("change", (Event) => {
	const elementChange = <HTMLElement>Event.target;
	if (elementChange.closest(".js-dt-wrapper[data-view='filter'] .dataTables_length")) {
		const el = $(<Element>elementChange.closest(".js-dt-wrapper[data-view='filter'] .dataTables_length"));
		const pageLength = el.find("select").val();
		localStorage.setItem("dtRecordsLength", `${pageLength}`);
	}
});

document.addEventListener("contextmenu", (Event) => {
	const clickedElement = <HTMLElement>Event.target;
	if (clickedElement.closest(`[href="#report"]`)) {
		Event.preventDefault();
		const el: JQuery<HTMLElement> = $(clickedElement).closest(`[href="#report"]`);
		const dropdown = el.closest(".js-dropdown");
		dropdown.addClass("close").removeClass("open");
		const reportName = <string>el.attr("data-name");
		const docWindow: any = window;
		docWindow.open(`reporte.html?reporte=${reportName.replace("submodule-", "").replace(" ", "-")}`, "_blank").focus();
	}
});

async function logOff() {
	const temp = await showAlert("", "warning", "Esta seguro de cerrar sesion?", { showConfirmButton: true, showCancelButton: true });
	if (!temp.isConfirmed) return;

	const token = localStorage.getItem("token") || "";
	const [respData, respError] = await ajax(undefined, { module: "usuario", action: "logout", token });
	if (respError) return;

	if (respData.status) {
		localStorage.removeItem("token");
		localStorage.removeItem("expiration");
		location.reload();
	}
}
