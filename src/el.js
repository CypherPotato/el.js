import { createComponentReplacement, defineComponent, renderComponents } from "./component";
import { createElementFromEmmet } from "./emmet";
import { kebabizeAttributeName } from "./kebabize";
import { addEventListenerStored } from "./listener";
import * as declarativeBag from "./declarative";

function setAttributeStyles(element, styleObj) {
    if (typeof styleObj === 'string') {
        element.style.cssText = styleObj;
    } else {
        Object.assign(element.style, styleObj);
    }
}

function setAttributeClasses(element, classes) {
    var classList;

    if (Array.isArray(classes)) {
        classList = classes.filter(n => n != false && n != null);

    } else if (typeof classes === 'string') {
        classList = classes.split(' ');

    } else {
        classList = [];
    }

    for (const cls of classList)
        element.classList.add(cls);
}

export function setElementAttributesObj(element, attributes) {
    if (!element || !attributes) return;

    const handledMap = {
        style: value => setAttributeStyles(element, value),
        class: value => setAttributeClasses(element, value),
        classList: value => setAttributeClasses(element, value),
    };
    
    const attributeMap = {
        id: value => element.id = value,
        title: value => element.title = value,
        value: value => element.value = value,
        type: value => element.type = value,
        placeholder: value => element.placeholder = value,
        disabled: value => element.disabled = value,
        readonly: value => element.readOnly = value,
        autofocus: value => element.autofocus = value,
        autocomplete: value => element.autocomplete = value,
        min: value => element.min = value,
        max: value => element.max = value,
        minlength: value => element.minLength = value,
        pattern: value => element.pattern = value,
        step: value => element.step = value,
        checked: value => element.checked = value,
        selected: value => element.selected = value,
        required: value => element.required = value,
        name: value => element.name = value,
        multiple: value => element.setAttribute('multiple', value),
        for: value => element.setAttribute('for', value),

        src: value => element.src = value,
        alt: value => element.alt = value,
        href: value => element.href = value
    };

    const eventMap = {
        onClick: value => addEventListenerStored(element, 'click', value),
        onMouseDown: value => addEventListenerStored(element, 'mousedown', value),
        onMouseUp: value => addEventListenerStored(element, 'mouseup', value),
        onMouseEnter: value => addEventListenerStored(element, 'mouseenter', value),
        onMouseLeave: value => addEventListenerStored(element, 'mouseleave', value),
        onMouseMove: value => addEventListenerStored(element, 'mousemove', value),
        onMouseOver: value => addEventListenerStored(element, 'mouseover', value),
        onMouseOut: value => addEventListenerStored(element, 'mouseout', value),
        onWheel: value => addEventListenerStored(element, 'wheel', value),

        onKeyUp: value => addEventListenerStored(element, 'keyup', value),
        onKeyDown: value => addEventListenerStored(element, 'keydown', value),
        onKeyPress: value => addEventListenerStored(element, 'keypress', value),

        onChange: value => addEventListenerStored(element, 'change', value),
        onCancel: value => addEventListenerStored(element, 'cancel', value),
        onInvalid: value => addEventListenerStored(element, 'invalid', value),
        onFocus: value => addEventListenerStored(element, 'focus', value),
        onBlur: value => addEventListenerStored(element, 'blur', value),
        onInput: value => addEventListenerStored(element, 'input', value),
        onSubmit: value => addEventListenerStored(element, 'submit', value),

        onTouchStart: value => addEventListenerStored(element, 'touchstart', value),
        onTouchEnd: value => addEventListenerStored(element, 'touchend', value),
        onTouchMove: value => addEventListenerStored(element, 'touchmove', value),
        onTouchCancel: value => addEventListenerStored(element, 'touchcancel', value),

        onCopy: value => addEventListenerStored(element, 'copy', value),
        onCut: value => addEventListenerStored(element, 'cut', value),
        onPaste: value => addEventListenerStored(element, 'paste', value),

        onScroll: value => addEventListenerStored(element, 'scroll', value)
    };

    for (const attr of Object.entries(attributes)) {
        const name = attr[0];
        const value = attr[1];

        const kebabized = kebabizeAttributeName(name);

        if (value === false || value == null) {
            continue;

        } else if (name == 'slot' && value instanceof NodeList) {
            continue;

        } else if (handledMap[name]) {
            handledMap[name](value);

        } else if (attributeMap[name]) {
            attributeMap[name](value);

            // also set the attribute directly as a fallback
            element.setAttribute(kebabized, value);

        } else if (eventMap[name]) {
            eventMap[name](value);

        } else {
            if (value === true) {
                element.setAttribute(kebabized, kebabized);
            } else {
                element.setAttribute(kebabized, value);
            }
        }
    }
}

function createFragment() {
    const fragment = document.createDocumentFragment();

    function setArgFragment(arg, fragment) {

        const argType = typeof arg;

        // skip false, null
        if (arg == null || arg === false) {
            return;

            // node, HTMLElement
        } else if (arg instanceof Node) {
            fragment.appendChild(arg);

            // strings
        } else if (argType === 'string' || argType === 'number') {
            fragment.appendChild(document.createTextNode(arg));

            // arrays, NodeList, iterables
        } else if (typeof arg[Symbol.iterator] === 'function') {
            for (const item of arg)
                setArgFragment(item, fragment);

        } else {
            console.warn('el.js: given an unknown argument type for el.fragment() constructor for arg: ', arg);
        }
    };

    for (const arg of arguments) {
        setArgFragment(arg, fragment);
    }

    return fragment;
}

const el = function () {

    function setArgElement(arg, element) {

        const argType = typeof arg;

        // skip false, null
        if (arg == null || arg === false) {
            return;

            // node, HTMLElement
        } else if (arg instanceof Node) {
            element.appendChild(arg);

            // strings
        } else if (argType === 'string' || argType === 'number') {
            element.appendChild(document.createTextNode(arg));

            // arrays, NodeList, iterables
        } else if (typeof arg[Symbol.iterator] === 'function') {
            for (const item of arg)
                setArgElement(item, element);

            // object (attributes)
        } else if (argType === 'object') {
            setElementAttributesObj(element, arg);

        } else {
            console.warn('el.js: given an unknown argument type for el() constructor for element ' + element.tagName + ': ' + typeof arg);
        }
    };

    var result;
    if (arguments.length === 0) {
        console.error('el.js: el() requires at least one argument');
        result = null;

    } else if (arguments.length === 1) {
        result = createElementFromEmmet(arguments[0]);

    } else {
        const element = createElementFromEmmet(arguments[0]);

        for (let i = 1; i < arguments.length; i++) {
            const arg = arguments[i];
            setArgElement(arg, element);
        }

        result = element;
    }

    if (window.__elCustomComponents) {
        for (const component of window.__elCustomComponents) {
            if (component.tagname == result.tagName) {
                result = createComponentReplacement(component, result);
            }
        }
    }

    return result;
};

el.raw = function (e) {
    var div = document.createElement('div');
    div.innerHTML = e.trim();
    return div.childNodes;
};

el.text = function () {
    const text = [...arguments].join('');
    return document.createTextNode(text);
};

el.fragment = createFragment;
el.defineComponent = defineComponent;
el.scanComponents = renderComponents;

el.elstore = declarativeBag;
el.elstore.applyInto = function (obj) {
    Object.assign(obj, declarativeBag);
};

export default el;