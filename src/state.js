const poolingStateSet = [];

export function clearAllPoolingStates() {
    for (const intervalId of poolingStateSet) {
        clearInterval(intervalId);
    }
    poolingStateSet.length = 0;
}

export function poolingState(func, poolOptions) {
    const innerState = createState(null);
    innerState.value = func(innerState);

    const poolInterval = poolOptions?.interval || 500;

    const intervalId = setInterval(async () => {
        innerState.value = func(innerState);
    }, poolInterval);

    poolingStateSet.push(intervalId)

    Object.defineProperty(innerState, 'innerIntervalId', {
        get() {
            return intervalId;
        }
    });

    return innerState;
}

export function createState(initialState) {
    var state = initialState;
    var listeners = [];

    var modified = false;
    var result = {};

    Object.defineProperties(result, {
        value: {
            get() {
                return state;
            },
            set(newState) {
                modified = true;
                state = newState;
                if (result.requestUpdate)
                    result.requestUpdate();
            }
        },
        initialValue: {
            get() {
                return initialState;
            }
        },
        modified: {
            get() {
                return modified;
            }
        }
    });
    result.subscribe = listener => {
        listeners.push(listener);
    };
    result.unsubscribe = listener => {
        listeners = listeners.filter(l => l !== listener);
    };
    result.clearSubscriptions = () => {
        listeners.length = 0;
    };
    result.requestUpdate = () => {
        for (const listener of listeners) {
            listener(state);
        }
    };
    result.reset = () => {
        state = newState;
        modified = false;
        if (result.requestUpdate)
            result.requestUpdate();
    }

    result[0] = () => state.value;
    result[1] = (newValue) => state.value = newValue;

    return result;
}