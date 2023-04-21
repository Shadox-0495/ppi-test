import AirDatepicker from "air-datepicker";
import { confDatePicker } from "@features/configs";

export function datePicker(htmlElement: any, args = {}) {
	const conf = confDatePicker(args);
	if (htmlElement.length) {
		htmlElement.forEach((node: HTMLElement) => new AirDatepicker(node, conf));
		return;
	}
	return new AirDatepicker(htmlElement, conf);
}
