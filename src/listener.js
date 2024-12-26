export function addEventListenerStored(element, eventName, listener) {
    element.addEventListener(eventName, listener);
    
    if (!element.managedEventList) element.managedEventList = [];
    
    // add listener to  event tracking list
    element.managedEventList.push({ eventName, listener });
}