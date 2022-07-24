import { Injector } from '../module/injector';

/**
 * The inject decorator when no name is given will use the defined type class
 * to find an instance of that class in the injector registry and apply it to
 * the injected property, if a name is given then it will search for a provided
 * variable instead to inject as the property.
 * 
 * @param name Optional name of injectable.
 * @param canFail Optional flag to allow injection to fail and return null instead.
 * @returns Function
 */
export function Inject(name?: string, canFail?: boolean): Function {
	return (target: Record<string, unknown>, propertyKey: string) => {

		// Figure out whether we use a class or a name.
		const injectClass = Reflect.getMetadata('design:type', target, propertyKey);
		let providingKey: string = Reflect.getMetadata('provider:name', injectClass);

		// Check for debug.
		/* istanbul ignore next */
		if (Injector.isDebug()) {
			console.log(`Inject called from ${target.name} || ${target.constructor.name} with name: ${name}, providing key: ${providingKey}, can fail: ${canFail}, injecting class;`, injectClass);
		}

		// If no providingKey is found then we assume the name property or throw an error if no name is given.
		if (!providingKey) {
			if (!name) throw new Error('The provided class is not a registered provider, and no name was given.');
			providingKey = name;
		}

		// Redefine the new class property's get method.
		Object.defineProperty(target, propertyKey, {
			get: () => {

				// Resolve when called, so we can registered modules later than when they get used.
				return Injector.resolve(providingKey, canFail);
			},

			enumerable: true,
			configurable: true,
		});
	};
}

