// import { once as onceFn } from './functional';
import { Disposable, IDisposable, combinedDisposable, DisposableStore } from './lifecycle';
import { LinkedList } from './linkedList';
import { StopWatch } from './stopwatch';

export interface Event<T> {
    (listener: (e: T) => any, thisArgs?: any, disposables?: IDisposable[] | DisposableStore): IDisposable;
}

export namespace Event {
    export const None: Event<any> = () => Disposable.None;

    /**
     * 给定一个事件，返回另一个只触发一次的事件。
     */
    export function once<T>(event: Event<T>): Event<T> {
        return (listener, thisArgs = null, disposables?) => {
            let didFire = false;
            let result: IDisposable;
            result = event(e => {
                if (didFire) {
					return;
				} else if (result) {
					result.dispose();
				} else {
					didFire = true;
				}

				return listener.call(thisArgs, e);
            }, null, disposables)

            if (didFire) {
				result.dispose();
            }
            
            return result;
        }
    }

    /**
     * 给定一个事件和一个“map”函数，返回另一个通过mapping函数映射每个元素的事件。
     */
    export function map<I, O>(event: Event<I>, map: (i: I) => O): Event<O> {
		return snapshot((listener, thisArgs = null, disposables?) => event(i => listener.call(thisArgs, map(i)), null, disposables));
    }
    
    /**
     * 给定一个事件和一个'each'函数，返回另一个相同的事件，并为每个元素调用'each'函数。
     */
    export function forEach<I>(event: Event<I>, each: (i: I) => void): Event<I> {
		return snapshot((listener, thisArgs = null, disposables?) => event(i => { each(i); listener.call(thisArgs, i); }, null, disposables));
    }

    /**
	 * 给定一个事件和一个“filter”函数，则返回另一个事件，该事件将发出“filter”函数为其返回“true”的元素。
	 */
	export function filter<T>(event: Event<T>, filter: (e: T) => boolean): Event<T>;
	export function filter<T, R>(event: Event<T | R>, filter: (e: T | R) => e is R): Event<R>;
	export function filter<T>(event: Event<T>, filter: (e: T) => boolean): Event<T> {
		return snapshot((listener, thisArgs = null, disposables?) => event(e => filter(e) && listener.call(thisArgs, e), null, disposables));
	}
    
    /**
     * 给定一个事件，返回相同的事件，但类型为“event<void>`”。
     */
    export function signal<T>(event: Event<T>): Event<void> {
		return event as Event<any> as Event<void>;
    }
    
    /**
     * 给定一个事件集合，返回一个事件，该事件在提供的任何事件发出时发出。
     */
    export function any<T>(...events: Event<T>[]): Event<T>;
	export function any(...events: Event<any>[]): Event<void>;
	export function any<T>(...events: Event<T>[]): Event<T> {
		return (listener, thisArgs = null, disposables?) => combinedDisposable(...events.map(event => event(e => listener.call(thisArgs, e), null, disposables)));
    }
    
    /**
     * 给定一个事件和一个“merge”函数，返回另一个事件，该事件通过“merge”函数映射每个元素和累积结果。类似于“map”，但有内存。
     */
    export function reduce<I, O>(event: Event<I>, merge: (last: O | undefined, event: I) => O, initial?: O): Event<O> {
		let output: O | undefined = initial;

		return map<I, O>(event, e => {
			output = merge(output, e);
			return output;
		});
    }
    
    /**
     * 给定一系列事件处理函数（filter、map等），
     * 每个函数都将按事件和侦听器调用。
     * 快照事件链允许每个函数在每个事件中只调用一次。
     */
    export function snapshot<T>(event: Event<T>): Event<T> {
		let listener: IDisposable;
		const emitter = new Emitter<T>({
			onFirstListenerAdd() {
				listener = event(emitter.fire, emitter);
			},
			onLastListenerRemove() {
				listener.dispose();
			}
		});

		return emitter.event;
    }
    
