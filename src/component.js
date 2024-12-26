import { setElementAttributesObj } from "./el";

window.__elCustomComponents = [];

export function defineComponent(tagname, render) {

    if (__elCustomComponents.length == 0) {
        document.addEventListener('DOMContentLoaded', renderComponents);
    }

    __elCustomComponents.push({ tagname: tagname.toUpperCase(), render: render });
}

export function createComponentReplacement(component, element) {
    var elementAttrObj = Object.fromEntries([...element.attributes].map(e => [e.name, e.value]));
    elementAttrObj.slot = element.childNodes;

    const newElement = component.render(elementAttrObj);
    setElementAttributesObj(newElement, elementAttrObj);
    
    // proxy events to new element
    if (element.managedEventList) {
        for (const event of element.managedEventList) {
            newElement.addEventListener(event.eventName, event.listener);
        }
    }
    
    return newElement;
}

export function renderComponents() {
    for (const component of __elCustomComponents) {
        const elements = document.querySelectorAll(component.tagname);

        for (const element of elements) {
            const replacement = createComponentReplacement(component, element);
            element.replaceWith(replacement);
        }
    }
}