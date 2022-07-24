import 'reflect-metadata';
import { Injector } from './module/injector';
import { Inject } from './decorator/inject';
import { Provide } from './decorator/provide';

/**
 * The dependecy injection package, exports:
 * 
 * @exports Injector
 * @exports Inject
 * @exports Provide
 */
export {
	Injector,
	Inject,
	Provide,
};
