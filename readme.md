# el.js

This 10,77 Kb (~4 Kb gzipped) tool is aimed for creating HTML elements. It is a functional alternative to `document.createElement()`.

## Installation

Include the import via CDN in the `<head>` of your HTML:

```html
<script src="https://unpkg.com/@cypherpotato/el/dist/el.min.js"></script>
```

If you are using a package manager, you can install the package with:

```
npm install @cypherpotato/el
```

And use it as:

```js
import el from '@cypherpotato/el';
```

## Usage

```js
el("emmet-literal", ... [children|attributes]) -> HTMLElement
```

The `el()` method is used with one or more arguments. The first argument is always the tag of the HTML element, and the other elements are added as children of the element. If one of the arguments is an object, the `el` function will attempt to assign the object's attributes to the element.

The return of the `el` function is always an `HTMLElement`. No wrapper is created. You can use the return directly to add elements with `document.appendChild`.

Emmet is partially supported. You can use it to create elements with attributes, IDs, or classes. It is not possible to create more than one element with `el`, so do not try to use commas when creating elements. The table below of examples illustrates the use of the `el()` method.

---

Basic usage:

```js
el("div");
// -> <div></div>

el("div.container.fluid");
// -> <div class="container fluid"></div>

el("div#myDiv");
// -> <div id="myDiv"></div>

el("div[foo=bar].mt-3");
// -> <div foo="bar" class="mt-3"></div>
```

---

Event listeners example:

```js
el("div", 
    {
        id: "myDiv",
        class: [ "container", "fluid" ],
        onClick(event) {
            console.log("Clicked on : ", event.target);
        }
    }, 
    "Click me!"
);
```
```html
<div class="container fluid" id="myDiv">
    Click me!
</div>
```

---

Input example:

```js
el("input", 
    {
        type: "text",
        name: "userName",
        placeholder: "Type something..."
    }
);
```
```html
<input type="text" name="userName" placeholder="Type something...">
```

---

Nested childrens:

```js
el(".form-group",
    el("label", { for: "cheese" }, "I want cheese"),
    el("input[type=checkbox]#cheese"));
```
```html
<div class="form-group">
    <label for="cheese">
        I want cheese
    </label>
    <input id="cheese" type="checkbox">
</div>
```

---

Mixed content:

```js
el("custom-tag", "inner text", 123, el("span", "inner span"));
```
```html
<custom-tag>
    inner text
    123
    <span>
        inner span
    </span>
</custom-tag>
```

---

Custom attributes:

```js
el("div", {
    customAttribute: "custom value",
    'data-custom-text': true
});
```
```html
<div custom-attribute="custom value" data-custom-text="data-custom-text">
</div>
```

> Note: attributes written in camelCase are converted to kebab-case in the HTML element.

---

Inline/function components:

```js
const ul = function() { return el('ul', { class: "custom-ul" }, ...arguments); }
const li = function() { return el('li', ...arguments); }

ul(
    li("Apple"),
    li("Limon"),
    li("Banana")
);
```
```html
<ul class="custom-ul">
    <li>Apple</li>
    <li>Limon</li>
    <li>Banana</li>
</ul>
```

---

Custom methods and properties:

```js
const element = el("div", 
    "Hello ",
    el("span", "World!!!"),
    {
        $properties: {
            helloTargetElement: {
                get() {
                    return this.querySelector("span");
                }
            }
        },
        $functions: {
            setHelloTarget(text) {
                this.helloTargetElement.innerText = text;
            }
        }
    }
);

element.helloTargetElement // <span>
element.setHelloTarget("Big World!");
```
---

Special life-cycle methods:

```js
const element = el("div", {
    mount() {
        console.log("Element added to DOM: ", this);
    },
    init() {
        console.log("Element created: ", this);
    }
});
```

---

Function components with arguments:

```js
const Card = function (cardTitle, ...children) {
    return el("div.card",
        el("div.card-header", cardTitle),
        el("div.card-body", ...children));
};

const cardElement = Card("Paris",
    el("p", "Paris is the capital of France."),
    el("img", { src: "https://picsum.photos/200" }),
    el("a", { href: "https://en.wikipedia.org/wiki/Paris" }, "Wikipedia"));
```

```html
<div class="card">
    <div class="card-header">Paris</div>
    <div class="card-body">
        <p>
            Paris is the capital of France.
        </p>
        <img src="https://picsum.photos/200">
        <a href="https://en.wikipedia.org/wiki/Paris">
            Wikipedia
        </a>
    </div>
</div>
```

---

Raw template rendering:

```js
el("div", el.raw(`
    <p>This template will be parsed as HTML</p>
    <button>But it is vulnerable to XSS attacks</button>
`));
```
```html
<div>
    <p>This template will be parsed as HTML</p>
    <button>But it is vulnerable to XSS attacks</button>
</div>
```

---

Unsafe/safe text escaping:

```js
// strings are automatically escaped when used with el()
const unsafeText = "<p>This is secure.</p> <script>alert('XSS')</script>";

// el.raw creates an fragment with the specified unsafe, non-scapped HTML
const unsafeNode = el.raw("<p>This is unsafe.</p> <script>alert('XSS')</script>");

// el.escapeHtmlLiteral escapes the given string, making it safe to use, and returns
// another string
const replacedText = el.escapeHtmlLiteral(unsafeText);

// el.format creates an fragment and automatically escapes the template
// literals
const renderedNode = el.format`
    <div>
        ${unsafeText}
    </div>
