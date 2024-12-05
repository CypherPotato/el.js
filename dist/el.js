(() => {
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
    const attributeMap = {
      style: (value) => setAttributeStyles(element, value),
      class: (value) => setAttributeClasses(element, value),
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
      href: (value) => element.href = value,
      onClick: (value) => element.addEventListener("click", value),
      onMouseDown: (value) => element.addEventListener("mousedown", value),
      onMouseUp: (value) => element.addEventListener("mouseup", value),
      onMouseEnter: (value) => element.addEventListener("mouseenter", value),
      onMouseLeave: (value) => element.addEventListener("mouseleave", value),
      onMouseMove: (value) => element.addEventListener("mousemove", value),
      onMouseOver: (value) => element.addEventListener("mouseover", value),
      onMouseOut: (value) => element.addEventListener("mouseout", value),
      onWheel: (value) => element.addEventListener("wheel", value),
      onKeyUp: (value) => element.addEventListener("keyup", value),
      onKeyDown: (value) => element.addEventListener("keydown", value),
      onKeyPress: (value) => element.addEventListener("keypress", value),
      onChange: (value) => element.addEventListener("change", value),
      onCancel: (value) => element.addEventListener("cancel", value),
      onInvalid: (value) => element.addEventListener("invalid", value),
      onFocus: (value) => element.addEventListener("focus", value),
      onBlur: (value) => element.addEventListener("blur", value),
      onInput: (value) => element.addEventListener("input", value),
      onSubmit: (value) => element.addEventListener("submit", value),
      onTouchStart: (value) => element.addEventListener("touchstart", value),
      onTouchEnd: (value) => element.addEventListener("touchend", value),
      onTouchMove: (value) => element.addEventListener("touchmove", value),
      onTouchCancel: (value) => element.addEventListener("touchcancel", value),
      onCopy: (value) => element.addEventListener("copy", value),
      onCut: (value) => element.addEventListener("cut", value),
      onPaste: (value) => element.addEventListener("paste", value),
      onScroll: (value) => element.addEventListener("scroll", value)
    };
    for (const attr of Object.entries(attributes)) {
      const name = attr[0];
      const value = attr[1];
      if (value === false || value == null) {
        continue;
      } else if (name == "slot" && value instanceof NodeList) {
        continue;
      } else if (attributeMap[name]) {
        attributeMap[name](value);
      } else {
        if (value === true) {
          element.setAttribute(name, name);
        } else {
          element.setAttribute(name, value);
        }
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
  function createFragment() {
    const fragment = document.createDocumentFragment();
    for (const arg of arguments) {
      const argType = typeof arg;
      if (arg == null) {
        continue;
      } else if (arg instanceof Node) {
        fragment.appendChild(arg);
      } else if (argType === "string" || argType === "number") {
        fragment.appendChild(document.createTextNode(arg));
      } else if (argType[Symbol.iterator] === "function") {
        for (const item of arg)
          fragment.appendChild(item);
      } else {
        console.warn("el.js: given an unknown argument type for el.fragment() constructor for fragment: " + argType);
      }
    }
    return fragment;
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
  var el = function() {
    function setArgElement(arg, element) {
      const argType = typeof arg;
      if (arg == null || arg === false) {
        return;
      } else if (arg instanceof Node) {
        element.appendChild(arg);
      } else if (argType === "string" || argType === "number") {
        element.appendChild(document.createTextNode(arg));
      } else if (argType[Symbol.iterator] === "function") {
        for (const item of arg)
          element.appendChild(item);
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
    var div = document.createElement("div");
    div.innerHTML = e.trim();
    return div.childNodes;
  };
  el.text = function() {
    const text = [...arguments].join("");
    return document.createTextNode(text);
  };
  el.fragment = createFragment;
  el.defineComponent = defineComponent;
  el.scanComponents = renderComponents;
  var el_default = el;

  // main.js
  window.el = el_default;
})();
