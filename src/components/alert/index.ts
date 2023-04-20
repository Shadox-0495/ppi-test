import { confSweetAlert } from "@features/configs";
import { mergeObjects } from "@features/utils";
import Swal from "sweetalert2";

export default Swal;

export function showAlert(title = "", icon = "info", html = `<div class="js-loading-spinner" data-type="full-space" data-container="sweetalert"></div>`, args = {}) {
	const conf = mergeObjects(args, { title, icon, html });
	return Swal.fire(confSweetAlert(conf));
}
