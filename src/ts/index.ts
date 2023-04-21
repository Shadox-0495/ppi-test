import { compileTemplate } from "@features/templates-loader";
import { onlySpaces, validEmail } from "@features/utils";
import dataTable, { rowDataToObject } from "@components/datatables";
import { ajax } from "@features/ajax";
import Swal, { showAlert } from "@components/alert";
import { actions } from "@features/configs";

interface sentData {
	module: string;
	action: string;
	recordID: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	zip: string;
}

const templateData = {
	id: "dtDB",
	type: "filter",
	haderRows: [
		[
			{ id: "t1.ID", type: "id", class: "", label: "ID" },
			{ id: "t1.firstName", type: "string", class: "", label: "First Name" },
			{ id: "t1.lastName", type: "string", class: "", label: "Last Name" },
			{ id: "t1.email", type: "string", class: "", label: "Email Address" },
			{ id: "t1.phone", type: "string", class: "", label: "Phone Number" },
			{ id: "t1.zip", type: "string", class: "", label: "Residential Zip Code" },
			{ id: "-1", export: "n", type: "", class: "all", label: "" },
		],
	],
};
const modalContent = compileTemplate("user");
$("body").append(`<js-modal id="modal-new-record" data-record="0">${modalContent()}</js-modal>`);
$("#content").append(compileTemplate("dataTable", templateData));

let dt: any = new dataTable($("#dtDB"), undefined, { module: "user", action: "records" });

console.log(dt.conf.ajax);

dt = dt.initTable();

$(dt.table().body()).on("click", (Event) => {
	if (Event.target.closest("[data-cmd]")) {
		const element: JQuery<HTMLElement> = $(Event.target.closest("[data-cmd]"));
		const rowData: Record<string, string> = rowDataToObject(dt.row(element.closest("tr")).data(), dt);
		const actions: Record<string, () => void> = {
			Eliminar: () => deleteRecord(rowData, dt),
			Modificar: () => getRecord(rowData),
		};
		actions[element.attr("data-cmd") ?? ""]();
	}
});

$(dt.table().container()).find(".js-dt-toolbar__add").attr({ "data-toggle": "modal", "data-target": "#modal-new-record" });

$("#phone,#zip").on("keyup keydown", (Event) => {
	const $element: JQuery<HTMLElement> = $(Event.currentTarget);
	const allowedKeys = /[0-9\/]+/;
	if (<number>$element.val() < 0) $element.val(0);
	if (Event.key === "Backspace" || Event.key === "Delete" || Event.key === "ArrowLeft" || Event.key === "ArrowRight" || Event.key === "Tab") return;
	if (!allowedKeys.test(<string>Event.key)) Event.preventDefault();
});

$("#record-form").on("submit", (e) => {
	e.preventDefault();
	saveRecord(dt);
});

$("#modal-new-record .js-modal__content-header-close-btn").on("click", cleanModal);

async function saveRecord(dbDt: DataTables.Api) {
	let whiteSpace = 0;
	$("#record-form")
		.find(`>.ui-form__body>fieldset>*:is(input[type="text"],input[type="password"],textarea):required`)
		.each((index, element) => {
			if (onlySpaces($(element).val())) whiteSpace++;
		});

	if (!validEmail(<string>$("#email").val())) {
		showAlert("", "error", "The email provided is not a valid email.", { timer: 3000 });
		return;
	}

	if (whiteSpace > 0) {
		showAlert("", "warning", "The form doesn't accept empty fields.", { timer: 3000 });
		return;
	}

	const data: sentData = {
		module: "user",
		action: $("#modal-new-record").attr("data-record") == "0" ? "save" : "update",
		recordID: parseInt($("#modal-new-record").attr("data-record") || ""),
		firstName: <string>$("#firstName").val(),
		lastName: <string>$("#lastName").val(),
		email: <string>$("#email").val(),
		phone: <string>$("#phone").val(),
		zip: <string>$("#zip").val(),
	};

	const [respData, respError] = await ajax(
		{
			beforeSend() {
				showAlert("Saving new record...", "");
			},
		},
		data
	);

	if (respError) return;

	const { status, msg } = respData;

	const temp = await showAlert("", status ? "success" : "error", msg, { timer: 3000 });

	if (status && temp.dismiss === Swal.DismissReason.timer) {
		cleanModal();
		actions.modal.close($("#modal-new-record"));
		dbDt.ajax.reload();
	}
}

async function getRecord(rowData: Record<string, string>) {
	const id = rowData["t1.ID"];

	const [respData, respError] = await ajax(
		{
			beforeSend() {
				showAlert("Retrieving record...", "");
			},
		},
		{ module: "user", action: "getRecord", recordID: id }
	);

	if (respError) return;

	if (!respData.status) {
		showAlert("", "error", `Error while retrieving record: ${respData.msg}`, { timer: 3000 });
		return;
	}

	Swal.close();

	$("#modal-new-record").attr("data-record", id);
	const { firstName, lastName, email, phone, zip } = respData.msg;
	$("#firstName").val(firstName);
	$("#lastName").val(lastName);
	$("#email").val(email);
	$("#phone").val(phone);
	$("#zip").val(zip);

	actions.modal.open($("#modal-new-record"));
}

async function deleteRecord(rowData: Record<string, string>, dt: DataTables.Api) {
	const id = rowData["t1.ID"];
	const confirmation = await showAlert("", "warning", "Are you sure that you want to delete the selected record?", { showConfirmButton: true, showCancelButton: true });

	if (!confirmation.isConfirmed) return;

	const [respData, respError] = await ajax(
		{
			beforeSend() {
				showAlert("Deleating record...", "");
			},
		},
		{ module: "user", action: "delete", recordID: id }
	);

	if (respError) return;

	const temp = await showAlert("", respData.status ? "success" : "error", respData.msg, { timer: 3000 });

	if (temp.dismiss === Swal.DismissReason.timer) dt.ajax.reload();
}

function cleanModal() {
	$("#modal-new-record").attr("data-record", "0");
	$(`#modal-new-record *:is(input[type="text"],input[type="number"],input[type="password"], textarea)`).val("");
}
