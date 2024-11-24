# el.js

This 2.6 Kb (1.4 Kb gzipped) tool is a library for creating HTML elements with maximum ease. It is a functional alternative to `document.createElement()`.

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

```
import el from '@cypherpotato/el';
```

## Usage

```js
el("tag-name", ... children|attributes);
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
el("div", {
    id: "myDiv",
    class: [ "container", "fluid" ],
    onClick: function(event) {
            console.log("Clicked on the div!");
        }
    }, "Click me!");
```
```html
<div class="container fluid" id="myDiv">
    Click me!
</div>
```

---

Input example:

```js
el("input", {
    type: "text",
    name: "userName",
    placeholder: "Type something..."});
```
```html
<input type="text" name="userName" placeholder="Type something...">
```

---

Nested childrens:

```js
el(".form-group",
    el("label", { for: "cheese" }),
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
el("custom-tag", "inner text", el("span", "inner span"));
```
```html
<custom-tag>
    inner text
    <span>
        inner span
    </span>
</custom-tag>
```

---

Custom attributes:

```js
el("div", {
    $customAttribute: "custom value",
    '$data-custom-text': true});
```
```html
<div customattribute="custom value" data-custom-text="true">
</div>
```

---

Custom components:

```js
const ul = function() { return el('ul', { class: "custom-ul" }, ...arguments); }
const li = function() { return el('li', ...arguments); }

ul(
    li("Apple"),
    li("Limon"),
    li("Banana"));
```
```html
<ul class="custom-ul">
    <li>Apple</li>
    <li>Limon</li>
    <li>Banana</li>
</ul>
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
const safeText = "<p>This is secure.</p> <script>alert('XSS')</script>";
const unsafeText = el.raw("<p>This is unsafe.</p> <script>alert('XSS')</script>");

el(".safe-text", safeText);
el(".unsafe-text", unsafeText);
```
```html
<div class="safe-text">
    &lt;p&gt;This is secure.&lt;/p&gt; &lt;script&gt;alert('XSS')&lt;/script&gt;
</div>
<div class="unsafe-text">
    <p>This is unsafe.</p><script>alert('XSS')</script>
</div>
```