    /**
	 * 给定“merge”函数，取消提供的事件的抖动。
	 *
	 * @param 事件输入事件。
	 * @param 合并还原函数。
	 * @param 延迟以毫秒为单位的去抖动延迟。
	 * @param 引导是否应该在超时的引导阶段触发事件。
	 * @param leakWarningThreshold泄漏警告阈值覆盖。
	 */
    export function debounce<T>(event: Event<T>, merge: (last: T | undefined, event: T) => T, delay?: number, leading?: boolean, leakWarningThreshold?: number): Event<T>;
	export function debounce<I, O>(event: Event<I>, merge: (last: O | undefined, event: I) => O, delay?: number, leading?: boolean, leakWarningThreshold?: number): Event<O>;
	export function debounce<I, O>(event: Event<I>, merge: (last: O | undefined, event: I) => O, delay: number = 100, leading = false, leakWarningThreshold?: number): Event<O> {

		let subscription: IDisposable;
		let output: O | undefined = undefined;
		let handle: any = undefined;
		let numDebouncedCalls = 0;

		const emitter = new Emitter<O>({
			leakWarningThreshold,
			onFirstListenerAdd() {
				subscription = event(cur => {
					numDebouncedCalls++;
					output = merge(output, cur);

					if (leading && !handle) {
						emitter.fire(output);
						output = undefined;
					}

					clearTimeout(handle);
					handle = setTimeout(() => {
						const _output = output;
						output = undefined;
						handle = undefined;
						if (!leading || numDebouncedCalls > 1) {
							emitter.fire(_output!);
						}

						numDebouncedCalls = 0;
					}, delay);
				});
			},
			onLastListenerRemove() {
				subscription.dispose();
			}
		});

		return emitter.event;
    }
    
    /**
	 * 给定一个事件，它返回另一个只触发一次的事件，并且在输入事件发出时立即触发。
     * 事件数据是事件触发所用的毫秒数。
	 */
    export function stopwatch<T>(event: Event<T>): Event<number> {
		const start = new Date().getTime();
		return map(once(event), _ => new Date().getTime() - start);
    }
    
    /**
	 * 给定一个事件，它将返回另一个仅在事件元素更改时激发的事件。
	 */
    export function latch<T>(event: Event<T>): Event<T> {
		let firstCall = true;
		let cache: T;

		return filter(event, value => {
			const shouldEmit = firstCall || value !== cache;
			firstCall = false;
			cache = value;
			return shouldEmit;
		});
    }
    
    /**
	 * 缓冲所提供的事件，直到出现第一个侦听器，此时将一次触发所有事件，并从此开始对事件进行管道处理。
     * 
	 * ```typescript
	 * const emitter = new Emitter<number>();
	 * const event = emitter.event;
	 * const bufferedEvent = buffer(event);
	 *
	 * emitter.fire(1);
	 * emitter.fire(2);
	 * emitter.fire(3);
	 * // nothing...
	 *
	 * const listener = bufferedEvent(num => console.log(num));
	 * // 1, 2, 3
	 *
	 * emitter.fire(4);
	 * // 4
	 * ```
	 */
    export function buffer<T>(event: Event<T>, nextTick = false, _buffer: T[] = []): Event<T> {
		let buffer: T[] | null = _buffer.slice();

		let listener: IDisposable | null = event(e => {
			if (buffer) {
				buffer.push(e);
			} else {
				emitter.fire(e);
			}
		});

		const flush = () => {
			if (buffer) {
				buffer.forEach(e => emitter.fire(e));
			}
			buffer = null;
		};

		const emitter = new Emitter<T>({
			onFirstListenerAdd() {
				if (!listener) {
					listener = event(e => emitter.fire(e));
				}
			},

			onFirstListenerDidAdd() {
				if (buffer) {
					if (nextTick) {
						setTimeout(flush);
					} else {
						flush();
					}
				}
			},

			onLastListenerRemove() {
				if (listener) {
					listener.dispose();
				}
				listener = null;
			}
		});

		return emitter.event;
    }
    
