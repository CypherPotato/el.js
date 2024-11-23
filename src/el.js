function setAttributeStyles(element, styleObj) {
    Object.assign(element.style, styleObj);
}

function setAttributeClasses(element, classes) {
    var classList;

    if (Array.isArray(classes)) {
        classList = classes;
    } else if (typeof classes === 'string') {
        classList = classes.split(' ');
    } else {
        classList = [];
    }

    for (const cls of classList)
        element.classList.add(cls);
}

function setAttributes(element, attributes) {
    if (!element || !attributes) return;

    attributes.style && setAttributeStyles(element, attributes.style);
    attributes.class && setAttributeClasses(element, attributes.class);

    attributes.id && (element.id = attributes.id);
    attributes.title && (element.title = attributes.title);
    attributes.value && (element.value = attributes.value);
    attributes.type && (element.type = attributes.type);
    attributes.placeholder && (element.placeholder = attributes.placeholder);
    attributes.disabled && (element.disabled = attributes.disabled);
    attributes.readonly && (element.readOnly = attributes.readonly);
    attributes.autofocus && (element.autofocus = attributes.autofocus);
    attributes.autocomplete && (element.autocomplete = attributes.autocomplete);
    attributes.min && (element.min = attributes.min);
    attributes.max && (element.max = attributes.max);
    attributes.minlength && (element.minLength = attributes.minlength);
    attributes.pattern && (element.pattern = attributes.pattern);
    attributes.step && (element.step = attributes.step);
    attributes.multiple && (element.multiple = attributes.multiple);
    attributes.checked && (element.checked = attributes.checked);
    attributes.selected && (element.selected = attributes.selected);
    attributes.required && (element.required = attributes.required);

    attributes.src && (element.src = attributes.src);
    attributes.alt && (element.alt = attributes.alt);
    attributes.href && (element.href = attributes.href);

    attributes.onClick && element.addEventListener('click', attributes.onClick);
    attributes.onChange && element.addEventListener('change', attributes.onChange);
    attributes.onFocus && element.addEventListener('focus', attributes.onFocus);
    attributes.onBlur && element.addEventListener('blur', attributes.onBlur);
    attributes.onInput && element.addEventListener('input', attributes.onInput);
    attributes.onSubmit && element.addEventListener('submit', attributes.onSubmit);

    // Atributos data-*
    Object.keys(attributes).forEach(attr => {
        if (attr.startsWith('data-')) {
            element.setAttribute(attr, attributes[attr]);
        }
    });

    for (const at of Object.entries(attributes)) {
        if (at[0].startsWith('$') && at[1]) {
            element.setAttribute(at[0].substring(1), at[1]);
        }
    }
}

function createElementFromEmmet(emmetString) {
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

function parseEmmetString(emmetString) {
    const result = {
        tagName: "div",
        classList: [],
        id: null,
        attributes: {}
    };

    const tagPattern = /^([a-zA-Z][a-zA-Z0-9]+)/;
    const idPattern = /#([\w\d-]+)/;
    const classPattern = /\.([\w\-_]+)/g;
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
        const value = attrMatch[2] ? attrMatch[2].trim() : key;
        result.attributes[key] = value;
    }

    return result;
}

function findElementIds() {
    return Object.fromEntries([...document.querySelectorAll('[id]')]
        .map(e => [e.id, e]));
}

const el = function () {

    function setArgElement(arg, element) {

        if (arg == null) {
            return;

        } else if (arg instanceof HTMLElement) {
            element.appendChild(arg);

        } else if (arg instanceof NodeList) {
            for (const node of arg) {
                element.appendChild(node);
            }

        } else if (typeof arg === 'string') {
            element.appendChild(document.createTextNode(arg));

        } else if (typeof arg === 'object') {
            setAttributes(element, arg);
        }
    };

    if (arguments.length === 0) {
        console.error('el() requires at least one argument');
        return null;

    } else if (arguments.length === 1) {
        return createElementFromEmmet(arguments[0]);

    } else if (arguments.length === 2) {
        const element = createElementFromEmmet(arguments[0]);
        const arg = arguments[1];

        setArgElement(arg, element);

        return element;

    } else {
        const element = createElementFromEmmet(arguments[0]);

        for (let i = 1; i < arguments.length; i++) {
            const arg = arguments[i];
            setArgElement(arg, element);
        }

        return element;
    }
};

el.raw = function (e) {
    var div = document.createElement('div');
    div.innerHTML = e.trim();
    return div.childNodes;
};

export default el;