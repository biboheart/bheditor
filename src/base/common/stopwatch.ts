
export class StopWatch {
	private _startTime: number;
	private _stopTime: number;

	public static create(highResolution: boolean = true): StopWatch {
		return new StopWatch(highResolution);
	}

	constructor(highResolution: boolean) {
		this._startTime = this._now();
		this._stopTime = -1;
	}

	public stop(): void {
		this._stopTime = this._now();
	}

	public elapsed(): number {
		if (this._stopTime !== -1) {
			return this._stopTime - this._startTime;
		}
		return this._now() - this._startTime;
	}

	private _now(): number {
		return Date.now();
	}
}