    export interface IChainableEvent<T> {
		event: Event<T>;
		map<O>(fn: (i: T) => O): IChainableEvent<O>;
		forEach(fn: (i: T) => void): IChainableEvent<T>;
		filter(fn: (e: T) => boolean): IChainableEvent<T>;
		filter<R>(fn: (e: T | R) => e is R): IChainableEvent<R>;
		reduce<R>(merge: (last: R | undefined, event: T) => R, initial?: R): IChainableEvent<R>;
		latch(): IChainableEvent<T>;
		debounce(merge: (last: T | undefined, event: T) => T, delay?: number, leading?: boolean, leakWarningThreshold?: number): IChainableEvent<T>;
		debounce<R>(merge: (last: R | undefined, event: T) => R, delay?: number, leading?: boolean, leakWarningThreshold?: number): IChainableEvent<R>;
		on(listener: (e: T) => any, thisArgs?: any, disposables?: IDisposable[] | DisposableStore): IDisposable;
		once(listener: (e: T) => any, thisArgs?: any, disposables?: IDisposable[]): IDisposable;
    }
    
    class ChainableEvent<T> implements IChainableEvent<T> {
        constructor(readonly event: Event<T>) { }

        map<O>(fn: (i: T) => O): IChainableEvent<O> {
			return new ChainableEvent(map(this.event, fn));
        }
        
        forEach(fn: (i: T) => void): IChainableEvent<T> {
			return new ChainableEvent(forEach(this.event, fn));
        }
        
        filter(fn: (e: T) => boolean): IChainableEvent<T>;
		filter<R>(fn: (e: T | R) => e is R): IChainableEvent<R>;
		filter(fn: (e: T) => boolean): IChainableEvent<T> {
			return new ChainableEvent(filter(this.event, fn));
        }
        
        reduce<R>(merge: (last: R | undefined, event: T) => R, initial?: R): IChainableEvent<R> {
			return new ChainableEvent(reduce(this.event, merge, initial));
		}

		latch(): IChainableEvent<T> {
			return new ChainableEvent(latch(this.event));
		}

		debounce(merge: (last: T | undefined, event: T) => T, delay?: number, leading?: boolean, leakWarningThreshold?: number): IChainableEvent<T>;
		debounce<R>(merge: (last: R | undefined, event: T) => R, delay?: number, leading?: boolean, leakWarningThreshold?: number): IChainableEvent<R>;
		debounce<R>(merge: (last: R | undefined, event: T) => R, delay: number = 100, leading = false, leakWarningThreshold?: number): IChainableEvent<R> {
			return new ChainableEvent(debounce(this.event, merge, delay, leading, leakWarningThreshold));
		}

		on(listener: (e: T) => any, thisArgs: any, disposables: IDisposable[] | DisposableStore) {
			return this.event(listener, thisArgs, disposables);
		}

		once(listener: (e: T) => any, thisArgs: any, disposables: IDisposable[]) {
			return once(this.event)(listener, thisArgs, disposables);
		}
    }

    export function chain<T>(event: Event<T>): IChainableEvent<T> {
		return new ChainableEvent(event);
	}

	export interface NodeEventEmitter {
		on(event: string | symbol, listener: Function): unknown;
		removeListener(event: string | symbol, listener: Function): unknown;
	}

	export function fromNodeEventEmitter<T>(emitter: NodeEventEmitter, eventName: string, map: (...args: any[]) => T = id => id): Event<T> {
		const fn = (...args: any[]) => result.fire(map(...args));
		const onFirstListenerAdd = () => emitter.on(eventName, fn);
		const onLastListenerRemove = () => emitter.removeListener(eventName, fn);
		const result = new Emitter<T>({ onFirstListenerAdd, onLastListenerRemove });

		return result.event;
	}

