import "datatables.net";
import "datatables.net-responsive";
import JSZip from "jszip";
window.JSZip = JSZip;
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import { mergeObjects } from "@features/utils";
import { showAlert } from "@components/alert";
import { confDataTables, apiUrl } from "@features/configs";
import { serverSelect2 } from "@components/select2";

$.fn.dataTable.ext.errMode = "none";

export function getColumn(dataTable: DataTables.Api, columnName: string | string[]): Array<number> {
	const columns: any = dataTable.settings().init().columns;
	const resp: Array<number> = [];
	columns
		.filter((index: number, column: any) => {
			return column.name == columnName;
		})
		.map((index: number, column: any) => resp.push(column.num));
	return resp;
}

export function rowDataToObject(data: Array<any>, dt: DataTables.Api): Record<string, string> {
	const indexArray: any = {};
	const columns: any = dt.settings().init().columns;
	columns.map((index: number, column: any) => {
		const { name, num } = column;
		if (name === "-1") return;
		indexArray[name] = data[num] || "";
	});
	return indexArray;
}

export default class dataTable {
	type: string;
	tableId: string;
	totalRecords: number;
	conf: any;
	$htmlTable: JQuery<HTMLElement>;
	url: string;
	ajaxArgs: string;

	constructor($htmlTable: JQuery<HTMLElement>, url: string = apiUrl, ajaxArgs: any = {}) {
		if ($htmlTable.length == 0 || $htmlTable.length > 1 || typeof $htmlTable == undefined) return;
		this.type = <string>$htmlTable.attr("data-type");
		if (!this.type) return;
		this.$htmlTable = $htmlTable;
		this.url = url;
		this.ajaxArgs = ajaxArgs;

		this.tableId = <string>$htmlTable.attr("id");

		this.totalRecords = 0;

		this.conf = confDataTables();

		this.conf.columns = $htmlTable.find("thead>tr:last-child>th").map((index, colHeader) => {
			let { name, type } = $(colHeader).data();
			type = type + "";
			$(colHeader).attr("data-num", `${index}`);

			if (!name) {
				name = $(colHeader).text() != "" ? $(colHeader).text().replace(/\s/g, "_") : "-1";
				$(colHeader).attr("data-name", name);
			}
			return { name: `${name}`, num: index, text: $(colHeader).text(), type: `${type ? type : -1}` };
		});

		if (this.type == "filter") this.conf = filterTable(this);
		if (this.type == "simple") this.conf = simpleTable(this);
		if (this.type == "server") this.conf = serverTable(this);
	}

	getColumn(columnName: string | string[]): Array<number> {
		const resp: Array<number> = [];
		if (typeof columnName === "string") {
			this.conf.columns.filter((index: any, column: any) => column.name == columnName).map((index: any, column: any) => resp.push(column.num));
		}

		if (typeof columnName === "object") {
			columnName.forEach((col: string) => {
				this.conf.columns.filter((index: any, column: any) => column.name == col).map((index: any, column: any) => resp.push(column.num));
			});
		}

		return resp;
	}

	initTable() {
		const dataTable = this.$htmlTable.DataTable(this.conf);

		const dataTableContainer = this.$htmlTable.closest(".dataTables_wrapper");

		dataTableContainer.addClass("js-dt-wrapper").attr("data-view", `${this.type}`);

		dataTable.on("error.dt", function (e, settings, techNote, message) {
			showAlert("", "error", message, { showConfirmButton: true });
			return;
		});

		$(`#dtFilter_${this.tableId}`)
			.find("[data-cmd='apply-filters']")
			.attr({ "data-toggle": "modal", "data-target": `#dtFilter_${this.tableId}` })
			.on("click", () => {
				dataTable.ajax.reload();
			});

		dataTableContainer.find(".dataTables_filter>label").prepend(`<div class="svg-icon"><svg viewBox="0 0 17 17"> <use xlink:href="#svg-search"></use></svg></div>`); //adds search icon

		dataTableContainer.find(".dataTables_filter input").addClass("js-dt-toolbar__search");

		dataTableContainer
			.find(".js-dt-toolbar__export")
			.prepend(`<div class='js-dropdown__button' data-toggle='dropdown' data-target='parent(1)'><div class="svg-icon"><svg viewBox="0 0 18 18"> <use xlink:href="#svg-download"></use></svg></div><span>Export</span></div>`);

		dataTableContainer.find(".dt-button").addClass("js-dropdown__menu-item");

		dataTableContainer
			.find(".js-dt-toolbar__filter")
			.append(`<div class="svg-icon"><svg viewBox="0 0 17 17"> <use xlink:href="#svg-filter"></use></svg></div><span>Advance filtering</span>`)
			.attr({ "data-toggle": "modal", "data-target": `#dtFilter_${this.tableId}` });

		dataTableContainer.find(".js-dt-toolbar__add").append(`<div class="svg-icon"><svg viewBox="-1 -1.5 15 15"> <use xlink:href="#svg-plus"></use></svg></div><span>New record</span>`);

		return dataTable;
	}
}

