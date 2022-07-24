'use strict';
import 'reflect-metadata';
import { Injector, Inject, Provide } from '../src/index';

describe('@sparx/injector', () => {
	it('should export injector, inject and provide', () => {
		expect(Injector).not.toBeNull();
		expect(Inject).not.toBeNull();
		expect(Provide).not.toBeNull();
	});

	describe('Injector module', () => {
		it('should register and resolve injectable string', () => {
			Injector.register('some_string', 'some_string');
			expect(Injector.resolve('some_string')).toBe('some_string');
		});

		it('should register and resolve injectable number', () => {
			Injector.register('some_number', 1234);
			expect(Injector.resolve('some_number')).toBe(1234);
		});

		it('should register and resolve injectable class', () => {
			class SomeClass {
				public getTrue(): boolean {
					return true;
				}
			}

			Injector.register('some_class', new SomeClass());
			expect(Injector.resolve('some_class')).toBeInstanceOf(SomeClass);
		});

		it('should throw error when registering existing name', () => {
			expect(() => {
				Injector.register('some_number', 2345);
			}).toThrow(new Error('The name you are trying to register your injectable with already exists.'));
		});

		it('should throw an error when resolving non-existent injectable', () => {
			expect(() => {
				Injector.resolve('non_existent_injectable');
			}).toThrow(new Error('The injectable name you are trying to inject does not exist.'));
		});

		it('should return null, when resolving a non-existent injectable with canFail set to true', () => {
			expect(Injector.resolve('non_existent_injectable', true)).toBe(null);
		});

		it('should allow overwriting existing injectables when overwrite is defined', () => {
			expect(() => {
				Injector.register('some_number', 2345, true);
			}).not.toThrowError();
		});

		it('should allow the user to list out all registered keys', () => {
			expect(Injector.list()).toContain('some_class');
		});

		it('should offer a debug mode that sets the debugMode property', () => {
			Injector.debug(true);
			expect(Injector.isDebug()).toBe(true);
		});

		it('should output debug information when debug is enabled', () => {
			Injector.debug(true);
			const consoleSpy = jest.spyOn(console, 'log');
			Injector.register('test_debug_output', 'test_debug_output');
			expect(consoleSpy).toHaveBeenCalledTimes(1);
			consoleSpy.mockClear();
		});
	});

	describe('@Provide decorator', () => {

		@Provide('some_provider')
		class SomeProvider {}

		@Provide('some_provider1', ['constructor_string'])
		class SomeProvider1 {
			constructor(public some_str: string) {}
		}

		@Provide()
		class SomeProvider2 {
			constructor(public some_str: string) {}
		}

		it('should register a valid injectable', () => {
			expect(Injector.resolve('some_provider')).toBeInstanceOf(SomeProvider);
		});

		it('should support constructor arguments', () => {
			expect(Injector.resolve('some_provider1').some_str).toBe('constructor_string');
		});

		it ('should allow no name, if so, use class target name', () => {
			expect(Injector.resolve('SomeProvider2')).toBeInstanceOf(SomeProvider2);
		});

		it('should add provider:name metadata', () => {
			expect(Reflect.getMetadata('provider:name', SomeProvider)).toBe('some_provider');
		});
	});

	describe('@Inject decorator', () => {

		Injector.register('some_test_string', 'test_string');

		@Provide('some_helper')
		class SomeHelper {
			public say(message: string): string {
				return message;
			}
		}

		class Example {
			@Inject() public helper!: SomeHelper;
			@Inject('some_test_string') public testString!: string;
		}

		it('should inject a valid variable injectable', () => {
			expect(new Example().testString).toBe('test_string');
		});

		it('should inject a valid class injectable', () => {
			expect(new Example().helper.say('test_one')).toBe('test_one');
		});

		it('should throw an error if name given for non-existent injectable', () => {
			expect(() => {

				class Example2 {
					@Inject('does_not_exist') public willFail!: string;
				}

				console.log(new Example2().willFail);

			}).toThrow(new Error('The injectable name you are trying to inject does not exist.'));
		});

		it('should throw an error if no valid provider and no name', () => {
			expect(() => {

				class Example3 {

					// @ts-expect-error
					@Inject() public willFail!: Something;
				}

			}).toThrow(new Error('The provided class is not a registered provider, and no name was given.'));
		});
	});
});
