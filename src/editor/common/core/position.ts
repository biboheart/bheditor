/**
 * 在编辑块中的位置
 */
export interface IPosition {
    /**
     * 行编号，有的输入块中会存在换行情况，即多个p标签，一个p标签为一行。编号从0开始
     */
    readonly lineNumber: number;
    /**
     * 列编号，从0开始，第一个字符位于第一列和第2列之间
     */
    readonly column: number;
}

/**
 * 一个位置类
 */
export class Position {
    /**
     * 行编号，有的输入块中会存在换行情况，即多个p标签，一个p标签为一行。编号从0开始
     */
    public lineNumber: number;
    /**
     * 列编号，从0开始，第一个字符位于第一列和第2列之间
     */
    public column: number;

    constructor(lineNumber: number, column: number) {
        this.lineNumber = lineNumber;
        this.column = column;
    }

    /**
     * 从当前位置创建一个新的位置
     * @param newLineNumber 新的行编号
     * @param newColumn 新的列号
     */
    with(newLineNumber: number = this.lineNumber, newColumn: number = this.column): Position {
		if (newLineNumber === this.lineNumber && newColumn === this.column) {
			return this;
		} else {
			return new Position(newLineNumber, newColumn);
		}
    }
    
    /**
     * 从当前位置导出新位置
     * @param deltaLineNumber 移动行数
     * @param deltaColumn 移动列数
     */
    delta(deltaLineNumber: number = 0, deltaColumn: number = 0): Position {
        return this.with(this.lineNumber + deltaLineNumber, this.column + deltaColumn);
    }

    /**
     * 比较另一个位置与当前位置是否相同
     * @param other 另一个位置
     */
    public equals(other: IPosition): boolean {
		return Position.equals(this, other);
    }
    
    /**
     * 比较两个位置是否相同
     * @param a 一个位置
     * @param b 另一个位置
     */
    public static equals(a: IPosition | null, b: IPosition | null): boolean {
		if (!a && !b) {
			return true;
		}
		return (
			!!a &&
			!!b &&
			a.lineNumber === b.lineNumber &&
			a.column === b.column
		);
    }
    
    /**
     * 比较当前位置是否在另一个位置之前
     * @param other 另一个位置
     */
    public isBefore(other: IPosition): boolean {
		return Position.isBefore(this, other);
    }
    
    /**
     * 比较位置A是否在位置B之前
     * @param a 位置
     * @param b 基准位置
     */
    public static isBefore(a: IPosition, b: IPosition): boolean {
		if (a.lineNumber < b.lineNumber) {
			return true;
		}
		if (b.lineNumber < a.lineNumber) {
			return false;
		}
		return a.column < b.column;
    }

    /**
     * 比较当前位置是否在另一个位置之前或相等
     * @param other 另一个位置
     */
    public isBeforeOrEqual(other: IPosition): boolean {
		return Position.isBeforeOrEqual(this, other);
	}
    
    /**
     * 比较A是否在B之前或相同
     * @param a 位置
     * @param b 基准位置
     */
    public static isBeforeOrEqual(a: IPosition, b: IPosition): boolean {
		if (a.lineNumber < b.lineNumber) {
			return true;
		}
		if (b.lineNumber < a.lineNumber) {
			return false;
		}
		return a.column <= b.column;
    }
    
    /**
     * 比较位置的函数，用于排序
     * @param a 基准位置
     * @param b 比较位置
     */
    public static compare(a: IPosition, b: IPosition): number {
		let aLineNumber = a.lineNumber | 0;
		let bLineNumber = b.lineNumber | 0;

		if (aLineNumber === bLineNumber) {
			let aColumn = a.column | 0;
			let bColumn = b.column | 0;
			return aColumn - bColumn;
		}

		return aLineNumber - bLineNumber;
    }
    
    /**
     * 克隆当前位置
     */
    public clone(): Position {
		return new Position(this.lineNumber, this.column);
    }
    
    /**
     * 转换成可读字符串
     */
    public toString(): string {
		return '(' + this.lineNumber + ',' + this.column + ')';
    }
    
    /**
     * 从IPosition接口创建位置实例
     * @param pos 接口模型
     */
    public static lift(pos: IPosition): Position {
		return new Position(pos.lineNumber, pos.column);
    }
    
    /**
     * 测试对象是不是IPosition接口
     * @param obj 
     */
    public static isIPosition(obj: any): obj is IPosition {
		return (
			obj
			&& (typeof obj.lineNumber === 'number')
			&& (typeof obj.column === 'number')
		);
	}
}