function filterTable(table: any) {
	const conf = table.conf;

	conf.ajax.url = table.url;

	conf.ajax.data = (dataSent: any) => {
		dataSent = mergeObjects(dataSent, table.ajaxArgs);
		const token = localStorage.getItem("token") || "";
		if (token != "") dataSent.token = token;
		dataSent.totalRecords = table.totalRecords;
		dataSent.filters = filter.get();
		return JSON.stringify(dataSent);
	};

	conf.ajax.dataSrc = (dataResponse: any) => {
		if (table.totalRecords == 0) table.totalRecords = dataResponse.recordsTotal;
		dataResponse.recordsTotal = table.totalRecords;
		return dataResponse.data;
	};

	conf.ajax.beforeSend = () => {
		if (table.$htmlTable.find("tbody tr.js-datatable__loading").length !== 0) return;
		const loadingSpinner = `<tr class='js-datatable__loading' style='${table.$htmlTable.find("tbody>tr").length <= 0 ? "height:10rem;" : ""}' ><td colspan='${
			table.$htmlTable.find(">thead th").length
		}'><div class='js-loading-spinner' data-type='full-space' data-effect='blur'></div></td></tr>`;
		if (table.$htmlTable.find("tbody>tr").length > 0) {
			table.$htmlTable.find("tbody").prepend(loadingSpinner);
		} else {
			table.$htmlTable.find("tbody").html(loadingSpinner);
		}
	};

	conf.columnDefs.push({
		targets: -1,
		width: "1px",
		orderable: false,
		searchable: false,
		data: null,
		class: "js-datatable-actions",
		render: () => {
			return `<js-dropdown data-drop="down-left" data-icon="#svg-ellipsis-v" data-viewbox="-6.5 -1.5 16 16">
						<button class='js-dropdown__menu-item' data-cmd='Eliminar'><div class="svg-icon"><svg viewBox="-1.5 0 16 16"> <use xlink:href="#svg-delete"></use></svg></div>Delete</button>
						<button class='js-dropdown__menu-item' data-cmd='Modificar'><div class="svg-icon"><svg viewBox="0 0 16.5 18"> <use xlink:href="#svg-edit"></use></svg></div>Modify</button>
					</js-dropdown>`;
		},
	});
	const dtNumberOperations = ` <option value="=" data-name="igual"> equal </option> <option value="!=" data-name="diferente"> different </option> <option value=">" data-name="mayor que"> more than </option>
		<option value=">=" data-name="mayor o igual que"> more or equal to </option> <option value="<" data-name="menor que"> less than </option> <option value="<=" data-name="menor o igual que"> less or equal to </option>`;
	const dtStringOperations = ` <option value="=" data-name="igual"> equal </option> <option value="!=" data-name="diferente"> different </option> <option value="%<<value>>%" data-name="contiene"> contains </option>
		<option value="<<value>>%" data-name="comienza con"> starts with </option> <option value="%<<value>>" data-name="termina con"> ends with </option> <option value="not%<<value>>%" data-name="no contiene"> doesn't contains </option>
		<option value="not<<value>>%" data-name="no comienza con"> doesn't starts with </option> <option value="not%<<value>>" data-name="no termina con"> doesn't ends with </option>`;

	$("body").append(`<js-modal data-css-class="js-datatable__modal" data-title="Filters" data-modal="" id="dtFilter_${table.tableId}"></js-modal>`);

	$(`#dtFilter_${table.tableId}`).find(".js-modal__content-footer").append(`<button data-type="success" data-cmd='apply-filters'>Apply filters</button>`);

	const modalBody = $(`#dtFilter_${table.tableId}`).find(".js-modal__content-body");

	modalBody.append(`<ul class="dt-filter-container"><li class="dt-filter-container__item" data-name="empty">Without filters</li></ul>`);

	modalBody.append(`<button data-type="success" data-cmd='add-filter'><div class="svg-icon"><svg viewBox="-1 -1.5 15 15"> <use xlink:href="#svg-plus"></use></svg></div><span>Add filter</span></button>`);

	const controls: any = {
		int: () => `<select>${dtNumberOperations}</select><label class="js-textbox outlined"><input class="js-textbox__input" data-name="value" type="number" placeholder=""></label>`,
		string: () => `<select>${dtStringOperations}</select><label class="js-textbox outlined"><input class="js-textbox__input" data-name="value" type="text" placeholder=""></label>`,
		id: () => `<select data-type="db-dt-filter" data-name="value"></select>`,
	};

	const filter: any = {
		"add-filter": () => {
			let options = "";

			conf.columns.map((index: number, field: any) => {
				const { name, type, text } = field;
				if (name == "-1") return false;
				options += `<option value="${name}" data-type="${type}">${text}</option>`;
			});

			modalBody.find(">.dt-filter-container").append(`
				<li class="dt-filter-container__item" data-value-type="">
					<div class="dt-filter-container__item_header">
						<div data-name="title">
							<button data-cmd="delete-filter" data-type="danger"><div class="svg-icon"><svg viewBox="0 0 12 12"> <use xlink:href="#svg-times"></use></svg></div></button>
							<select class="js-select" data-name="column-select"><option value='' data-type='null'></option>${options}</select>
							<button data-toggle="collapse" data-target="parent(3)"> <div class="svg-icon"><svg viewBox="0 0 12 7"> <use xlink:href="#svg-angle-down"></use></svg></div> </button>
						</div>
					</div>
					<div class="dt-filter-container__item_body"></div>
				</li>
			`);
		},

		"delete-filter": (el: any) => {
			const filter = $(el.closest(".dt-filter-container__item"));

			if (filter.find("select[data-name='value']").length > 0) filter.find("select[data-name='value']").select2("destroy");

			filter.remove();
		},

		"add-controls": (el: any) => {
			el = $(el);
			const valueType: any = el.find(":selected").attr("data-type");
			if (valueType == "null") return;
			const container = el.closest(".dt-filter-container");
			const column = el.val();
			let duplicated = false;
			container.find(`select[data-name="column-select"]`).each((index: number, element: HTMLElement) => {
				if (element == el[0]) return;
				duplicated = $(element).val() == column;
				if (duplicated) return false;
			});

			if (duplicated) {
				el.val("");
				showAlert("", "error", `Esa columna ya esta seleccionada.`, { timer: 3000 });
				return;
			}

			const filter = el.closest(".dt-filter-container__item");

			if (filter.find(`ul[data-name="db-dt-filter-list"]`).length > 0 && valueType != "id") filter.find(`ul[data-name="db-dt-filter-list"]`).remove();
			if (filter.find(">.dt-filter-container__item_body>*").length > 0) {
				if (filter.find("select[data-name='value']").length > 0) filter.find("select[data-name='value']").select2("destroy");
				filter.find(">.dt-filter-container__item_body").empty();
			}
			filter.addClass("open").attr("data-value-type", valueType);
			filter.find(">.dt-filter-container__item_body").append(controls[valueType]());

			if (valueType == "id") {
				if (filter.find(`ul[data-name="db-dt-filter-list"]`).length == 0) filter.find(">.dt-filter-container__item_header").append(`<ul data-name="db-dt-filter-list"></ul>`);
				const searchOptions = filter.find(`ul[data-name="db-dt-filter-list"]`);
				const select = filter.find("[data-name='value']");
				const params: any = {
					module: table.ajaxArgs.module,
					action: table.ajaxArgs.action,
					type: "select2",
					column: column,
				};

				if (table.ajaxArgs.reportName) params.reportName = table.ajaxArgs.reportName;

				if (table.ajaxArgs.maintenanceCategory) params.maintenanceCategory = table.ajaxArgs.maintenanceCategory;

				serverSelect2(
					select,
					{
						placeholder: "Search",
						dropdownParent: filter.find(">.dt-filter-container__item_body"),
						closeOnSelect: false,
						multiple: true,
					},
					`${process.env.API_URL}/api.php`,
					params
				);

				const searchBox = filter.find(`[type="search"]`);

				if (searchBox.parent().find(">.svg-icon").length == 0) searchBox.parent().prepend(`<div class="svg-icon"><svg viewBox="0 0 17 17"> <use xlink:href="#svg-search"></use></svg></div>`);

				select
					.on("select2:select", () => {
						setTimeout(() => {
							searchBox.attr("placeholder", "Search");
						}, 5);
					})
					.on("select2:selecting", (e: any) => {
						searchOptions.append(`<li data-value="${e.params.args.data.id}"> <div class="svg-icon" data-cmd="delete-option"><svg viewBox="0 0 12 12"> <use xlink:href="#svg-times"></use></svg></div> ${e.params.args.data.text}</li>`);
					})
					.on("select2:unselecting", (e: any) => {
						searchOptions.find(`>li[data-value="${e.params.args.data.id}"]`).remove();
					})
					.on("select2:open", function (e: any) {
						const evt = "scroll.select2";
						$(e.target).parents().off(evt);
						$(window).off(evt);
					})
					.on("select2:closing", function (e: any) {
						e.preventDefault();
					})
					.on("select2:closed", function () {
						select.select2("open");
					})
					.on("change", function () {
						searchBox.attr("placeholder", "Buscar");
						select.data("select2").results.setClasses();
					});

				select.select2("open");
			}
		},
		"delete-option": (el: any) => {
			el = $(el);
			const value: any = el.parent().attr("data-value");
			const filter = el.closest(".dt-filter-container__item");
			const select = filter.find("select[data-name='value']");
			select.val(select.val().filter((item: string) => item != value)).trigger("change");
			el.parent().remove();
		},
		get: () => {
			const dtFilters: Array<object> = [];

			modalBody.find(`.dt-filter-container__item:not([data-name="empty"])`).each((index, item: any) => {
				item = $(item);
				const column = item.find(`[data-name="column-select"] :selected`).val();
				const type = item.attr("data-value-type");
				let operation = "";
				let values: Array<string> = [];

				if (type == "id") values = item.find(`.dt-filter-container__item_body > [data-name="value"]`).val();

				if (type == "int" || type == "string") {
					operation = encodeURIComponent(item.find(">.dt-filter-container__item_body>select :selected").val());
					values.push(item.find(`.js-textbox__input`).val());
				}

				if (values.length == 0) return;

				dtFilters.push({
					column: column,
					type: item.attr("data-value-type"),
					operation: operation,
					values: values,
				});
			});

			return dtFilters;
		},
	};

	modalBody.on("click", (Event) => {
		const clickedElement = Event.target;
		if (clickedElement.closest("[data-cmd]")) {
			const el: any = clickedElement.closest("[data-cmd]");
			const cmd = $(el)?.attr("data-cmd") || "";
			if (cmd === "") return;
			filter[cmd](el);
		}
	});

	modalBody.on("change", (Event) => {
		const changedElement: any = Event.target;
		if (changedElement.closest(`[data-name="column-select"]`)) {
			const el = changedElement.closest(`[data-name="column-select"]`);
			filter["add-controls"](el);
		}
	});

	return conf;
}

