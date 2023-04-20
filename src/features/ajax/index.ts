import { mergeObjects } from "@features/utils";
import { apiUrl } from "@features/configs";
import { showAlert } from "@components/alert";

export async function ajax(ajaxArgs: JQueryAjaxSettings = {}, data: any = {}, type = "POST", url: string = apiUrl) {
	let obj: any = {
		type,
		url,
		dataType: "json",
		timeout: 15000,
	};
	obj = mergeObjects(obj, ajaxArgs);
	if (Object.keys(data).length !== 0) obj.data = JSON.stringify(data);

	try {
		const resp = await $.ajax(obj);
		return [resp, null];
	} catch (e: any) {
		const msg: Record<number, string> = {
			0: `<ul>
					<li>Servidor caido</li>
					<li>Servidor inaccessible</li>
					<li>Solicitud bloqueada</li>
				</ul>`,
		};
		showAlert("Ajax request error", "error", `Codigo: ${e.status}<br><br>${msg[e.status] ?? e.responseText}`, { timer: 3000 });
		return [null, e];
	}
}
