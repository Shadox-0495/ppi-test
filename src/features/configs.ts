import { mergeObjects } from "@features/utils";

export function confDataTables(args: any = {}) {
	const conf: any = {
		order: [[0, "desc"]],
		dom: `<'js-dt-toolbar'f<'js-dt-toolbar__add'><'js-dt-toolbar__filter'><'js-dt-toolbar__export js-dropdown'B><'js-dt-toolbar__info'li>><'js-dt-container't>p`,
		pagingType: "full_numbers",
		deferRender: true,
		processing: true,
		pageLength: parseInt(localStorage.getItem("dtRecordsLength") || "10"),
		serverSide: true,
		ajax: {
			type: "POST",
			dataType: "json",
			error(xhr: any) {
				if (xhr.status >= 200 && xhr.status <= 299) return;
				console.log(`HTTP request error: ${xhr.status}`);
			},
		},
		responsive: {
			details: {
				renderer: (api: DataTables.Api, rowIdx: number, columns: DataTables.ColumnMethods) => {
					const data = $.map(columns, (col: any) => {
						return col.hidden ? `<tr data-dt-row='${col.rowIndex}' data-dt-column='${col.columnIndex}'><td>${col.title}:</td><td>${col.data}</td></tr>` : "";
					}).join("");
					return data ? $("<div class='slider' />").append($("<table class='js-datatable__details' />").append(data)) : false;
				},
				display: (row: DataTables.RowMethods, update: boolean, render: any) => {
					if (update) return;

					if (row.child.isShown()) {
						$("div.slider", row.child()).slideUp(225, () => {
							row.child(false);
							$(row.node()).removeClass("parent shown");
						});
						return;
					}

					if (!row.child.isShown()) {
						row.child(render(), "child").show();
						$(row.node()).addClass("parent shown");
						$("div.slider", row.child()).slideDown(225);
						return;
					}
				},
			},
		},
		language: {
			lengthMenu: "_MENU_",
			paginate: {
				first: `<div class="svg-icon"><svg viewBox="-4 -3 18 18"> <use xlink:href="#svg-angle-double-left"></use></svg></div>`,
				previous: `<div class="svg-icon"><svg viewBox="-4 -3 18 18"> <use xlink:href="#svg-angle-left"></use></svg></div>`,
				next: `<div class="svg-icon"><svg viewBox="-4 -3 18 18"> <use xlink:href="#svg-angle-right"></use></svg></div>`,
				last: `<div class="svg-icon"><svg viewBox="-4 -3 18 18"> <use xlink:href="#svg-angle-double-right"></use></svg></div>`,
			},
			infoEmpty: "Empty.",
			zeroRecords: "Empty.",
			info: "_START_ - _END_ of _TOTAL_",
			search: "",
			searchPlaceholder: "Search",
			infoFiltered: "(_MAX_)",
			loadingRecords: "Loading...",
			aria: { sortAscending: ": Order asc.", sortDescending: ": Order desc." },
		},
		columnDefs: [{ targets: 0, class: "dtDetails" }],
		buttons: {
			dom: { container: { className: "js-dropdown__menu" } },
			buttons: [
				{
					extend: "excelHtml5",
					title: "",
					className: "dtExport",
					text: `<div class="svg-icon"><svg viewBox="-1 -1.5 15 18"> <use xlink:href="#svg-excel-file"></use></svg></div><span>Excel</span>`,
					exportOptions: { columns: "th:not([data-export='n'])" },
				},
				{
					extend: "csvHtml5",
					title: "",
					className: "dtExport",
					text: `<div class="svg-icon"><svg viewBox="-1 -1.5 15 18"> <use xlink:href="#svg-file-alt"></use></svg></div><span>CSV</span>`,
					exportOptions: { columns: "th:not([data-export='n'])" },
				},
				{
					extend: "print",
					title: "",
					className: "dtExport",
					text: `<div class="svg-icon"><svg viewBox="-0.5 0 16 16"> <use xlink:href="#svg-print"></use></svg></div><span>Print</span>`,
					exportOptions: { columns: "th:not([data-export='n'])" },
					customize: (win: Window) => {
						$(win.document.body).css("font-size", "0.95rem");
						$(win.document.body).find("h1").remove();
						$(win.document.body).find("div").remove();
					},
				},
			],
		},
	};
	return mergeObjects(conf, args);
}

