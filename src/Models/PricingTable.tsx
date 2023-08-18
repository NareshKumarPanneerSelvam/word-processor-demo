import { CellVerticalAlignment, HeightType, TableAlignment } from "@syncfusion/ej2-react-documenteditor";
import { BorderType } from "./CustomTypes";

export interface PricingTable{
    columnSize? : number,
    rowSize? : number,
    tableAlignment : TableAlignment,
    rowModels : RowModel[],
    aggregateRowModels : AggregateRowModel[]
}

export interface RowModel{
    rowId : number,
    isHeader : boolean,
    heightType : HeightType,
    height : number,
    columnModels : ColumnModel[]
}

export interface ColumnModel{
    columnId : number,
    value : string,
    verticalAlignment : CellVerticalAlignment,
    background : string,
    bold : boolean,
    columName : string,
    placeHolder: string,
    disabled? : boolean
}

export interface AggregateRowModel{
    rowId : number,
    heightType : HeightType,
    height : number,
    borderType : BorderType,
    aggregateColumnModels : AggregateColumnModel[]
}

export interface AggregateColumnModel{
    columnId : number,
    value : string,
    isLabel : boolean,
    label : string,
    verticalAlignment : CellVerticalAlignment,
    background? : string,
    bold : boolean,
    isAvailable : boolean,
    disabled? : boolean
}