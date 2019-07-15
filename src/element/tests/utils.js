function randomName() {
	let string = btoa(Math.random())
			.toLowerCase()
			.replace(/[^a-z]+/g, ""),
		length = string.length / 2;
	return string.slice(0, length) + "-" + string.slice(length);
}

export function hashCustomElement(CustomElement) {
	let name = randomName();
	customElements.define(name, CustomElement);
	return (attributes, children) => {
		let div = document.createElement("div");
		div.innerHTML = `<${name} ${attributes || ""}>${children ||
			""}</${name}>`;
		document.body.appendChild(div);
		return div.firstChild;
	};
}