function simpleTable(table: any) {
	const conf = table.conf;
	delete conf.serverSide;
	delete conf.pageLength;
	delete conf.pagingType;
	delete conf.buttons;
	delete conf.ajax;

	conf.paging = false;
	conf.order = [[0, "desc"]];
	conf.dom = `<'js-dt-toolbar'<'js-dt-toolbar__add'>><t>`;
	conf.responsive = {
		details: {
			renderer: (api: DataTables.Api, rowIdx: number, columns: any) => {
				const data = $.map(columns, (col) => {
					return col.hidden ? `<tr data-dt-row='${col.rowIndex}' data-dt-column='${col.columnIndex}'><td>${col.title}:</td><td>${col.data}</td></tr>` : "";
				}).join("");
				return data ? $("<table class='js-datatable__details' />").append(data) : false;
			},
		},
	};
	conf.columns[0].orderable = false;
	conf.columnDefs = [
		{
			targets: 0,
			width: "1%",
			createdCell: (td: HTMLElement, data: string) => $(td).attr("data-id", `${data}`),
			render: (data: any, row: any, type: any, meta: any) => {
				return meta.row + 1;
			},
		},
	];
	return conf;
}

function serverTable(table: any) {
	const conf = table.conf;
	conf.order = [[0, "desc"]];
	conf.dom = `<'js-dt-toolbar'f><t>p`;
	conf.columnDefs = [];
	conf.pageLength = 10;
	conf.ajax.url = table.url;
	conf.ajax.data = (dataSent: any) => {
		dataSent = mergeObjects(dataSent, table.ajaxArgs);
		const token = localStorage.getItem("token") || "";
		if (token != "") dataSent.token = token;
		dataSent.totalRecords = table.totalRecords;
		return JSON.stringify(dataSent);
	};
	conf.ajax.dataSrc = (dataResponse: any) => {
		if (table.totalRecords == 0) table.totalRecords = dataResponse.recordsTotal;
		dataResponse.recordsTotal = table.totalRecords;
		return dataResponse.data;
	};
	conf.ajax.beforeSend = () => {
		if (table.$htmlTable.find("tbody tr.js-datatable__loading").length !== 0) return;
		const loadingSpinner = `<tr class='js-datatable__loading' style='${table.$htmlTable.find("tbody>tr").length <= 0 ? "height:10rem;" : ""}' ><td colspan='${
			table.$htmlTable.find(">thead th").length
		}'><div class='js-loading-spinner' data-type='full-space' data-effect='blur'></div></td></tr>`;
		if (table.$htmlTable.find("tbody>tr").length > 0) {
			table.$htmlTable.find("tbody").prepend(loadingSpinner);
		} else {
			table.$htmlTable.find("tbody").html(loadingSpinner);
		}
	};

	return conf;
}