export function confSweetAlert(args = {}) {
	const obj = { showConfirmButton: false, showCancelButton: false, allowOutsideClick: false, cancelButtonText: "Cancelar" };
	return mergeObjects(obj, args);
}

export function confSelect2(args = {}) {
	const obj = {
		dropdownCssClass: "js-select2-dropdown",
		multiple: false,
		placeholder: "Select an option",
		allowClear: false,
		language: {
			errorLoading: () => "Error while loading",
			inputTooLong: () => "Too large",
			inputTooShort: () => "Too short",
			loadingMore: () => "Loading more",
			maximumSelected: () => "Max selected",
			noResults: () => "No results",
			searching: () => "Searching...",
		},
	};
	return mergeObjects(obj, args);
}

export const actions: { [key: string]: { [key: string]: ($el: JQuery<HTMLElement> | undefined) => void } } = {
	state: {
		open: ($el: JQuery<HTMLElement> | undefined) => {
			$el?.removeClass("close").addClass("open");
		},
		close: ($el: JQuery<HTMLElement> | undefined) => {
			$el?.removeClass("open").addClass("close");
		},
		toggle: ($el: JQuery<HTMLElement> | undefined) => {
			if ($el?.hasClass("open")) {
				actions.state.close($el);
				return;
			}
			actions.state.open($el);
		},
		beforeOpen: ($el: JQuery<HTMLElement> | undefined) => {
			if ($el?.hasClass("open")) {
				actions.state.close($el);
				return;
			}
			actions.state.open($el);
		},
	},
	modal: {
		open: ($el: JQuery<HTMLElement> | undefined) => {
			$el?.removeClass("close").addClass("open");
		},
		close: ($el: JQuery<HTMLElement> | undefined) => {
			$el?.removeClass("open").addClass("close");
		},
		toggle: ($el: JQuery<HTMLElement> | undefined) => {
			if ($el?.hasClass("open")) {
				actions.modal.close($el);
				return;
			}
			actions.modal.open($el);
		},
	},
	dropdown: {
		open: ($el: JQuery<HTMLElement> | undefined) => {
			$el?.removeClass("close").addClass("open");
		},
		close: ($el: JQuery<HTMLElement> | undefined) => {
			$el?.removeClass("open").addClass("close");
		},
		toggle: ($el: JQuery<HTMLElement> | undefined) => {
			if ($el?.hasClass("open")) {
				actions.dropdown.close($el);
				return;
			}
			actions.dropdown.beforeOpen(undefined);
			actions.dropdown.open($el);
		},
		beforeOpen: () => {
			$(".js-dropdown.open").each((index, element) => {
				actions.dropdown.close($(element));
			});
		},
	},
	collapse: {
		open: ($el: JQuery<HTMLElement> | undefined) => {
			$el?.removeClass("close").addClass("open");
		},
		close: ($el: JQuery<HTMLElement> | undefined) => {
			$el?.removeClass("open").addClass("close");
		},
		toggle: ($el: JQuery<HTMLElement> | undefined) => {
			if ($el?.hasClass("open")) {
				actions.collapse.close($el);
				return;
			}
			actions.collapse.beforeOpen(undefined);
			actions.collapse.open($el);
		},
		beforeOpen: () => {
			$(".js-collapse.open").each((index, element) => {
				actions.collapse.close($(element));
			});
		},
	},
};

export const apiUrl = `${process.env.API_URL}/api.php`;
