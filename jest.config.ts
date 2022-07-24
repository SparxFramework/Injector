export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	collectCoverage: true,
	clearMocks: true,
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
};
