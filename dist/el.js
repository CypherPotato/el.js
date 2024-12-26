(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/component.js
  window.__elCustomComponents = [];
  function defineComponent(tagname, render) {
    if (__elCustomComponents.length == 0) {
      document.addEventListener("DOMContentLoaded", renderComponents);
    }
    __elCustomComponents.push({ tagname: tagname.toUpperCase(), render });
  }
  function createComponentReplacement(component, element) {
    var elementAttrObj = Object.fromEntries([...element.attributes].map((e) => [e.name, e.value]));
    elementAttrObj.slot = element.childNodes;
    const newElement = component.render(elementAttrObj);
    setElementAttributesObj(newElement, elementAttrObj);
    if (element.managedEventList) {
      for (const event of element.managedEventList) {
        newElement.addEventListener(event.eventName, event.listener);
      }
    }
    return newElement;
  }
  function renderComponents() {
    for (const component of __elCustomComponents) {
      const elements = document.querySelectorAll(component.tagname);
      for (const element of elements) {
        const replacement = createComponentReplacement(component, element);
        element.replaceWith(replacement);
      }
    }
  }

  // src/emmet.js
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
    const idMatch = emmetString.match(idPattern);
    if (idMatch) {
      result.id = idMatch[1];
    }
    let classMatch;
    while ((classMatch = classPattern.exec(emmetString)) !== null) {
      result.classList.push(classMatch[1]);
    }
    let attrMatch;
    while ((attrMatch = attrPattern.exec(emmetString)) !== null) {
      const key = attrMatch[1].trim();
      const value = attrMatch[2] ? attrMatch[2].trim().replace(/^['"]|['"]$/g, "") : key;
      result.attributes[key] = value;
    }
    return result;
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

  // src/kebabize.js
  var kebabizeCore = (str) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase());
  function kebabizeAttributeName(s) {
    if (/[A-Z]/.test(s) && !s.includes("-")) {
      return kebabizeCore(s);
    }
    return s;
  }

  // src/listener.js
  function addEventListenerStored(element, eventName, listener) {
    element.addEventListener(eventName, listener);
    if (!element.managedEventList) element.managedEventList = [];
    element.managedEventList.push({ eventName, listener });
  }

  // src/declarative.js
  var declarative_exports = {};
  __export(declarative_exports, {
    a: () => a,
    area: () => area,
    article: () => article,
    aside: () => aside,
    audio: () => audio,
    blockquote: () => blockquote,
    button: () => button,
    canvas: () => canvas,
    cite: () => cite,
    col: () => col,
    colgroup: () => colgroup,
    details: () => details,
    dialog: () => dialog,
    div: () => div,
    figcaption: () => figcaption,
    figure: () => figure,
    footer: () => footer,
    form: () => form,
    h1: () => h1,
    h2: () => h2,
    h3: () => h3,
    h4: () => h4,
    h5: () => h5,
    h6: () => h6,
    header: () => header,
    hr: () => hr,
    iframe: () => iframe,
    img: () => img,
    input: () => input,
    keygen: () => keygen,
    label: () => label,
    li: () => li,
    main: () => main,
    mark: () => mark,
    meta: () => meta,
    meter: () => meter,
    nav: () => nav,
    ol: () => ol,
    option: () => option,
    p: () => p,
    param: () => param,
    progress: () => progress,
    script: () => script,
    section: () => section,
    select: () => select,
    source: () => source,
    span: () => span,
    summary: () => summary,
    svg: () => svg,
    table: () => table,
    td: () => td,
    template: () => template,
    textarea: () => textarea,
    th: () => th,
    time: () => time,
    title: () => title,
    tr: () => tr,
    track: () => track,
    ul: () => ul,
    video: () => video
  });
  function div() {
    return el_default("div", ...arguments);
  }
  function span() {
    return el_default("span", ...arguments);
  }
  function a() {
    return el_default("a", ...arguments);
  }
  function p() {
    return el_default("p", ...arguments);
  }
  function h1() {
    return el_default("h1", ...arguments);
  }
  function h2() {
    return el_default("h2", ...arguments);
  }
  function h3() {
    return el_default("h3", ...arguments);
  }
  function h4() {
    return el_default("h4", ...arguments);
  }
  function h5() {
    return el_default("h5", ...arguments);
  }
  function h6() {
    return el_default("h6", ...arguments);
  }
  function ul() {
    return el_default("ul", ...arguments);
  }
  function ol() {
    return el_default("ol", ...arguments);
  }
  function li() {
    return el_default("li", ...arguments);
  }
  function img() {
    return el_default("img", ...arguments);
  }
  function table() {
    return el_default("table", ...arguments);
  }
  function tr() {
    return el_default("tr", ...arguments);
  }
  function td() {
    return el_default("td", ...arguments);
  }
  function th() {
    return el_default("th", ...arguments);
  }
  function form() {
    return el_default("form", ...arguments);
  }
  function input() {
    return el_default("input", ...arguments);
  }
  function button() {
    return el_default("button", ...arguments);
  }
  function label() {
    return el_default("label", ...arguments);
  }
  function textarea() {
    return el_default("textarea", ...arguments);
  }
  function select() {
    return el_default("select", ...arguments);
  }
  function option() {
    return el_default("option", ...arguments);
  }
  function header() {
    return el_default("header", ...arguments);
  }
  function footer() {
    return el_default("footer", ...arguments);
  }
  function section() {
    return el_default("section", ...arguments);
  }
  function article() {
    return el_default("article", ...arguments);
  }
  function aside() {
    return el_default("aside", ...arguments);
  }
  function nav() {
    return el_default("nav", ...arguments);
  }
  function main() {
    return el_default("main", ...arguments);
  }
  function figure() {
    return el_default("figure", ...arguments);
  }
  function figcaption() {
    return el_default("figcaption", ...arguments);
  }
  function video() {
    return el_default("video", ...arguments);
  }
  function svg() {
    return el_default("svg", ...arguments);
  }
  function iframe() {
    return el_default("iframe", ...arguments);
  }
  function blockquote() {
    return el_default("blockquote", ...arguments);
  }
  function cite() {
    return el_default("cite", ...arguments);
  }
  function time() {
    return el_default("time", ...arguments);
  }
  function mark() {
    return el_default("mark", ...arguments);
  }
  function progress() {
    return el_default("progress", ...arguments);
  }
  function meter() {
    return el_default("meter", ...arguments);
  }
  function details() {
    return el_default("details", ...arguments);
  }
  function summary() {
    return el_default("summary", ...arguments);
  }
  function dialog() {
    return el_default("dialog", ...arguments);
  }
  function template() {
    return el_default("template", ...arguments);
  }
  function script() {
    return el_default("script", ...arguments);
  }
  function meta() {
    return el_default("meta", ...arguments);
  }
  function title() {
    return el_default("title", ...arguments);
  }
  function area() {
    return el_default("area", ...arguments);
  }
  function audio() {
    return el_default("audio", ...arguments);
  }
  function canvas() {
    return el_default("canvas", ...arguments);
  }
  function col() {
    return el_default("col", ...arguments);
  }
  function colgroup() {
    return el_default("colgroup", ...arguments);
  }
  function hr() {
    return el_default("hr", ...arguments);
  }
  function keygen() {
    return el_default("keygen", ...arguments);
  }
  function param() {
    return el_default("param", ...arguments);
  }
  function source() {
    return el_default("source", ...arguments);
  }
  function track() {
    return el_default("track", ...arguments);
  }

  // src/el.js
  function setAttributeStyles(element, styleObj) {
    if (typeof styleObj === "string") {
      element.style.cssText = styleObj;
    } else {
      Object.assign(element.style, styleObj);
    }
  }
  function setAttributeClasses(element, classes) {
    var classList;
    if (Array.isArray(classes)) {
      classList = classes.filter((n) => n != false && n != null);
    } else if (typeof classes === "string") {
      classList = classes.split(" ");
    } else {
      classList = [];
    }
    for (const cls of classList)
      element.classList.add(cls);
  }
  function setElementAttributesObj(element, attributes) {
    if (!element || !attributes) return;
    const handledMap = {
      style: (value) => setAttributeStyles(element, value),
      class: (value) => setAttributeClasses(element, value),
      classList: (value) => setAttributeClasses(element, value)
    };
    const attributeMap = {
      id: (value) => element.id = value,
      title: (value) => element.title = value,
      value: (value) => element.value = value,
      type: (value) => element.type = value,
      placeholder: (value) => element.placeholder = value,
      disabled: (value) => element.disabled = value,
      readonly: (value) => element.readOnly = value,
      autofocus: (value) => element.autofocus = value,
      autocomplete: (value) => element.autocomplete = value,
      min: (value) => element.min = value,
      max: (value) => element.max = value,
      minlength: (value) => element.minLength = value,
      pattern: (value) => element.pattern = value,
      step: (value) => element.step = value,
      checked: (value) => element.checked = value,
      selected: (value) => element.selected = value,
      required: (value) => element.required = value,
      name: (value) => element.name = value,
      multiple: (value) => element.setAttribute("multiple", value),
      for: (value) => element.setAttribute("for", value),
      src: (value) => element.src = value,
      alt: (value) => element.alt = value,
      href: (value) => element.href = value
    };
    const eventMap = {
      onClick: (value) => addEventListenerStored(element, "click", value),
      onMouseDown: (value) => addEventListenerStored(element, "mousedown", value),
      onMouseUp: (value) => addEventListenerStored(element, "mouseup", value),
      onMouseEnter: (value) => addEventListenerStored(element, "mouseenter", value),
      onMouseLeave: (value) => addEventListenerStored(element, "mouseleave", value),
      onMouseMove: (value) => addEventListenerStored(element, "mousemove", value),
      onMouseOver: (value) => addEventListenerStored(element, "mouseover", value),
      onMouseOut: (value) => addEventListenerStored(element, "mouseout", value),
      onWheel: (value) => addEventListenerStored(element, "wheel", value),
      onKeyUp: (value) => addEventListenerStored(element, "keyup", value),
      onKeyDown: (value) => addEventListenerStored(element, "keydown", value),
      onKeyPress: (value) => addEventListenerStored(element, "keypress", value),
      onChange: (value) => addEventListenerStored(element, "change", value),
      onCancel: (value) => addEventListenerStored(element, "cancel", value),
      onInvalid: (value) => addEventListenerStored(element, "invalid", value),
      onFocus: (value) => addEventListenerStored(element, "focus", value),
      onBlur: (value) => addEventListenerStored(element, "blur", value),
      onInput: (value) => addEventListenerStored(element, "input", value),
      onSubmit: (value) => addEventListenerStored(element, "submit", value),
      onTouchStart: (value) => addEventListenerStored(element, "touchstart", value),
      onTouchEnd: (value) => addEventListenerStored(element, "touchend", value),
      onTouchMove: (value) => addEventListenerStored(element, "touchmove", value),
      onTouchCancel: (value) => addEventListenerStored(element, "touchcancel", value),
      onCopy: (value) => addEventListenerStored(element, "copy", value),
      onCut: (value) => addEventListenerStored(element, "cut", value),
      onPaste: (value) => addEventListenerStored(element, "paste", value),
      onScroll: (value) => addEventListenerStored(element, "scroll", value)
    };
    for (const attr of Object.entries(attributes)) {
      const name = attr[0];
      const value = attr[1];
      const kebabized = kebabizeAttributeName(name);
      if (value === false || value == null) {
        continue;
      } else if (name == "slot" && value instanceof NodeList) {
        continue;
      } else if (handledMap[name]) {
        handledMap[name](value);
      } else if (attributeMap[name]) {
        attributeMap[name](value);
        element.setAttribute(kebabized, value);
      } else if (eventMap[name]) {
        console.log("adding event listener", element, name, value);
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
    function setArgFragment(arg, fragment2) {
      const argType = typeof arg;
      if (arg == null || arg === false) {
        return;
      } else if (arg instanceof Node) {
        fragment2.appendChild(arg);
      } else if (argType === "string" || argType === "number") {
        fragment2.appendChild(document.createTextNode(arg));
      } else if (typeof arg[Symbol.iterator] === "function") {
        for (const item of arg)
          setArgFragment(item, fragment2);
      } else {
        console.warn("el.js: given an unknown argument type for el.fragment() constructor for arg: ", arg);
      }
    }
    ;
    for (const arg of arguments) {
      setArgFragment(arg, fragment);
    }
    return fragment;
  }
  var el = function() {
    function setArgElement(arg, element) {
      const argType = typeof arg;
      if (arg == null || arg === false) {
        return;
      } else if (arg instanceof Node) {
        element.appendChild(arg);
      } else if (argType === "string" || argType === "number") {
        element.appendChild(document.createTextNode(arg));
      } else if (typeof arg[Symbol.iterator] === "function") {
        for (const item of arg)
          setArgElement(item, element);
      } else if (argType === "object") {
        setElementAttributesObj(element, arg);
      } else {
        console.warn("el.js: given an unknown argument type for el() constructor for element " + element.tagName + ": " + typeof arg);
      }
    }
    ;
    var result;
    if (arguments.length === 0) {
      console.error("el.js: el() requires at least one argument");
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
  el.raw = function(e) {
    var div2 = document.createElement("div");
    div2.innerHTML = e.trim();
    return div2.childNodes;
  };
  el.text = function() {
    const text = [...arguments].join("");
    return document.createTextNode(text);
  };
  el.fragment = createFragment;
  el.defineComponent = defineComponent;
  el.scanComponents = renderComponents;
  el.elstore = declarative_exports;
  el.elstore.applyInto = function(obj) {
    Object.assign(obj, declarative_exports);
  };
  var el_default = el;

  // main.js
  window.el = el_default;
})();