	export interface DOMEventEmitter {
		addEventListener(event: string | symbol, listener: Function): void;
		removeEventListener(event: string | symbol, listener: Function): void;
	}

	export function fromDOMEventEmitter<T>(emitter: DOMEventEmitter, eventName: string, map: (...args: any[]) => T = id => id): Event<T> {
		const fn = (...args: any[]) => result.fire(map(...args));
		const onFirstListenerAdd = () => emitter.addEventListener(eventName, fn);
		const onLastListenerRemove = () => emitter.removeEventListener(eventName, fn);
		const result = new Emitter<T>({ onFirstListenerAdd, onLastListenerRemove });

		return result.event;
	}

	export function fromPromise<T = any>(promise: Promise<T>): Event<undefined> {
		const emitter = new Emitter<undefined>();
		let shouldEmit = false;

		promise
			.then(undefined, () => null)
			.then(() => {
				if (!shouldEmit) {
					setTimeout(() => emitter.fire(undefined), 0);
				} else {
					emitter.fire(undefined);
				}
			});

		shouldEmit = true;
		return emitter.event;
	}

	export function toPromise<T>(event: Event<T>): Promise<T> {
		return new Promise(c => once(event)(c));
	}
}

type Listener<T> = [(e: T) => void, any] | ((e: T) => void);

let _globalLeakWarningThreshold = -1;
export function setGlobalLeakWarningThreshold(n: number): IDisposable {
	const oldValue = _globalLeakWarningThreshold;
	_globalLeakWarningThreshold = n;
	return {
		dispose() {
			_globalLeakWarningThreshold = oldValue;
		}
	};
}

class LeakageMonitor {

	private _stacks: Map<string, number> | undefined;
	private _warnCountdown: number = 0;

	constructor(
		readonly customThreshold?: number,
		readonly name: string = Math.random().toString(18).slice(2, 5),
	) { }

	dispose(): void {
		if (this._stacks) {
			this._stacks.clear();
		}
	}

	check(listenerCount: number): undefined | (() => void) {

		let threshold = _globalLeakWarningThreshold;
		if (typeof this.customThreshold === 'number') {
			threshold = this.customThreshold;
		}

		if (threshold <= 0 || listenerCount < threshold) {
			return undefined;
		}

		if (!this._stacks) {
			this._stacks = new Map();
		}
		const stack = new Error().stack!.split('\n').slice(3).join('\n');
		const count = (this._stacks.get(stack) || 0);
		this._stacks.set(stack, count + 1);
		this._warnCountdown -= 1;

		if (this._warnCountdown <= 0) {
			// only warn on first exceed and then every time the limit
			// is exceeded by 50% again
			this._warnCountdown = threshold * 0.5;

			// find most frequent listener and print warning
			let topStack: string | undefined;
			let topCount: number = 0;
			for (const [stack, count] of this._stacks) {
				if (!topStack || topCount < count) {
					topStack = stack;
					topCount = count;
				}
			}

			console.warn(`[${this.name}] potential listener LEAK detected, having ${listenerCount} listeners already. MOST frequent listener (${topCount}):`);
			console.warn(topStack!);
		}

		return () => {
			const count = (this._stacks!.get(stack) || 0);
			this._stacks!.set(stack, count - 1);
		};
	}
}

class EventProfiling {

	private static _idPool = 0;

	private _name: string;
	private _stopWatch?: StopWatch;
	private _listenerCount: number = 0;
	private _invocationCount = 0;
	private _elapsedOverall = 0;

	constructor(name: string) {
		this._name = `${name}_${EventProfiling._idPool++}`;
	}

	start(listenerCount: number): void {
		this._stopWatch = new StopWatch(true);
		this._listenerCount = listenerCount;
	}

