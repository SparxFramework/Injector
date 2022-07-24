# Dependecy Injection

[![Codecov](https://img.shields.io/codecov/c/github/SparxFramework/Injector)](https://codecov.io/github/SparxFramework/Injector)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/SparxFramework/Injector/Build)](https://github.com/SparxFramework/Injector/actions)
[![GitHub issues](https://img.shields.io/github/issues/SparxFramework/Injector)](https://github.com/SparxFramework/Injector/issues)
[![NPM](https://img.shields.io/npm/l/@sparx/injector)](https://www.npmjs.com/package/@sparx/injector)
[![npm (scoped)](https://img.shields.io/npm/v/@sparx/injector)](https://www.npmjs.com/package/@sparx/injector)
[![npm](https://img.shields.io/npm/dw/@sparx/injector)](https://www.npmjs.com/package/@sparx/injector)

The injector package is a dependecy injection tool built on top of TypeScript decorators for use with Node.JS/TypeScript applications. The original design is for a framework that is soon to come out, this is a prerequisite library.

## Getting Started

### Standard usage.

```typescript
import { Inject, Provide } from '@sparx/injector';

@Provide() // You can optionally give it a name.
export class NumberHelper {
	public multiply(num1: number, num2: number): number {
		return num1 * num2;
	}
}

export class BusinessLogic {

	@Inject() helper!: NumberHelper;

	public main(): void {
		console.log(this.helper.multiply(5, 5));
	}
}
```

### Custom usage.

```typescript
import { Injector, Inject } from '@sparx/injector';

// You can register variables specifically.
Injector.register('my_special_var', 12345);

// You can also resolve them manually.
const mySpecialVar = Injector.resolve('my_special_var');

// You can also inject with a name.
export class BusinessLogic {

	@Inject('my_special_var')
	public specialVariable!: number;
}
```
