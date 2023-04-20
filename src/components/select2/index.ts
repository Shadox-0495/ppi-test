import "select2";
import { showAlert } from "@components/alert";
import { mergeObjects } from "@features/utils";
import { confSelect2, apiUrl } from "@features/configs";

export function serverSelect2(htmlSelect: JQuery<HTMLElement>, confArgs: any = {}, url: string = apiUrl, ajaxArgs: any = {}) {
	const conf: any = confSelect2(confArgs);
	if (conf.multiple) conf.dropdownCssClass = `${conf.dropdownCssClass} js-select2-dropdown--multiple`;
	const parentContainer = htmlSelect.parent();
	const type = htmlSelect.attr("data-type") || "";

	if (type == "db-dt-filter") {
		conf.ajax = {
			url: url,
			method: "POST",
			dataType: "json",
			cache: false,
			delay: 250,
			data: (d: any) => {
				d.limit = 10;
				d.search = d.term || "";
				d.page = d.page || 1;
				d = mergeObjects(d, ajaxArgs);
				return JSON.stringify(d);
			},
			processResults: (data: any) => {
				return {
					results: data.results,
					pagination: { more: data.more },
				};
			},
			fail: (jqXHR: any, textStatus: any, errorThrown: any) => {
				showAlert("", "error", `Error al cargar los datos del select ${textStatus} - ${errorThrown} - ${jqXHR.responseText}`, { timer: 2000 });
			},
		};
	}

	htmlSelect.select2(conf);

	parentContainer.find(">.select2").addClass("js-select2");

	htmlSelect.on("select2:open", () => {
		const searchField = $(".select2-search--dropdown>input[type='search']");

		//workaround for focusing the searchbox in select2
		const select2Searchbox = <NodeListOf<HTMLInputElement>>document.querySelectorAll(".select2-container--open .select2-search__field");

		$(document).one("mouseup keyup", () => setTimeout(() => select2Searchbox[select2Searchbox.length - 1].focus(), 0));

		//loop through all the search dropdowns and add the search icon if it doesn't exist
		$(".select2-search--dropdown").each((index, element) => {
			if ($(element).find(">.svg-icon").length === 0) $(element).append("<div class='svg-icon'><svg viewBox='0 0 17 17'> <use xlink:href='#svg-search'></use></svg></div>");
		});

		if (typeof htmlSelect.attr("data-search-placeholder") !== "undefined") searchField.attr("placeholder", htmlSelect.attr("data-search-placeholder") || "");
	});
}
