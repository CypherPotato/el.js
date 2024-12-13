function parseEmmetString(emmetString) {
    const result = {
        tagName: "div",
        classList: [],
        id: null,
        attributes: {}
    };

    const tagPattern = /^([a-zA-Z][\w-]*)/;
    const idPattern = /#([\w-]+)/;
    const classPattern = /\.([\w-]+)/g;
    const attrPattern = /\[([^\]=]+)(?:=([^\]]+))?\]/g;

    const tagMatch = emmetString.match(tagPattern);
    if (tagMatch) {
        result.tagName = tagMatch[1];
    }

    // Extract ID
    const idMatch = emmetString.match(idPattern);
    if (idMatch) {
        result.id = idMatch[1];
    }

    // Extract class names
    let classMatch;
    while ((classMatch = classPattern.exec(emmetString)) !== null) {
        result.classList.push(classMatch[1]);
    }

    // Extract attributes
    let attrMatch;
    while ((attrMatch = attrPattern.exec(emmetString)) !== null) {
        const key = attrMatch[1].trim();
        const value = attrMatch[2] ? attrMatch[2].trim().replace(/^['"]|['"]$/g, '') : key;
        result.attributes[key] = value;
    }
    
    return result;
}

export function createElementFromEmmet(emmetString) {
    const parsed = parseEmmetString(emmetString);
    
    var doc = document.createElement(parsed.tagName);
    if (parsed.id)
        doc.id = parsed.id;

    for (const className of parsed.classList)
        doc.classList.add(className);
    
    for (const [key, value] of Object.entries(parsed.attributes))
        doc.setAttribute(key, value);

    return doc;
}