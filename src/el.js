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
    attributes.checked && (element.checked = attributes.checked);
    attributes.selected && (element.selected = attributes.selected);
    attributes.required && (element.required = attributes.required);
    attributes.name && (element.name = attributes.name);
    attributes.multiple && element.setAttribute('multiple', attributes.multiple);
    attributes.for && element.setAttribute('for', attributes.for);

    attributes.src && (element.src = attributes.src);
    attributes.alt && (element.alt = attributes.alt);
    attributes.href && (element.href = attributes.href);

    // Mouse Events
    attributes.onClick && element.addEventListener('click', attributes.onClick);
    attributes.onMouseDown && element.addEventListener('mousedown', attributes.onMouseDown);
    attributes.onMouseUp && element.addEventListener('mouseup', attributes.onMouseUp);
    attributes.onMouseEnter && element.addEventListener('mouseenter', attributes.onMouseEnter);
    attributes.onMouseLeave && element.addEventListener('mouseleave', attributes.onMouseLeave);
    attributes.onMouseMove && element.addEventListener('mousemove', attributes.onMouseMove);
    attributes.onMouseOver && element.addEventListener('mouseover', attributes.onMouseOver);
    attributes.onMouseOut && element.addEventListener('mouseout', attributes.onMouseOut);
    attributes.onWheel && element.addEventListener('wheel', attributes.onWheel);

    // Keyboard Events
    attributes.onKeyUp && element.addEventListener('keyup', attributes.onKeyUp);
    attributes.onKeyDown && element.addEventListener('keydown', attributes.onKeyDown);
    attributes.onKeyPress && element.addEventListener('keypress', attributes.onKeyPress);

    // Form Events
    attributes.onChange && element.addEventListener('change', attributes.onChange);
    attributes.onCancel && element.addEventListener('cancel', attributes.onChange);
    attributes.onInvalid && element.addEventListener('invalid', attributes.onChange);
    attributes.onFocus && element.addEventListener('focus', attributes.onFocus);
    attributes.onBlur && element.addEventListener('blur', attributes.onBlur);
    attributes.onInput && element.addEventListener('input', attributes.onInput);
    attributes.onSubmit && element.addEventListener('submit', attributes.onSubmit);

    // Touch Events
    attributes.onTouchStart && element.addEventListener('touchstart', attributes.onTouchStart);
    attributes.onTouchEnd && element.addEventListener('touchend', attributes.onTouchEnd);
    attributes.onTouchMove && element.addEventListener('touchmove', attributes.onTouchMove);
    attributes.onTouchCancel && element.addEventListener('touchcancel', attributes.onTouchCancel);

    // Clipboard Events
    attributes.onCopy && element.addEventListener('copy', attributes.onCopy);
    attributes.onCut && element.addEventListener('cut', attributes.onCut);
    attributes.onPaste && element.addEventListener('paste', attributes.onPaste);

    // Other Events
    attributes.onScroll && element.addEventListener('scroll', attributes.onScroll);

    // Data-* attributes
    Object.keys(attributes).forEach(attr => {
        if (attr.startsWith('data-')) {
            element.setAttribute(attr, attributes[attr]);
        }
    });

    // Custom attributes
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