`;
```
```html
<div>
    <p>This is unsafe.</p>
    <script>alert('XSS')</script>
</div>
```

---

Creating a text node:

```js
el(".safe-text", 
    el.text("Safe text"),
    el.text("Escaped <text>"));
```

```html
<div class="safe-text">
    Safe text
    Escaped &lt;text&gt;
</div>
```

By default, el() encodes strings instances to text nodes and does not render unsafe HTML. If you want to render unsafe HTML, use el.raw().

## Reactive elements

It is possible to simulate a reactivity effect with the `el.state` properties.

The `el.state.create()` method creates a "state", which is an object that can be observed and, when changed, triggers an update in the interface:

```js
const state = el.state.create("foo"); // "foo" is the initial value
state.subscribe(x => console.log(x));
state.value = "bar"; // "bar" is the new value
```

A state exposes the following methods:
- `subscribe(listener)`: adds a listener to be notified of changes
- `unsubscribe(listener)`: removes a listener
- `clearSubscriptions()`: removes all listeners
- `requestUpdate()`: forces an update with the current value
- `reset()`: resets the state to the initial value

You can create elements that update whenever a state is changed:

```js
function Counter(initialValue = 0) {

    // defines the initial state
    const counterState = el.state.create(initialValue);
    
    // returns an element that listens for changes in any state
    // provided in the list of states
    return el.state.listening([counterState], () =>
        el("div",
            el("button", { onClick() { counterState.value++ } }, "Increment"),
            el("span", "Current value: ", counterState.value)
        )
    );
}

const counter = Counter(10);
document.body.appendChild(counter);
```

The `el.state.listening` method returns the initial callback by default, even without an event being triggered initially. After an update of any state within the provided array, the rendering callback is called again. For this to happen, the callback **always** has to return an `HTMLElement`. It cannot return `null`, fragment, or text node, as these objects will not be able to be tracked for state updates.

The callback returns a new element and replaces the previous one, so do not create circular update references. It is not recommended to use states to capture user input where focus is relevant, such as text inputs and textareas, unless the focus on the element is not relevant if lost.

## Defined components

You can define custom components with `el` and later use them as elements. These components are "swapped" with their original elements, maintaining their scope and placing a new component in their place.

See the example below. It registers a component called `city-card` that receives two attributes: `city-name`, `city-description`. These attributes are defined directly on the element being created.

```html
<body>
    <city-card city-name="Paris" city-description="The capital of France">
        <p>Paris is the capital of France.</p>
        <img src="https://picsum.photos/200" alt="Paris">
        <a href="https://en.wikipedia.org/wiki/Paris">See more on Wikipedia</a>
    </city-card>
</body>
```

Then, we define our component and the action that will generate another element from the original `<city-card>`:

```js
el.defineComponent('city-card', attr =>
    el('.card',
        el('.card-header', attr['city-name']),
        el('.card-description', attr['city-description']),
        el('.card-body', ...attr.slot))); // slot contains the children of the original element
```

And the result, as soon as the page is loaded, all `<city-card>` will be replaced by the components:

```html
<div class="card" city-name="Paris" city-description="The capital of France">
    <div class="card-header">Paris</div>
    <div class="card-description">The capital of France</div>
    <div class="card-body">
        <p>
            Paris is the capital of France.
        </p>
        <img src="https://picsum.photos/200" alt="Paris">
        <a href="https://en.wikipedia.org/wiki/Paris">
            See more on Wikipedia
        </a>
    </div>
</div>
```

All attributes of the original element are preserved in the subsequently created element. Therefore, you will be able to reuse the ID, classes, styles, etc.

Components defined with `el.defineComponent` are only replaced in three situations:

- When the page is loaded for the first time on `document.DOMContentLoaded`.
- When you try to create a component with `el()`.
- When you call `el.scanComponents()`, which replaces all components defined on the page.

These elements can also have state, but they are not natively "reactive." The example below illustrates a counter:

```js
el.defineComponent('counter', function (attr) {
    var count = attr.start ?? 0;
    var textElement = el('p', getCurrentText());

    function getCurrentText() {
        return `Current count: ${count}`;
    }

    function increment() {
        count++;
        textElement.innerText = getCurrentText();
    }

    function decrement() {
        count--;
        textElement.innerText = getCurrentText();
    }

    return el('.counter',
        el('button', { onClick: increment }, 'Increment'),
        el('button', { onClick: decrement }, 'Decrement'),
        textElement);
});

const myCounter = el('counter', { start: 10 });
document.body.appendChild(myCounter);
```

In the code above, you will have a counter that updates whenever a button is pressed.

There may be cases where some components are not replaced. This can happen if the component was created outside the `el()` function or after the page has loaded. If you have another library that also creates elements on the page, you can create a `MutationObserver` to observe all new elements and replace them if necessary.

```js
function observeComponents() {
    const callback = (mutationList, _) => {
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                el.scanComponents();
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
}

observeComponents();
```

In the code above, `observeComponents()` will observe whenever a new element is created or removed from the DOM, and when that happens, it will call `el.scanComponents()`, which will replace all components defined with `el.defineComponent()`.

These components should not be confused with Web Components (custom elements) or reactive components like those in React. Instead, `el.defineComponent` is a helper that replaces native elements with other native elements.