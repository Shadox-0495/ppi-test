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

		//get the table's id, which is necesary for the datatable and the filters modal.
		this.tableId = <string>$htmlTable.attr("id");
		//let tableStart = $htmlTable.offset().top - 5;

		//variable to store the datatable's total records after the first ajax request.
		this.totalRecords = 0;

		//get the default configuration for the datatables
		this.conf = confDataTables();

		//loop trough the table's dom column and add them to the columns variable for the datatble init
		this.conf.columns = $htmlTable.find("thead>tr:last-child>th").map((index, colHeader) => {
			let { name, type } = $(colHeader).data();
			type = type + "";
			$(colHeader).attr("data-num", `${index}`);
			//replace the spaces in the name for underscore for backend purpose.
			if (!name) {
				name = $(colHeader).text() != "" ? $(colHeader).text().replace(/\s/g, "_") : "-1";
				$(colHeader).attr("data-name", name);
			}
			return { name: `${name}`, num: index, text: $(colHeader).text(), type: `${type ? type : -1}` };
		});

		//this.#initialize();
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
		//create the DataTable object
		const dataTable = this.$htmlTable.DataTable(this.conf);
		//reference the DataTable's wrapper
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

	//conf.drawCallback = (settings: any) => {
	//	if (settings._iDisplayStart != tableStart) {
	//		var targetOffset = tableStart;
	//		if ($("body").scrollTop() > targetOffset) $("body").animate({ scrollTop: targetOffset }, 500);
	//	}
	//};

	conf.ajax.url = table.url;

	//necesary information that needs to be sent to the server
	conf.ajax.data = (dataSent: any) => {
		dataSent = mergeObjects(dataSent, table.ajaxArgs);
		const token = localStorage.getItem("token") || "";
		if (token != "") dataSent.token = token;
		dataSent.totalRecords = table.totalRecords;
		dataSent.filters = filter.get();
		return JSON.stringify(dataSent);
	};

	//only on the first render, get the total number of records so it's not fetched on every request
	conf.ajax.dataSrc = (dataResponse: any) => {
		if (table.totalRecords == 0) table.totalRecords = dataResponse.recordsTotal;
		dataResponse.recordsTotal = table.totalRecords;
		return dataResponse.data;
	};

	//before sending any ajax request show the loading spinner on the table
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

	//added the actions dropdown to the right of the table
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

	//create the filter's modal inside the html's body
	$("body").append(`<js-modal data-css-class="js-datatable__modal" data-title="Filters" data-modal="" id="dtFilter_${table.tableId}"></js-modal>`);

	//add the appply filters in the modal's footer
	$(`#dtFilter_${table.tableId}`).find(".js-modal__content-footer").append(`<button data-type="success" data-cmd='apply-filters'>Apply filters</button>`);

	//reference the modal's body
	const modalBody = $(`#dtFilter_${table.tableId}`).find(".js-modal__content-body");

	//append the filter's container with the empty filter message
	modalBody.append(`<ul class="dt-filter-container"><li class="dt-filter-container__item" data-name="empty">Without filters</li></ul>`);

	//add the add filter button to add new filter in the modal.
	modalBody.append(`<button data-type="success" data-cmd='add-filter'><div class="svg-icon"><svg viewBox="-1 -1.5 15 15"> <use xlink:href="#svg-plus"></use></svg></div><span>Add filter</span></button>`);

	//controls for the field based on field type
	const controls: any = {
		int: () => `<select>${dtNumberOperations}</select><label class="js-textbox outlined"><input class="js-textbox__input" data-name="value" type="number" placeholder=""></label>`,
		string: () => `<select>${dtStringOperations}</select><label class="js-textbox outlined"><input class="js-textbox__input" data-name="value" type="text" placeholder=""></label>`,
		id: () => `<select data-type="db-dt-filter" data-name="value"></select>`,
	};

	//all the actions related to the filters: add/delete/add-constrols/remove-controls/change-controls/get-filters
	const filter: any = {
		//if the action is to add a new filter
		"add-filter": () => {
			let options = "";

			//loop through the table's columns and get the column name, label and type
			conf.columns.map((index: number, field: any) => {
				const { name, type, text } = field;
				if (name == "-1") return false;
				options += `<option value="${name}" data-type="${type}">${text}</option>`;
			});

			//create the new filter in the popup so the user can select the column of the filter
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
		//if the action is to delete a filter
		"delete-filter": (el: any) => {
			//get the filter's container
			const filter = $(el.closest(".dt-filter-container__item"));
			//remove any select2 alredy initialized
			if (filter.find("select[data-name='value']").length > 0) filter.find("select[data-name='value']").select2("destroy");
			//remove the container
			filter.remove();
		},

		//if the action is to add the filter's controls
		"add-controls": (el: any) => {
			//loop through the available filters to check if the new field to filter is alredy in the existing fields
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
			//if the fields is duplicated exit the function
			if (duplicated) {
				el.val("");
				showAlert("", "error", `Esa columna ya esta seleccionada.`, { timer: 3000 });
				return;
			}
			//get the field's parent container
			const filter = el.closest(".dt-filter-container__item");
			//if there is a control already, remove it
			if (filter.find(`ul[data-name="db-dt-filter-list"]`).length > 0 && valueType != "id") filter.find(`ul[data-name="db-dt-filter-list"]`).remove();
			if (filter.find(">.dt-filter-container__item_body>*").length > 0) {
				if (filter.find("select[data-name='value']").length > 0) filter.find("select[data-name='value']").select2("destroy");
				filter.find(">.dt-filter-container__item_body").empty();
			}
			filter.addClass("open").attr("data-value-type", valueType);
			filter.find(">.dt-filter-container__item_body").append(controls[valueType]());

			//extra configuration in case the field's type is date,string or id
			//if the column type is id or string create a sever side select2
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

				//param needed in order to use the filters in reports
				if (table.ajaxArgs.reportName) params.reportName = table.ajaxArgs.reportName;

				//param needed in order to use the filters in maintenance module
				if (table.ajaxArgs.maintenanceCategory) params.maintenanceCategory = table.ajaxArgs.maintenanceCategory;

				//initialize the sever sided select2
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

				//locate the select's search textbox
				const searchBox = filter.find(`[type="search"]`);

				//if there's not an icon add it
				if (searchBox.parent().find(">.svg-icon").length == 0) searchBox.parent().prepend(`<div class="svg-icon"><svg viewBox="0 0 17 17"> <use xlink:href="#svg-search"></use></svg></div>`);

				//select2's configuration to remain open
				select
					.on("select2:select", () => {
						setTimeout(() => {
							searchBox.attr("placeholder", "Search");
						}, 5);
					})
					.on("select2:selecting", (e: any) => {
						//when selecting append the newly added option to the options container
						searchOptions.append(`<li data-value="${e.params.args.data.id}"> <div class="svg-icon" data-cmd="delete-option"><svg viewBox="0 0 12 12"> <use xlink:href="#svg-times"></use></svg></div> ${e.params.args.data.text}</li>`);
					})
					.on("select2:unselecting", (e: any) => {
						//when unselection remove the newly unselected value from the options container
						searchOptions.find(`>li[data-value="${e.params.args.data.id}"]`).remove();
					})
					.on("select2:open", function (e: any) {
						//disable scroll when select2 is open
						const evt = "scroll.select2";
						$(e.target).parents().off(evt);
						$(window).off(evt);
					})
					.on("select2:closing", function (e: any) {
						//remove default js behaviour
						e.preventDefault();
					})
					.on("select2:closed", function () {
						//if the select2 is closed open it again
						select.select2("open");
					})
					.on("change", function () {
						searchBox.attr("placeholder", "Buscar");
						select.data("select2").results.setClasses();
					});

				//open the newly created select2
				select.select2("open");
			}
		},
		"delete-option": (el: any) => {
			//when removing one alredy selected option from the options container remove it from the select2's selected options
			el = $(el);
			const value: any = el.parent().attr("data-value");
			const filter = el.closest(".dt-filter-container__item");
			const select = filter.find("select[data-name='value']");
			select.val(select.val().filter((item: string) => item != value)).trigger("change");
			el.parent().remove();
		},
		get: () => {
			//get function needed to send the filters to the server
			const dtFilters: Array<object> = [];

			//loop through all the added filters in the modal.
			modalBody.find(`.dt-filter-container__item:not([data-name="empty"])`).each((index, item: any) => {
				item = $(item);
				const column = item.find(`[data-name="column-select"] :selected`).val(); //backend column name
				const type = item.attr("data-value-type"); //column data type int/string/id/date
				let operation = "";
				let values: Array<string> = [];
				//if the type is string or id get the select2's values
				if (type == "id") values = item.find(`.dt-filter-container__item_body > [data-name="value"]`).val();
				//if it's an int, encode the special symbol (=,>,<,>=,<=,!=)
				if (type == "int" || type == "string") {
					operation = encodeURIComponent(item.find(">.dt-filter-container__item_body>select :selected").val());
					values.push(item.find(`.js-textbox__input`).val());
				}
				//if there are no values in the filter jump to the next one
				if (values.length == 0) return;
				//add the filter's data into the object that will be sent in the new ajax request.
				dtFilters.push({
					column: column,
					type: item.attr("data-value-type"),
					operation: operation,
					values: values,
				});
			});
			//return the filter object.
			return dtFilters;
		},
	};

	//click event for the whole modal's buttons, actions triggered by the data-cmd value
	modalBody.on("click", (Event) => {
		const clickedElement = Event.target;
		if (clickedElement.closest("[data-cmd]")) {
			const el: any = clickedElement.closest("[data-cmd]");
			const cmd = $(el)?.attr("data-cmd") || "";
			if (cmd === "") return;
			filter[cmd](el);
		}
	});
	//let clickedElement: any = Event.target;

	//change event for the whole modal's selects to add the new controls based on the selected option
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
			//display: $.fn.dataTable.Api.Responsive.display.childRowImmediate,
			renderer: (api: DataTables.Api, rowIdx: number, columns: any) => {
				const data = $.map(columns, (col) => {
					//let hidden = typeof $($htmlTable.find(`thead>tr>th[data-num='${col.columnIndex}']`)[0]).attr("data-hidden") !== "undefined" ? $(htmlTable.find(`thead>tr>th[data-num='${col.columnIndex}']`)[0]).attr("data-hidden") : "-1";
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