	stop(): void {
		if (this._stopWatch) {
			const elapsed = this._stopWatch.elapsed();
			this._elapsedOverall += elapsed;
			this._invocationCount += 1;

			console.info(`did FIRE ${this._name}: elapsed_ms: ${elapsed.toFixed(5)}, listener: ${this._listenerCount} (elapsed_overall: ${this._elapsedOverall.toFixed(2)}, invocations: ${this._invocationCount})`);
			this._stopWatch = undefined;
		}
	}
}

export interface EmitterOptions {
	onFirstListenerAdd?: Function;
	onFirstListenerDidAdd?: Function;
	onListenerDidAdd?: Function;
	onLastListenerRemove?: Function;
	leakWarningThreshold?: number;

	/** ONLY enable this during development */
	_profName?: string
}

export class Emitter<T> {

    private static readonly _noop = function () { };

    private readonly _options?: EmitterOptions;
	private readonly _leakageMon?: LeakageMonitor;
	private readonly _perfMon?: EventProfiling;
	private _disposed: boolean = false;
	private _event?: Event<T>;
	private _deliveryQueue?: LinkedList<[Listener<T>, T]>;
	protected _listeners?: LinkedList<Listener<T>>;

    constructor(options?: EmitterOptions) {
		this._options = options;
        this._leakageMon = _globalLeakWarningThreshold > 0 ? new LeakageMonitor(this._options && this._options.leakWarningThreshold) : undefined;
        this._perfMon = this._options?._profName ? new EventProfiling(this._options._profName) : undefined;
    }

    get event(): Event<T> {
        if (!this._event) {
            this._event = (listener: (e: T) => any, thisArgs?: any, disposables?: IDisposable[] | DisposableStore) => {
                if (!this._listeners) {
                    this._listeners = new LinkedList();
                }

                const firstListener = this._listeners.isEmpty();

                if (firstListener && this._options && this._options.onFirstListenerAdd) {
                    this._options.onFirstListenerAdd(this);
                }

                const remove = this._listeners.push(!thisArgs ? listener : [listener, thisArgs]);

                if (firstListener && this._options && this._options.onFirstListenerDidAdd) {
					this._options.onFirstListenerDidAdd(this);
				}

				if (this._options && this._options.onListenerDidAdd) {
					this._options.onListenerDidAdd(this, listener, thisArgs);
                }
                
                // 检查并记录发射器是否存在潜在泄漏
                const removeMonitor = this._leakageMon?.check(this._listeners.size);
                
                let result: IDisposable;
				result = {
					dispose: () => {
						if (removeMonitor) {
							removeMonitor();
						}
						result.dispose = Emitter._noop;
						if (!this._disposed) {
							remove();
							if (this._options && this._options.onLastListenerRemove) {
								const hasListeners = (this._listeners && !this._listeners.isEmpty());
								if (!hasListeners) {
									this._options.onLastListenerRemove(this);
								}
							}
						}
					}
				};
				if (disposables instanceof DisposableStore) {
					disposables.add(result);
				} else if (Array.isArray(disposables)) {
					disposables.push(result);
				}

				return result;
            };
        }
        return this._event;
    }

    fire(event: T): void {
		if (this._listeners) {
			// 将所有[listener，event]对放入传递队列，然后发出所有事件。内部/嵌套事件可能是此事件的驱动程序

			if (!this._deliveryQueue) {
				this._deliveryQueue = new LinkedList();
			}

			for (let listener of this._listeners) {
				this._deliveryQueue.push([listener, event]);
			}

			// start/stop performance insight collection
			this._perfMon?.start(this._deliveryQueue.size);

			while (this._deliveryQueue.size > 0) {
				const [listener, event] = this._deliveryQueue.shift()!;
				try {
					if (typeof listener === 'function') {
						listener.call(undefined, event);
					} else {
						listener[0].call(listener[1], event);
					}
				} catch (e) {
					// onUnexpectedError(e);
				}
			}

			this._perfMon?.stop();
		}
	}

    dispose() {
		this._listeners?.clear();
		this._deliveryQueue?.clear();
		this._leakageMon?.dispose();
		this._disposed = true;
	}
}
