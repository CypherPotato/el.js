import { createComponentReplacement, defineComponent, renderComponents } from "./component";
import { createElementFromEmmet } from "./emmet";
import { kebabizeAttributeName } from "./kebabize";
import { addEventListenerStored } from "./listener";

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
        // mouse events
        onClick: value => addEventListenerStored(element, 'click', value),
        onMouseDown: value => addEventListenerStored(element, 'mousedown', value),
        onMouseUp: value => addEventListenerStored(element, 'mouseup', value),
        onMouseEnter: value => addEventListenerStored(element, 'mouseenter', value),
        onMouseLeave: value => addEventListenerStored(element, 'mouseleave', value),
        onMouseMove: value => addEventListenerStored(element, 'mousemove', value),
        onMouseOver: value => addEventListenerStored(element, 'mouseover', value),
        onMouseOut: value => addEventListenerStored(element, 'mouseout', value),
        onWheel: value => addEventListenerStored(element, 'wheel', value),

        // keyboard events
        onKeyUp: value => addEventListenerStored(element, 'keyup', value),
        onKeyDown: value => addEventListenerStored(element, 'keydown', value),
        onKeyPress: value => addEventListenerStored(element, 'keypress', value),
        
        // form events
        onChange: value => addEventListenerStored(element, 'change', value),
        onCancel: value => addEventListenerStored(element, 'cancel', value),
        onInvalid: value => addEventListenerStored(element, 'invalid', value),
        onFocus: value => addEventListenerStored(element, 'focus', value),
        onBlur: value => addEventListenerStored(element, 'blur', value),
        onInput: value => addEventListenerStored(element, 'input', value),
        onSubmit: value => addEventListenerStored(element, 'submit', value),

        // touch events
        onTouchStart: value => addEventListenerStored(element, 'touchstart', value),
        onTouchEnd: value => addEventListenerStored(element, 'touchend', value),
        onTouchMove: value => addEventListenerStored(element, 'touchmove', value),
        onTouchCancel: value => addEventListenerStored(element, 'touchcancel', value),

        // copy-paste events
        onCopy: value => addEventListenerStored(element, 'copy', value),
        onCut: value => addEventListenerStored(element, 'cut', value),
        onPaste: value => addEventListenerStored(element, 'paste', value),

        // drag-drop events
        onDragStart: value => addEventListenerStored(element, 'dragstart', value),
        onDragEnd: value => addEventListenerStored(element, 'dragend', value),
        onDrag: value => addEventListenerStored(element, 'drag', value),
        onDrop: value => addEventListenerStored(element, 'drop', value),
        onDragOver: value => addEventListenerStored(element, 'dragover', value),
        onDragLeave: value => addEventListenerStored(element, 'dragleave', value),

        // pointer events
        onPointerDown: value => addEventListenerStored(element, 'pointerdown', value),
        onPointerUp: value => addEventListenerStored(element, 'pointerup', value),
        onPointerMove: value => addEventListenerStored(element, 'pointermove', value),
        onPointerCancel: value => addEventListenerStored(element, 'pointercancel', value),
        onPointerEnter: value => addEventListenerStored(element, 'pointerenter', value),
        onPointerLeave: value => addEventListenerStored(element, 'pointerleave', value),
        onPointerOver: value => addEventListenerStored(element, 'pointerover', value),
        onPointerOut: value => addEventListenerStored(element, 'pointerout', value),

        // media events
        onCanPlay: value => addEventListenerStored(element, 'canplay', value),
        onCanPlayThrough: value => addEventListenerStored(element, 'canplaythrough', value),
        onDurationChange: value => addEventListenerStored(element, 'durationchange', value),
        onEnded: value => addEventListenerStored(element, 'ended', value),
        onError: value => addEventListenerStored(element, 'error', value),
        onLoadStart: value => addEventListenerStored(element, 'loadstart', value),
        onLoadMetadata: value => addEventListenerStored(element, 'loadmetadata', value),
        onPause: value => addEventListenerStored(element, 'pause', value),
        onPlay: value => addEventListenerStored(element, 'play', value),
        onPlaying: value => addEventListenerStored(element, 'playing', value),
        onProgress: value => addEventListenerStored(element, 'progress', value),
        onRateChange: value => addEventListenerStored(element, 'ratechange', value),
        onSeeked: value => addEventListenerStored(element, 'seeked', value),
        onSeeking: value => addEventListenerStored(element, 'seeking', value),
        onStalled: value => addEventListenerStored(element, 'stalled', value),
        onSuspend: value => addEventListenerStored(element, 'suspend', value),
        onTimeUpdate: value => addEventListenerStored(element, 'timeupdate', value),
        onVolumeChange: value => addEventListenerStored(element, 'volumechange', value),
        onWaiting: value => addEventListenerStored(element, 'waiting', value),

        // generic events
        onLoad: value => addEventListenerStored(element, 'load', value),
        onStart: value => addEventListenerStored(element, 'start', value),
        onEnd: value => addEventListenerStored(element, 'end', value),
        onAbort: value => addEventListenerStored(element, 'abort', value),
        onResize: value => addEventListenerStored(element, 'resize', value),
        onBeforeUnload: value => addEventListenerStored(element, 'beforeunload', value),
        onBeforeCopy: value => addEventListenerStored(element, 'beforecopy', value),
        onBeforeCut: value => addEventListenerStored(element, 'beforecut', value),
        onPlayError: value => addEventListenerStored(element, 'playerror', value),
        onSpeechStart: value => addEventListenerStored(element, 'speechstart', value),
        onSpeechEnd: value => addEventListenerStored(element, 'speechend', value),
        onSpeechError: value => addEventListenerStored(element, 'speecherror', value),
        onMessage: value => addEventListenerStored(element, 'message', value),
        onOffline: value => addEventListenerStored(element, 'offline', value),
        onOnline: value => addEventListenerStored(element, 'online', value),
        onPageHide: value => addEventListenerStored(element, 'pagehide', value),
        onPageShow: value => addEventListenerStored(element, 'pageshow', value),
        onPopState: value => addEventListenerStored(element, 'popstate', value),
        onHashChange: value => addEventListenerStored(element, 'hashchange', value),
        onBeforePrint: value => addEventListenerStored(element, 'beforeprint', value),
        onAfterPrint: value => addEventListenerStored(element, 'afterprint', value),
        onContextMenu: value => addEventListenerStored(element, 'contextmenu', value),
        onFullscreenChange: value => addEventListenerStored(element, 'fullscreenchange', value),
        onFullscreenError: value => addEventListenerStored(element, 'fullscreenerror', value),
        onOpen: value => addEventListenerStored(element, 'open', value),
        onClose: value => addEventListenerStored(element, 'close', value),
        onScroll: value => addEventListenerStored(element, 'scroll', value),

        // canvas events
        onDropZoneChanged: value => addEventListenerStored(element, 'dropzonechanged', value)
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

export default el;