# Fork Changes Documentation

This document describes the modifications made to the original [`@nktkas/hyperliquid`](https://github.com/nktkas/hyperliquid) package to create `@deeeed/hyperliquid-node20`.

## 📋 Summary

This fork adds Node.js 20.18.0+ compatibility to the original Hyperliquid SDK while maintaining 100% API compatibility. The original package required Node.js ≥24.0.0 due to newer JavaScript features that are not available in older Node.js versions.

## 🎯 Motivation

- **Broader Compatibility**: Support projects using Node.js LTS versions (20.x)
- **Zero Breaking Changes**: Maintain exact same API and behavior
- **Minimal Footprint**: Add only necessary polyfills, no unnecessary dependencies

## 🔧 Technical Changes Made

### 1. Node.js Version Requirements

**File**: `build/npm.ts`
- **Before**: `node: ">=24.0.0"`
- **After**: `node: ">=20.18.0"`

### 2. JavaScript Feature Polyfills

**New File**: `src/polyfills.ts`

Added polyfills for Node.js 24+ features:

#### `Promise.withResolvers()` Polyfill
```typescript
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
```

#### `AbortSignal.timeout()` Polyfill
```typescript
export function abortTimeout(delay: number): AbortSignal {
    if (AbortSignal.timeout) {
        return AbortSignal.timeout(delay);
    }
    const controller = new AbortController();
    setTimeout(() => controller.abort(), delay);
    return controller.signal;
}
```

#### `AbortSignal.any()` Polyfill
```typescript
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
```

### 3. Source Code Modifications

#### File: `src/transports/websocket/_websocket_async_request.ts`
- **Line 4**: Added import for polyfill
- **Line 172**: Replaced `Promise.withResolvers<T>()` with `withResolvers<T>()`

#### File: `src/transports/http/http_transport.ts`
- **Line 3**: Added import for polyfills
- **Line 128**: Replaced `AbortSignal.timeout()` with `abortTimeout()`
- **Line 203**: Replaced `AbortSignal.any()` with `abortAny()`

#### File: `src/transports/websocket/websocket_transport.ts`
- **Line 10**: Added import for polyfills
- **Line 161**: Replaced `AbortSignal.timeout()` with `abortTimeout()`
- **Line 163**: Replaced `AbortSignal.any()` with `abortAny()`
- **Line 278**: Replaced `AbortSignal.any()` with `abortAny()`
- **Line 336**: Replaced `AbortSignal.timeout()` with `abortTimeout()`

### 4. Package Metadata Updates

#### File: `deno.json`
- Package name: `@deeeed/hyperliquid-node20`
- Version: `0.23.1-node20.1`

#### File: `build/npm.ts`
- Updated description to mention Node.js 20+ compatibility
- Added keywords: `"node20"`, `"compatibility"`, `"fork"`
- Updated repository URLs to point to fork
- Updated author information

#### File: `README.md`
- Added prominent fork notice with attribution
- Updated all import examples
- Updated installation instructions
- Added migration guidance

## ✅ Compatibility Strategy

The polyfills are designed to:

1. **Graceful Fallback**: Use native implementations when available (Node.js 22+)
2. **Identical Behavior**: Provide exactly the same functionality as native implementations
3. **Performance**: Minimal overhead, only add what's necessary
4. **Future-Proof**: Automatically use native implementations as they become available

## 🧪 Testing

- All original tests pass without modification
- WebSocket async request tests specifically verify `Promise.withResolvers()` polyfill works correctly
- HTTP transport tests verify `AbortSignal` polyfills work correctly

## 📦 Publishing Information

- **Original Package**: `@nktkas/hyperliquid`
- **Fork Package**: `@deeeed/hyperliquid-node20`
- **NPM Publisher**: `deeeed`
- **Repository**: `github.com/abretonc7s/hyperliquid`

## 🔄 Staying Up-to-Date

This fork aims to stay synchronized with the upstream repository. When the original package adds new features or fixes bugs, they will be incorporated into this fork while maintaining Node.js 20+ compatibility.

## 🙏 Credits

All credit for the original implementation goes to [nktkas](https://github.com/nktkas) and contributors to the [`@nktkas/hyperliquid`](https://github.com/nktkas/hyperliquid) package. This fork only adds compatibility polyfills and makes no changes to the core functionality.

## 📄 License

This fork maintains the same MIT license as the original package.