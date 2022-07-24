/**
 * The injector class allows you to register and resolve dependencies, the
 * class can be used directly and is also included in the inject decorator
 * for resolving dependencies. Note this class is static so that when it is
 * imported into files it retains its state.
 * 
 * @class Injector.
 */
export class Injector {

	private static registry: Map<string, any> = new Map();
	private static debugMode = false;

	/**
	 * This method will register a injectable class instance with the registry
	 * so that it can be injected anywhere in the engine.
	 * 
	 * @param name The name of the provided item.
	 * @param instance The instance of the item.
	 * @param overwrite Whether to overwrite any existing.
	 * @returns boolean
	 * @static
	 */
	public static register(name: string, instance: any, overwrite = false): boolean {
		this.setupGlobal();
		if (this.debugMode) console.log(`Registering injectable: ${name}, can overwrite: ${overwrite}`, instance);
		if (!overwrite) {
			if (globalThis.injectorRegistry.has(name)) throw new Error('The name you are trying to register your injectable with already exists.');
		}
		globalThis.injectorRegistry.set(name, instance);
		return true;
	}

	/**
	 * This method will resolve an injectable instance from the registry
	 * so that it can be defined into the injecting class instance.
	 * 
	 * @param name The name of the provided item.
	 * @param canFail Whether to throw an error if the item is not found (default: false).
	 * @returns any
	 * @static
	 */
	public static resolve(name: string, canFail = false): any {
		this.setupGlobal();
		if (this.debugMode) console.log(`Resolving injectable: ${name}, can fail: ${canFail}`);
		if (!globalThis.injectorRegistry.has(name)) {
			if (!canFail) throw new Error('The injectable name you are trying to inject does not exist.');
			return null;
		}
		return globalThis.injectorRegistry.get(name);
	}

	/**
	 * This method will simply list all keys registered to the injector
	 * module, and is mainly for debugging.
	 * 
	 * @returns Array<string>
	 * @static
	 */
	public static list(): Array<string> {
		this.setupGlobal();
		return Array.from(globalThis.injectorRegistry.keys());
	}

	/**
	 * Sets up the global injector registry.
	 */
	private static setupGlobal(): void {
		if (!globalThis.injectorRegistry) {
			globalThis.injectorRegistry = new Map<string, any>();
		}
	}

	/**
	 * Toggle debug mode.
	 *
	 * @param status The new debug mode status.
	 */
	public static debug(status: boolean): void {
		this.debugMode = status;
	}

	/**
	 * Check if the injector is in debug mode.
	 *
	 * @returns boolean
	 */
	public static isDebug(): boolean {
		return this.debugMode;
	}
}

