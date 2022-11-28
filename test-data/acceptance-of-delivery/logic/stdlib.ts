// from stdlib
export function isBefore(a: Date, b: Date): boolean {
	return a < b;
}

export function isAfter(a: Date, b: Date): boolean {
	return a > b;
}

export function addDuration(a: Date, duration: IDuration): Date {
	// TODO
	return new Date(a.getMilliseconds() + duration.amount);
}
