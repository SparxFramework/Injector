import { Inject, Injector, Provide } from '../src/index';

// Enable debug.
Injector.debug(true);

// Test manual registration.
Injector.register('some_number', 2345);

// Create helper.
@Provide()
class MyHelper {
	public multiply(num1: number, num2: number): number {
		return num1 * num2;
	}
}

// Create controller.
class MyController {
	@Inject()
	public helper!: MyHelper;

	public run(): void {
		console.log(this.helper.multiply(5, 5));
	}
}

// Log all keys.
console.log(Injector.list());

// Inject non-existent.
console.log(Injector.resolve('non-existent', true) === null);

// Run the controller.
new MyController().run();
