// Polyfills for Node.js 20.18.0+ compatibility

// Polyfill for Promise.withResolvers() (Node.js 22+)
export function withResolvers<T>(): {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
} {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

// Polyfill for AbortSignal.timeout() (Node.js 22+)
export function abortTimeout(delay: number): AbortSignal {
    if (AbortSignal.timeout) {
        return AbortSignal.timeout(delay);
    }
    const controller = new AbortController();
    setTimeout(() => controller.abort(), delay);
    return controller.signal;
}

// Polyfill for AbortSignal.any() (Node.js 22+)
export function abortAny(signals: AbortSignal[]): AbortSignal {
    if (AbortSignal.any) {
        return AbortSignal.any(signals);
    }
    
    const controller = new AbortController();
    const onAbort = () => controller.abort();
    
    for (const signal of signals) {
        if (signal.aborted) {
            controller.abort();
            break;
        }
        signal.addEventListener('abort', onAbort, { once: true });
    }
    
    return controller.signal;
}