export function createState(initialState) {
    var state = initialState;
    var listeners = [];
    
    var result = {};
    Object.defineProperty(result, 'value', {
        get() {
            return state;
        },
        set(newState) {
            state = newState;
            for (const listener of listeners) {
                listener(state);
            }
        }
    });
    result.subscribe = listener => {
        listeners.push(listener);
    };
    
    return result;
}