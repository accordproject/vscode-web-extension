export class Contract<T> {
	contract: T;
	now(): Date {
		return new Date();
	}
}
