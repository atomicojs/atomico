export function container() {
    return document.createElement("div");
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
