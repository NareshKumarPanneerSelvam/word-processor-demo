import { useState } from "react";
import '../App.css';
import { AggregateColumnModel, AggregateRowModel, ColumnModel, PricingTable, RowModel } from "../Models/PricingTable";

interface Props{
    openDocumentEditorHandler(pricingTable : PricingTable) : void;
    showModal(close: boolean): void;
}

function DynamicTable({ openDocumentEditorHandler, showModal}: Props){
    const [refresh, setRefresh] = useState<boolean>(false);
    const [rowSize, setRowSize] = useState<number>(0);
    const [aggregateRowSize, setAggregateRowSize] = useState<number>(0);
    const [columnSize, setColumnSize] = useState<number>(0);
    const [tableCustomizingWindow, setTableCustomizingWindow] = useState<boolean>(true);
    const [cellCustomizingWindow, setCellCustomizingWindow] = useState<boolean>(false);
    const [pricingTable, setPricingTable] = useState<PricingTable>();

    const handleClose = () => {
        showModal(false);
    }

    const dialogClose = () => {
        if (tableCustomizingWindow){            
            tableCustomizationHandler();
        }
        else if (cellCustomizingWindow && pricingTable){
            setRefresh(!refresh);
            openDocumentEditorHandler(pricingTable);
        }
    }

    const tableCustomizationHandler = () => {
        const rowModels : RowModel[] = [];
            for (let i = 0; i < rowSize; i++) {
                const columnModels : ColumnModel[] = [];
                for (let j = 0; j < columnSize; j++) {
                    columnModels.push({
                        columnId : j + 1, 
                        value : '', 
                        columName : '',
                        verticalAlignment : 'Center', 
                        background : i === 0 ? '#f2f2f2' : '#fff',
                        bold : i === 0,
                        placeHolder : i === 0 ? 'Header text' : ''
                    });
                }
                rowModels.push({
                    rowId : i + 1,
                    isHeader : i === 0,
                    heightType : 'Exactly',
                    height : 30,
                    columnModels : columnModels
                });
            }

            const aggregateRowModels : AggregateRowModel[] = [];
            for (let i = 0; i < aggregateRowSize; i++){                
                const aggregateColumnModels : AggregateColumnModel[] = [];
                for (let j = 0; j < columnSize; j++) {
                    aggregateColumnModels.push({
                        isAvailable : j >= columnSize - 2, // 2 is number of column is needed in aggregation row
                        columnId : j >= columnSize - 2 ? j + 1 : 0, 
                        value : '', 
                        isLabel : j === columnSize - 2,
                        label : '',
                        verticalAlignment : 'Center', 
                        bold : j > columnSize - 2
                    });
                }
                aggregateRowModels.push({
                    rowId : i + 1,
                    heightType : 'Exactly',
                    height : 15, 
                    borderType : 'NoBorder',
                    aggregateColumnModels : aggregateColumnModels
                })
            }
            var pricing : PricingTable = {
                rowSize : rowSize,
                tableAlignment : 'Center',
                columnSize : columnSize,
                rowModels : rowModels,
                aggregateRowModels : aggregateRowModels,
            };
            setPricingTable(pricing);
            setTableCustomizingWindow(false);
            setCellCustomizingWindow(true);
    }

    const setColumnNameForAllRows = (rowId :number, columnId: number, value: string) => {
        let newTable : PricingTable | undefined = pricingTable;
        if (newTable){
            for (let row of newTable.rowModels){
                for (let column of row.columnModels){
                    if (column.columnId === columnId){
                        column.columName = value;
                        if (row.rowId === rowId)
                            column.value = value;
                    }
                }
            }
            setPricingTable(newTable);
            setRefresh(!refresh);
        }
    }

    const tableValueChangingHandler = (rowId : number, columnId: number, value: string, isNative : boolean = true) => {
        let newTable : PricingTable | undefined = pricingTable;
        let applyCalculation : boolean = false;
        if (newTable){
            for (let row of newTable.rowModels){
                if (row.rowId === rowId){
                    for (let column of row.columnModels){
                        if (column.columnId === columnId){
                            column.value = value;
                            if (isNative && column.columName.toLocaleLowerCase().includes('total')
                                || column.columName.toLocaleLowerCase().includes('price')
                                || column.columName.toLocaleLowerCase().includes('qty')
                                || column.columName.toLocaleLowerCase().includes('quantity')){ 
                                    applyCalculation = true;                                
                            }
                        }
                    }
                }
            }
            setPricingTable(newTable);
            setRefresh(!refresh);
            if (applyCalculation)
                eachProductTotalCalculation(rowId);
        }
    }

    const handleInputChange = (rowId : number, isHeader : boolean, columnId: number, value: string) => {
        if (isHeader)
            setColumnNameForAllRows(rowId, columnId, value);
        else
            tableValueChangingHandler(rowId, columnId, value, true);
    }

    const inputBlurHandler = (rowId : number, isHeader : boolean, columnId: number, value: string) => {
        let newTable : PricingTable | undefined = pricingTable;
        if (value?.toLowerCase().includes('total') && newTable){
            if (newTable.rowModels.some(row => row.columnModels.some(column => !row.isHeader && column.columnId === columnId && column.disabled !== true))){
                for (let row of newTable.rowModels){
                    for (let column of row.columnModels){
                        if (!row.isHeader && column.columnId === columnId && !column.disabled)
                            column.disabled = true;
                    } 
                } 
            }
            setPricingTable(newTable);
            setRefresh(!refresh);
        }
    }

    const eachProductTotalCalculation = (rowId : number) => {
        let newTable : PricingTable | undefined = pricingTable;
        if (newTable){
            let rowModel = newTable.rowModels.find(row => row.rowId === rowId);
            if (rowModel){
                let quantity = 1;
                let price = 0;
                let total = 0;
                const totalColumn = rowModel.columnModels.find(column => column.columName.toLowerCase().includes('total'));
                if (totalColumn){
                    const priceColumn = rowModel.columnModels.find(column => column.columName.toLowerCase().includes('price'));
                    if (priceColumn && !isNaN(parseFloat(priceColumn.value))){
                        const quantityColumn = rowModel.columnModels.find(column => column.columName.toLowerCase().includes('qty') || column.columName.toLowerCase().includes('quantity'));
                        if (quantityColumn && !isNaN(parseFloat(quantityColumn.value))){
                            total = parseFloat(quantityColumn.value) * parseFloat(priceColumn.value);                            
                        }
                        else{
                            total =  parseFloat(priceColumn.value);
                        }
                    }
                    tableValueChangingHandler(rowId, totalColumn.columnId, total.toString(), false);
                }
            }
            grandTotalCalculation();
        }
    }

    const onAggregationRowBorderTypeChanged = (value: string, rowId: number) => {        
        let newTable : PricingTable | any = pricingTable;
        if (newTable){
            for(let i = 0; i < newTable.aggregateRowModels.length ; i++){
                if (newTable.aggregateRowModels[i].rowId === rowId){
                    newTable.aggregateRowModels[i].borderType = value;
                    break;
                }
            }
        }
        setPricingTable(newTable);
        setRefresh(!refresh);
    }

    const aggregateRowHightInputHandler = (rowId : number, value : string) => {        
        let newTable : PricingTable | any = pricingTable;
        if (newTable){
            for(let i = 0; i < newTable.aggregateRowModels.length ; i++){
                if (newTable.aggregateRowModels[i].rowId === rowId){
                    newTable.aggregateRowModels[i].height = Number.parseInt(value);
                    break;
                }
            }
        }
        setPricingTable(newTable);
        setRefresh(!refresh);        
    }
    
    const aggregateRowInputChange = (rowId : number, columnId: number, value: string, isNative : boolean = true) => {
        let applyCalculation : boolean = false;
        let newTable : PricingTable | any = pricingTable;
        for(let i = 0; i < newTable.aggregateRowModels.length ; i++){
            if (newTable.aggregateRowModels[i].rowId === rowId){
                for(let j = 0; j < newTable.aggregateRowModels[i].aggregateColumnModels?.length; j++){
                    if (newTable.aggregateRowModels[i].aggregateColumnModels[j].columnId === columnId){
                        newTable.aggregateRowModels[i].aggregateColumnModels[j].value = value;

                        if (isNative && !newTable.aggregateRowModels[i].aggregateColumnModels[j].isLabel)
                            applyCalculation = true;
                        break;
                    }
                }
                break;
            }
        }
        setPricingTable(newTable);
        setRefresh(!refresh);
        if (applyCalculation)
            grandTotalCalculation();
    }

    const aggregateRowBlurHandler = (rowId : number, columnId: number, value: string) => {
        if (value.toLocaleLowerCase() === 'total'){
            let applyCalculation : boolean = true;
            let newTable : PricingTable | any = pricingTable;
            for(let i = 0; i < newTable.aggregateRowModels.length ; i++){
                if (newTable.aggregateRowModels[i].rowId === rowId){
                    for(let j = 0; j < newTable.aggregateRowModels[i].aggregateColumnModels?.length; j++){
                        if (newTable.aggregateRowModels[i].aggregateColumnModels[j].columnId === columnId && newTable.aggregateRowModels[i].aggregateColumnModels[j].isLabel){
                            newTable.aggregateRowModels[i].aggregateColumnModels[j + 1].disabled = true;
                            break;
                        }
                    }
                    break;
                }
            }
            setPricingTable(newTable);
            setRefresh(!refresh);
            if (applyCalculation)
                grandTotalCalculation();
        }
    }      

    const grandTotalCalculation = () => {
        let finalAmount = 0;
        if (pricingTable?.rowModels){
            for (const row of pricingTable.rowModels) {
                if (!row.isHeader){
                    for (const column of row.columnModels) {
                        if (column.columName.toLocaleLowerCase() === 'total' && !isNaN(parseFloat(column.value)))
                        finalAmount += parseFloat(column.value);
                    }
                }
            }

            const grandTotalRow = pricingTable.aggregateRowModels.find(row => row.aggregateColumnModels.some(column => column.value?.toLocaleLowerCase().includes('total')));
            if (grandTotalRow){
                let discount = 0;
                let tax = 0;
                const discountRow = pricingTable.aggregateRowModels.find(row => row.aggregateColumnModels.some(column => column.value?.toLocaleLowerCase() == 'discount'));
                if (discountRow && !isNaN( parseInt(discountRow.aggregateColumnModels[discountRow.aggregateColumnModels.length - 1].value))) {
                    discount = finalAmount * (parseInt(discountRow.aggregateColumnModels[discountRow.aggregateColumnModels.length - 1].value) / 100);
                    finalAmount -= discount;
                }    
                const taxRow = pricingTable.aggregateRowModels.find(row => row.aggregateColumnModels.some(column => column.value?.toLocaleLowerCase() == 'tax'));
                if (taxRow && !isNaN( parseInt(taxRow.aggregateColumnModels[taxRow.aggregateColumnModels.length - 1].value))) {
                    tax = finalAmount * (parseInt(taxRow.aggregateColumnModels[taxRow.aggregateColumnModels.length - 1].value) / 100);
                    finalAmount += tax;
                }    
                finalAmount = finalAmount >= 0 ? finalAmount : 0;
                aggregateRowInputChange(grandTotalRow.rowId, grandTotalRow.aggregateColumnModels[grandTotalRow.aggregateColumnModels.length - 1].columnId, finalAmount.toString(), false);
            }
        }
    }

    return(                      
        <div className="modal d-block" id="modal">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">{tableCustomizingWindow ? `Table customization` : `Cell customization`}</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
                {
                    tableCustomizingWindow ? (
                        <form>
                            <div className="mt-1 form-group">
                                <label className="form-label">Row size (include header row)</label>
                                <input min={0} type="number" className="form-control" value={rowSize} onChange={(e) => {setRowSize(Number.parseInt(e.currentTarget.value))}} />
                            </div>
                            <div className="mt-1 form-group">
                                <label className="form-label">Column size</label>
                                <input min={0} type="number" className="form-control" value={columnSize} onChange={(e) => {setColumnSize(Number.parseInt(e.currentTarget.value))}} />
                            </div>
                            <div className="mt-3 form-group">
                                <label className="form-label">Aggregate rows size</label>
                                <input min={0} type="number" className="form-control" value={aggregateRowSize} onChange={(e) => {setAggregateRowSize(Number.parseInt(e.currentTarget.value))}} />
                            </div>
                        </form>  
                    ) : (
                        <div>
                            {
                                pricingTable && pricingTable.rowModels ? (
                                    <div>
                                        <span className="fw-bold">Table values</span>
                                        <table>
                                            <thead>
                                                { pricingTable.rowModels.map((row) => 
                                                    row.isHeader && 
                                                    <tr key={row.rowId}>
                                                        { row.columnModels?.map((column) => 
                                                                <th style={{backgroundColor: "#f5f5f5"}} key={column.columnId}>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={column.value}
                                                                        placeholder={column.placeHolder}
                                                                        onBlur={(e) => inputBlurHandler(row.rowId, row.isHeader ,column.columnId, e.target.value)}
                                                                        onChange={(e) => handleInputChange(row.rowId, row.isHeader ,column.columnId, e.target.value)}
                                                                    />
                                                                </th>
                                                            )
                                                        }
                                                    </tr>
                                                )
                                                }
                                            </thead>
                                            <tbody>
                                                { pricingTable.rowModels.map((row) => 
                                                    !row.isHeader && 
                                                    <tr key={row.rowId}>
                                                        { row.columnModels?.map((column) =>                                                                        
                                                            <td key={column.columnId}>
                                                                <input
                                                                    type="text"
                                                                    value={column.value}
                                                                    placeholder={column.placeHolder}
                                                                    className={column.disabled ? "pointer-event-none form-control" : "form-control"}
                                                                    onChange={(e) => handleInputChange(row.rowId, row.isHeader ,column.columnId, e.target.value)}
                                                                />
                                                            </td>)
                                                        }
                                                    </tr>
                                                )
                                                }
                                            </tbody>
                                        </table>
                                        {pricingTable.aggregateRowModels?.length > 0 &&
                                        <div className="pt-3">
                                            <span className="mt-3 fw-bold">Aggregate rows values</span>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th className="fw-normal">Label</th>
                                                        <th className="fw-normal">Value</th>
                                                        <th className="fw-normal">Border type</th>
                                                        <th className="fw-normal">Height</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                    pricingTable.aggregateRowModels.map((rowModel) => 
                                                            (
                                                                <tr key={rowModel.rowId}>
                                                                    {
                                                                        rowModel.aggregateColumnModels &&
                                                                        rowModel.aggregateColumnModels.map((columnModel) =>(
                                                                            columnModel.isAvailable &&
                                                                            <td key={columnModel.columnId}>
                                                                                <input
                                                                                    type="text"
                                                                                    className={columnModel.disabled ? "pointer-event-none form-control" : "form-control"}
                                                                                    value={columnModel.value}
                                                                                    onBlur={(e) => aggregateRowBlurHandler(rowModel.rowId, columnModel.columnId, e.target.value)}
                                                                                    onChange={(e) => aggregateRowInputChange(rowModel.rowId, columnModel.columnId, e.target.value)}
                                                                                />
                                                                            </td>
                                                                        ))
                                                                    }
                                                                    <td>
                                                                        <select onChange={(e) => onAggregationRowBorderTypeChanged(e.currentTarget.value, rowModel.rowId)} value={rowModel.borderType} className="form-select">
                                                                            <option value="NoBorder">No border</option>
                                                                            <option value="RowBorder">Row border</option>
                                                                        </select>
                                                                    </td>
                                                                    <td>
                                                                        <input type="number" className="form-control" value={rowModel.height} onChange={(e) => aggregateRowHightInputHandler(rowModel.rowId, e.currentTarget.value)} />
                                                                    </td>
                                                                </tr>
                                                            )
                                                    )   
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                        }
                                    </div>
                                ) : (
                                    <div></div>
                                )
                            }
                        </div>
                    )
                }
            </div>
            <div className="modal-footer">
                {
                    tableCustomizingWindow ? (
                        <button type="button" className="btn btn-secondary" onClick={dialogClose}>Customize cell</button>
                    ) : (
                        <button type="button" className="btn btn-secondary" onClick={dialogClose}>Generate table</button>
                    )
                }
            </div>
            </div>
        </div>
    </div>  
    );
}

export default DynamicTable;