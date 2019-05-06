export function container() {
	return document.createElement("div");
}

export function loading(callback) {
	setTimeout(callback, 1000 / 60);
}

export function createList(length = 10) {
	let list = [];
	for (let key = 0; key < length; key++) {
		list.push({ key: String(key) });
	}
	return list;
}

export function randomList(list) {
	list = [].concat(list);

	let currentIndex = list.length,
		temporaryValue,
		randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = list[currentIndex];
		list[currentIndex] = list[randomIndex];
		list[randomIndex] = temporaryValue;
	}

	return list;
}

export function randomInsert(list, length = 100) {
	for (let i = 0; i < length; i++) {
		let insertIn = Math.floor(Math.random() * list.length);

		let before = list.slice(0, insertIn),
			after = list.slice(insertIn),
			key = insertIn + "." + i;

		list = before.concat({ key }, after);
	}
	return list;
}

export function renderToString({ tag, props }, isSvg, deep = 0) {
	isSvg = tag === "svg" || isSvg;

	let element = isSvg
		? document.createElementNS("http://www.w3.org/2000/svg", tag)
		: document.createElement(tag);

	for (let index in props) {
		let value = props[index];
		let type = typeof value;
		if (type === "string" || type === "number") {
			switch (index) {
				case "children":
					[].concat(children ? children : []).forEach(vnode => {
						let type = typeof vnode,
							child;
						if (type === "object") {
							child = renderToString(vnode, isSvg, deep + 1);
						} else {
							child = document.createTextNode(
								type === "string" || type === "number" ? vnode : ""
							);
						}
						element.appendChild(child);
					});
					break;
				case "key":
					index = "data-key";
					break;
				case "className":
					index = "class";
					break;
			}
			if (isSvg) {
				element.setAttributeNS(null, index, value);
			} else {
				element.setAttribute(index, value);
			}
		}
	}

	return !deep ? element.outerHTML : element;
}
