import React ,{ useState } from 'react';
import './App.css'
import { BorderSettings, DocumentEditorContainerComponent , DocumentEditorSettings, Toolbar } from '@syncfusion/ej2-react-documenteditor'
import DragContents from './DragContents'
import Spinner from './Controls/Spinner'
import { PricingTable } from './Models/PricingTable';
import DynamicTable from './Components/DynamicTable';
import SignatureCanvas from 'react-signature-canvas'
import Signature from './Components/Signature'
import Variables from './Components/Variables';
import { Variable } from './Models/Variable';
import { ClickEventArgs } from '@syncfusion/ej2-react-navigations';
import Layout from './Components/Layout';
import { pricingTable1, pricingTable2, signature } from './Service/CommonService';

DocumentEditorContainerComponent.Inject(Toolbar);


function DragAndDropContainer(){
    let documenteditorContainer: DocumentEditorContainerComponent | null;
    let cloneContainer: DocumentEditorContainerComponent | null | any;
    const [visibleSpinner , setVisibleSpinner] = useState(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showSignaturePadModal , setShowSignaturePadModal] = useState(false);
    const [priceTable, setPriceTable] = useState<PricingTable>();
    const settings = { allowDragAndDrop: true };
    const [fieldList, setFieldList] = useState<Variable[]>([
        {
            id : 1,
            field : '<<Name>>',
            fieldValue : ''
        },
        {
            id : 2,
            field : '<<Address>>',
            fieldValue : ''
        },
        {
            id : 3,
            field : '<<Role>>',
            fieldValue : ''
        }
    ]);
    const employees = [
        {
            name : "Vignesh",
            eMail : "vignesh.r@syncfusion.com"
        },
        {
            name : "Naresh kumar",
            eMail : "nareshkumar.p@syncfusion.com"
        },
        {
            name : "Sangavi",
            eMail : "sangavi.d@syncfusion.com"
        }
    ];

    let toolbarOptions: object = ['New', 
        'Open',   
        'Separator', 
        'Undo',
        'Redo',
        'Separator',        
        {
            prefixIcon: 'sf-icon-InsertMergeField',
            tooltipText: 'Insert Field',
            text: onWrapText('Insert Field'),
            id: 'InsertField'
        },
        {
            prefixIcon: 'sf-icon-FinishMerge',
            tooltipText: 'Merge Document',
            text: onWrapText('Merge Document'),
            id: 'MergeDocument'
        },
        'Separator',
        'Image',
        'Table',
        'Hyperlink',
        'Bookmark',
        'TableOfContents',
        'Separator',
        'Header',
        'Footer',
        'PageSetup',
        'PageNumber',
        'Break',
        'Separator',
        'Find',
        'Separator',
        'Comments',
        'TrackChanges',
        'Separator',
        'LocalClipboard',
        'RestrictEditing',
        'Separator',
        'FormFields',
        'UpdateFields',
    ];
    const allBorder: BorderSettings = {
        type: 'AllBorders',
        lineWidth: 0,
        borderColor: '#fff'
    };
    const topBorder: BorderSettings = {
        type: 'TopBorder',
        lineWidth: 0,
        borderColor: '#fff',
    };
    const rightBorder: BorderSettings = {
        type: 'RightBorder',
        lineWidth: 0,
        borderColor: '#fff',
    };
    const leftBorder: BorderSettings = {
        type: 'LeftBorder',
        lineWidth: 0,
        borderColor: '#fff',
    };
    const bottomBorder: BorderSettings = {
        type: 'BottomBorder',
        lineWidth: 0,
        borderColor: '#fff'
    };

    function moveCursorToNextCell() {
        if (documenteditorContainer) {

            // To get current selection start offset
            var startOffset = documenteditorContainer.documentEditor.selection.startOffset;
            var offSet = startOffset.split(';');
            // Increasing cell index to consider next cell
            var cellIndex = parseInt(offSet[3]) + 1;
        
            offSet[3] = cellIndex.toString();
            // Changing start offset
            startOffset = offSet.join(';');
        
            // Navigating selection using select method
            documenteditorContainer.documentEditor.selection.select(startOffset, startOffset);
        }
    }
    
   function moveCursorToNextRow() {
      if (documenteditorContainer) {

            // To get current selection start offset
            var startOffset = documenteditorContainer.documentEditor.selection.startOffset;

            var offSet = startOffset.split(';');
            // Increasing row index to consider next row
            var rowIndex = parseInt(offSet[2]) + 1;
            offSet[2] = rowIndex.toString();
            var cellIndex =  0;
            offSet[3] = cellIndex.toString();
            // Changing start offset
            startOffset = startOffset = offSet.join(';');

            // Navigating selection using select method
            documenteditorContainer.documentEditor.selection.select(startOffset, startOffset);
      }
    }

    function handleClose(){
        setShowSignaturePadModal(false);
    }

    function handleSubmit(imageUrl : string){
        //console.log('submit clicked' , imageUrl);
        if(imageUrl){
            createSignatureLine(imageUrl);
            setShowSignaturePadModal(false);
        }
    }
    
    const dropListener = (e : any) => {
        setVisibleSpinner(true);
        if(e && e.dataTransfer && documenteditorContainer){
            var text = e.dataTransfer.getData('text/plain');
            documenteditorContainer.documentEditor.selection.select({ x: e.offsetX, y: e.offsetY, extend: false });
            var contextType = documenteditorContainer.documentEditor.selection.contextType.toLowerCase();
            //console.log(contextType);
            if(text === 'pricing-table-1'){
                //tableGeneration();
                //console.log(documenteditorContainer.documentEditor.serialize());
                // if(contextType === 'tabletext'){
                //     documenteditorContainer.documentEditor.selection.select({ x: e.offsetX, y: e.offsetY + 200, extend: false });
                // }
                let pricingTable1SFDT = pricingTable1(); // generated table and serialized 
                documenteditorContainer.documentEditor.editor.paste(JSON.stringify(pricingTable1SFDT));
            }
            else if (text === 'pricing-table-2'){
                //tableTwoGeneration();
                //console.log(documenteditorContainer.documentEditor.serialize());
                // if(contextType === 'tabletext'){
                //     documenteditorContainer.documentEditor.selection.select({ x: e.offsetX, y: e.offsetY + 300, extend: false });
                // }
                let pricingTable2SFDT = pricingTable2(); // generated table and serialized 
                documenteditorContainer.documentEditor.editor.paste(JSON.stringify(pricingTable2SFDT));
            }
            else if (text === 'dynamic-table'){
                setShowModal(true);
            }
            else if(text === 'signature'){
                setShowSignaturePadModal(true);
            }
            else if(text === 'field-insert'){
                var field = e.dataTransfer.getData('drag-variable');
                if (field){
                    documenteditorContainer.documentEditor.editor.insertText(field);
                }
            }
            else{
                documenteditorContainer.documentEditor.editor.insertText(text);
            }
        }
        setVisibleSpinner(false);
    }

    const eventListeners = () => {
        var docContainer = document.getElementById("container");
        if(docContainer){
            docContainer.removeEventListener("dragover", (event) => {
                event.preventDefault();
            });
            docContainer.addEventListener("dragover", (event) => {
                event.preventDefault();
            });
    
            docContainer.removeEventListener("drop", dropListener); 
            docContainer.addEventListener("drop", dropListener); 
        }
    }

    // event triggers when document editor container component created
    const onDocumentCreated = (e : any) => {
        toolbar();
        eventListeners();
    }

    function createSignatureLine(imageBase64 : string){
        if(documenteditorContainer){
            // documenteditorContainer.documentEditor.editor.insertTable(1, 1);
            // documenteditorContainer.documentEditor.selection.rowFormat.heightType = 'Exactly';
            // documenteditorContainer.documentEditor.selection.rowFormat.height=80;
            // documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment='Bottom';
            // documenteditorContainer.documentEditor.selection.cellFormat.preferredWidth = 250;
            // documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);
            // documenteditorContainer.documentEditor.editor.applyBorders(rightBorder);
            // documenteditorContainer.documentEditor.editor.applyBorders(topBorder);
            // documenteditorContainer.documentEditor.editor.insertImage(imageBase64,240,70);
            // documenteditorContainer.documentEditor.selection.selectAll();
            // console.log(documenteditorContainer.documentEditor.serialize());
            let signSFDT = signature(imageBase64);
            documenteditorContainer.documentEditor.editor.paste(JSON.stringify(signSFDT));
            
        }
    }
    
    function tableGeneration(){
        const columnSize : number = 5;
        const rowSize : number = 3;
        if (documenteditorContainer){
            documenteditorContainer.documentEditor.editor.insertTable(rowSize + 4, columnSize);

            documenteditorContainer.documentEditor.selection.tableFormat.tableAlignment='Center';
            documenteditorContainer.documentEditor.selection.rowFormat.isHeader=true;
            documenteditorContainer.documentEditor.selection.rowFormat.heightType = 'Exactly';
            documenteditorContainer.documentEditor.selection.rowFormat.height=30;
            
            documenteditorContainer.documentEditor.editor.insertText('Name');
            documenteditorContainer.documentEditor.selection.cellFormat.background='#E0E0E0';
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment='Center';
            documenteditorContainer.documentEditor.selection.characterFormat.bold = true; 

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.editor.insertText('Description');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment='Center';
            documenteditorContainer.documentEditor.selection.cellFormat.background='#E0E0E0';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.editor.insertText('Price');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment='Center';
            documenteditorContainer.documentEditor.selection.cellFormat.background='#E0E0E0';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.editor.insertText('Quantity');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment='Center';
            documenteditorContainer.documentEditor.selection.cellFormat.background='#E0E0E0';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.editor.insertText('Subtotal');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment='Center';
            documenteditorContainer.documentEditor.selection.cellFormat.background='#E0E0E0';

            moveCursorToNextRow();
            documenteditorContainer.documentEditor.selection.rowFormat.heightType = 'Exactly';
            documenteditorContainer.documentEditor.selection.rowFormat.height=30;

            documenteditorContainer.documentEditor.editor.insertText('Item1');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment='Center';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.editor.insertText('Phone');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment='Center';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.editor.insertText('12k');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment='Center';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.editor.insertText('1');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment='Center';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.editor.insertText('12000');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment='Center';

            moveCursorToNextRow();
            documenteditorContainer.documentEditor.selection.rowFormat.heightType = 'Exactly';
            documenteditorContainer.documentEditor.selection.rowFormat.height=30;
            documenteditorContainer.documentEditor.editor.insertText('Item2');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment='Center';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.editor.insertText('Laptop');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment='Center';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.editor.insertText('50k');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment='Center';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.editor.insertText('2');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment='Center';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.editor.insertText('1L');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment='Center';

            // documenteditorContainer.documentEditor.selection.moveToDocumentEnd();
            // documenteditorContainer.documentEditor.editor.insertTable(2,2);

            for(let i = 0; i < 4; i++){
                moveCursorToNextRow();
                documenteditorContainer.documentEditor.selection.rowFormat.heightType = 'Exactly';
                documenteditorContainer.documentEditor.selection.rowFormat.height=20;
                //Apply border for left, right and bottom of first cell.
                documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);
                documenteditorContainer.documentEditor.editor.applyBorders(rightBorder);
                documenteditorContainer.documentEditor.editor.applyBorders(bottomBorder);

                let colCount = 0;
                for(let col = 0; col < columnSize - 1; col++){ //column-1 means already cursor moved to first cell
                    if (col < columnSize - 3){
                        moveCursorToNextCell();
                        if (i === 0){
                            documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);
                            documenteditorContainer.documentEditor.editor.applyBorders(rightBorder);
                            documenteditorContainer.documentEditor.editor.applyBorders(bottomBorder);
                        }
                        else
                            documenteditorContainer.documentEditor.editor.applyBorders(allBorder);
                    }
                    else{
                        moveCursorToNextCell();
                        documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment='Center';
                        if (colCount === 0){
                            colCount++;
                            if (i === 0){
                                documenteditorContainer.documentEditor.editor.insertText('Discount');                                
                                documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);
                                documenteditorContainer.documentEditor.editor.applyBorders(rightBorder);
                                documenteditorContainer.documentEditor.editor.applyBorders(bottomBorder);
                            }
                            else if (i === 1){
                                documenteditorContainer.documentEditor.editor.insertText('Tax');                                
                                documenteditorContainer.documentEditor.editor.applyBorders(allBorder);
                            }
                            else if (i === 2){
                                documenteditorContainer.documentEditor.editor.insertText('Sub total');                                
                                documenteditorContainer.documentEditor.editor.applyBorders(allBorder);
                            }
                            else{
                                documenteditorContainer.documentEditor.selection.characterFormat.bold = true;
                                documenteditorContainer.documentEditor.editor.insertText('Total');                                
                                documenteditorContainer.documentEditor.editor.applyBorders(allBorder);
                            }
                        }
                        else{
                            documenteditorContainer.documentEditor.selection.characterFormat.bold = true;
                            //documenteditorContainer.documentEditor.selection.moveToParagraphEnd();
                            //documenteditorContainer.documentEditor.selection.moveToDocumentEnd();
                            documenteditorContainer.documentEditor.selection.tableFormat.tableAlignment = 'Right';
                            if (i === 0){
                                documenteditorContainer.documentEditor.editor.insertText('$ 0.00');                                                                
                                documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);
                                documenteditorContainer.documentEditor.editor.applyBorders(rightBorder);
                                documenteditorContainer.documentEditor.editor.applyBorders(bottomBorder);
                            }
                            else if (i === 1){
                                documenteditorContainer.documentEditor.editor.insertText('$ 0.00');                                
                                documenteditorContainer.documentEditor.editor.applyBorders(allBorder);
                            }
                            else if (i === 2){
                                documenteditorContainer.documentEditor.editor.insertText('$ 0.00');                                
                                documenteditorContainer.documentEditor.editor.applyBorders(allBorder);
                            }
                            else{
                                documenteditorContainer.documentEditor.editor.insertText('$ 0.00');                                
                                documenteditorContainer.documentEditor.editor.applyBorders(allBorder);
                            }
                        }
                    }
                }
            }
        }
    }

    function tableTwoGeneration() {
        const columnSize: number = 7;
        const rowSize: number = 5;
        if (documenteditorContainer) {
            documenteditorContainer.documentEditor.editor.insertTable(rowSize, columnSize);
            documenteditorContainer.documentEditor.selection.characterFormat.bold = true;
            documenteditorContainer.documentEditor.selection.tableFormat.tableAlignment = 'Center';
            documenteditorContainer.documentEditor.selection.rowFormat.isHeader = true;
            documenteditorContainer.documentEditor.selection.rowFormat.heightType = 'Exactly';
            documenteditorContainer.documentEditor.selection.tableFormat.preferredWidthType = 'Point'
            documenteditorContainer.documentEditor.selection.tableFormat.preferredWidth = 510;
            documenteditorContainer.documentEditor.selection.rowFormat.height = 50;
            documenteditorContainer.documentEditor.selection.cellFormat.rightMargin = 2;

            documenteditorContainer.documentEditor.editor.insertText('Name');
            documenteditorContainer.documentEditor.selection.cellFormat.background = '#E0E0E0';
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment = 'Center';
            documenteditorContainer.documentEditor.selection.characterFormat.bold = true;


            moveCursorToNextCell();
            documenteditorContainer.documentEditor.selection.characterFormat.bold = true;
            documenteditorContainer.documentEditor.editor.insertText('Unit Price');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment = 'Center';
            documenteditorContainer.documentEditor.selection.cellFormat.background = '#E0E0E0';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.selection.characterFormat.bold = true;
            documenteditorContainer.documentEditor.editor.insertText('SetUp Fee');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment = 'Center';
            documenteditorContainer.documentEditor.selection.cellFormat.background = '#E0E0E0';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.selection.characterFormat.bold = true;
            documenteditorContainer.documentEditor.editor.insertText('Billing Cycle');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment = 'Center';
            documenteditorContainer.documentEditor.selection.cellFormat.background = '#E0E0E0';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.selection.characterFormat.bold = true;
            documenteditorContainer.documentEditor.selection.characterFormat.bold = true;
            documenteditorContainer.documentEditor.editor.insertText('Quantity');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment = 'Center';
            documenteditorContainer.documentEditor.selection.cellFormat.background = '#E0E0E0';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.selection.characterFormat.bold = true;
            documenteditorContainer.documentEditor.editor.insertText('Total Price');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment = 'Center';
            documenteditorContainer.documentEditor.selection.cellFormat.background = '#E0E0E0';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.selection.characterFormat.bold = true;
            documenteditorContainer.documentEditor.editor.insertText('Discount');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment = 'Center';
            documenteditorContainer.documentEditor.selection.cellFormat.background = '#E0E0E0';

            moveCursorToNextRow();
            documenteditorContainer.documentEditor.selection.rowFormat.heightType = 'Exactly';
            documenteditorContainer.documentEditor.selection.rowFormat.height = 110;

            documenteditorContainer.documentEditor.editor.insertText('Freevay-High SpeedRouter');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment = 'Center';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.editor.insertText('$1500');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment = 'Center';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.editor.insertText('0');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment = 'Center';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.editor.insertText('Monthly');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment = 'Center';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.editor.insertText('1');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment = 'Center';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.editor.insertText('$1500');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment = 'Center';

            moveCursorToNextCell();
            documenteditorContainer.documentEditor.editor.insertText('0%');
            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment = 'Center';

            for (let i = 0; i < 3; i++) {
                moveCursorToNextRow();
                documenteditorContainer.documentEditor.selection.rowFormat.heightType = 'Exactly';
                documenteditorContainer.documentEditor.selection.rowFormat.height = 20;
                if (i === 0)
                    documenteditorContainer.documentEditor.editor.applyBorders(bottomBorder);
                let colCount = 0;
                for (let col = 0; col < columnSize - 1; col++) { //column-1 means already cursor moved to first cell
                    if (col < columnSize - 3) {
                        moveCursorToNextCell();
                        if (i === 0) {
                            documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);
                            documenteditorContainer.documentEditor.editor.applyBorders(rightBorder);
                            documenteditorContainer.documentEditor.editor.applyBorders(bottomBorder);
                        }
                        else if (i === 1) {
                            documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);
                            documenteditorContainer.documentEditor.editor.applyBorders(rightBorder);

                        }
                        else if (i === 2) {
                            documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);
                            documenteditorContainer.documentEditor.editor.applyBorders(rightBorder);
                        }
                    }
                    else {
                        moveCursorToNextCell();
                        documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment = 'Center';
                        if (colCount === 0) {
                            colCount++;
                            if (i === 0) {
                                documenteditorContainer.documentEditor.selection.characterFormat.bold = true;
                                documenteditorContainer.documentEditor.editor.insertText('Sub total');
                                documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);
                                documenteditorContainer.documentEditor.editor.applyBorders(rightBorder);
                                documenteditorContainer.documentEditor.editor.applyBorders(bottomBorder);
                            }
                            else if (i === 1) {
                                documenteditorContainer.documentEditor.selection.characterFormat.bold = true;
                                documenteditorContainer.documentEditor.editor.insertText('salesTax');
                                documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);
                                documenteditorContainer.documentEditor.editor.applyBorders(rightBorder);
                            }
                            else if (i === 2) {
                                documenteditorContainer.documentEditor.selection.characterFormat.bold = true;
                                documenteditorContainer.documentEditor.editor.insertText('Totalvalue');
                                documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);
                                documenteditorContainer.documentEditor.editor.applyBorders(rightBorder);
                            }


                        }
                        else {

                            //documenteditorContainer.documentEditor.selection.moveToParagraphEnd();
                            //documenteditorContainer.documentEditor.selection.moveToDocumentEnd();
                            documenteditorContainer.documentEditor.selection.tableFormat.tableAlignment = 'Right';
                            if (i === 0) {
                                documenteditorContainer.documentEditor.editor.insertText('$1500');
                                documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);
                                documenteditorContainer.documentEditor.editor.applyBorders(bottomBorder);
                            }
                            else if (i === 1) {
                                documenteditorContainer.documentEditor.editor.insertText('$300');
                                documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);

                            }
                            else if (i === 2) {
                                documenteditorContainer.documentEditor.selection.characterFormat.bold = true;
                                documenteditorContainer.documentEditor.editor.insertText('$1800');
                                documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);


                            }


                        }
                    }
                }
            }

        }
    }
    
    const OpenDocumentWindowHandler = (table : PricingTable) =>{
        setPriceTable(table);
        if (showModal)
            setShowModal(false);
        generateDynamicTable(table);
    }

    const generateDynamicTable = (pricingTable : PricingTable) => {
        if (pricingTable && documenteditorContainer){
            let rowCount = pricingTable.rowSize;
            if (rowCount && pricingTable.aggregateRowModels)
                rowCount += pricingTable.aggregateRowModels.length;
            documenteditorContainer.documentEditor.editor.insertTable(rowCount , pricingTable.columnSize);
            documenteditorContainer.documentEditor.selection.tableFormat.tableAlignment = pricingTable.tableAlignment;

            if (pricingTable.rowModels){        
                for(let i = 0; i < pricingTable.rowModels.length; i++){
                    documenteditorContainer.documentEditor.selection.rowFormat.isHeader = pricingTable.rowModels[i].isHeader;                    
                    documenteditorContainer.documentEditor.selection.rowFormat.heightType = pricingTable.rowModels[i].heightType;
                    documenteditorContainer.documentEditor.selection.rowFormat.height = pricingTable.rowModels[i].height;
                    if (pricingTable.rowModels[i].columnModels){
                        for(let j = 0; j < pricingTable.rowModels[i].columnModels.length; j++){
                            documenteditorContainer.documentEditor.editor.insertText(pricingTable.rowModels[i].columnModels[j].value);
                            documenteditorContainer.documentEditor.selection.cellFormat.background = pricingTable.rowModels[i].columnModels[j].background;
                            documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment = pricingTable.rowModels[i].columnModels[j].verticalAlignment;
                            documenteditorContainer.documentEditor.selection.characterFormat.bold = pricingTable.rowModels[i].columnModels[j].bold;
                            moveCursorToNextCell();
                        }
                    }
                    if(i !== pricingTable.rowModels.length - 1 || pricingTable.aggregateRowModels?.length > 0 ){
                        moveCursorToNextRow();
                    }
                }
            }
            if (pricingTable.aggregateRowModels?.length > 0 && pricingTable.columnSize){
                for(let i = 0; i < pricingTable.aggregateRowModels.length; i++){ 
                    documenteditorContainer.documentEditor.selection.rowFormat.heightType = pricingTable.aggregateRowModels[i].heightType;
                    documenteditorContainer.documentEditor.selection.rowFormat.height = pricingTable.aggregateRowModels[i].height;
                    if (pricingTable.aggregateRowModels[i].aggregateColumnModels.length > 0){
                        for(let j = 0; j < pricingTable.aggregateRowModels[i].aggregateColumnModels.length; j++){
                            if (pricingTable.aggregateRowModels[i].aggregateColumnModels[j].isAvailable){
                                //documenteditorContainer.documentEditor.selection.moveToParagraphEnd();
                                documenteditorContainer.documentEditor.selection.characterFormat.bold = pricingTable.aggregateRowModels[i].aggregateColumnModels[j].bold;
                                documenteditorContainer.documentEditor.selection.cellFormat.background = pricingTable.aggregateRowModels[i].aggregateColumnModels[j].background ?? '';
                                documenteditorContainer.documentEditor.selection.cellFormat.verticalAlignment = pricingTable.aggregateRowModels[i].aggregateColumnModels[j].verticalAlignment;
                                documenteditorContainer.documentEditor.editor.insertText(pricingTable.aggregateRowModels[i].aggregateColumnModels[j].value);
                            }
                            //Customize borders   
                            if (pricingTable.aggregateRowModels[i].borderType === 'NoBorder'){
                                if (pricingTable.aggregateRowModels.some(row => row.borderType === 'RowBorder')){                                   
                                    if(j === 0)
                                        documenteditorContainer.documentEditor.editor.applyBorders(rightBorder);
                                    else if (j === pricingTable.aggregateRowModels[i].aggregateColumnModels.length - 1)
                                        documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);
                                    else{
                                        documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);
                                        documenteditorContainer.documentEditor.editor.applyBorders(rightBorder);
                                    }
                                    documenteditorContainer.documentEditor.editor.applyBorders(bottomBorder);
                                }
                                else{
                                    if (i === 0){
                                        documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);
                                        documenteditorContainer.documentEditor.editor.applyBorders(rightBorder);
                                        documenteditorContainer.documentEditor.editor.applyBorders(bottomBorder);
                                    }
                                    else
                                        documenteditorContainer.documentEditor.editor.applyBorders(allBorder);
                                }
                            }
                            else if (pricingTable.aggregateRowModels[i].borderType === 'RowBorder'){
                                if(j === 0)
                                    documenteditorContainer.documentEditor.editor.applyBorders(rightBorder);
                                else if (j === pricingTable.aggregateRowModels[i].aggregateColumnModels.length - 1)
                                    documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);
                                else{
                                    documenteditorContainer.documentEditor.editor.applyBorders(leftBorder);
                                    documenteditorContainer.documentEditor.editor.applyBorders(rightBorder);
                                }
                            }
                            moveCursorToNextCell();
                        }
                    }
                    if (i !== pricingTable.aggregateRowModels.length - 1)
                        moveCursorToNextRow();
                }
            }
            documenteditorContainer.documentEditor.selection.selectTable();
            let selectedContent: string = documenteditorContainer.documentEditor.selection.sfdt;
            documenteditorContainer.documentEditor.editor.deleteTable();
            documenteditorContainer.documentEditor.editor.paste(selectedContent);
        }
    }
    
    const setFieldValue = (id : number, value : string) => {
        const newList = fieldList.map((field) => field.id === id ? {...field, fieldValue : value} : field);
        setFieldList(newList);
    }

    const addNewFieldHandler = (field : string) => {
        let formattedText = field.replace(/^<*/, '<<');
        formattedText = formattedText.replace(/>*$/, '>>');

        let newList = fieldList;
        if (newList){
            const maxId = newList.reduce((max, customer) => Math.max(max, customer.id), -1);        
            newList.push({id : maxId + 1, field : formattedText, fieldValue : ''})
        }
        else
            newList = [{id : 1, field : formattedText, fieldValue : ''}];
        setFieldList(newList);
    }
    
    const toolbarClickHandler = (args : ClickEventArgs) => {
        switch (args.item.id) {
            case 'MergeDocument':
                mergeDocument();
                break;
            case 'InsertField':
                //InsertField();
                break;
        }
    }

    function toolbar(){
        let item: any = toolbarOptions;
        if(documenteditorContainer){
            //container.documentEditor.open(JSON.stringify(defaultDocument));
            documenteditorContainer.documentEditor.documentName = 'Mail Merge';
            documenteditorContainer.toolbarItems=item;
        };
    }

    function mergeDocument(): void {
        if(documenteditorContainer)
        {
            if (fieldList){
                fieldList.map(field => {
                    if (documenteditorContainer){
                        documenteditorContainer.documentEditor.search.findAll(field.field);
                        if (documenteditorContainer.documentEditor.search.searchResults.length > 0)
                        documenteditorContainer.documentEditor.search.searchResults.replaceAll(field.fieldValue);
                    }
                });
            }
        }
    }

    function mergeCloneDocument(value : string): void {
        if(cloneContainer)
        {
            if (fieldList){
                fieldList.map(field => {
                    if (cloneContainer){
                        cloneContainer.documentEditor.search.findAll(field.field);
                        if (cloneContainer.documentEditor.search.searchResults.length > 0)
                            cloneContainer.documentEditor.search.searchResults.replaceAll(field.fieldValue);
                    }
                });
            }
        }
    }
   
    function onWrapText(text: string): string {
        let content: string = '';
        let index: number = text.lastIndexOf(' ');
        content = text.slice(0, index);
        text.slice(index);
        content += '<div class="e-de-text-wrap">' + text.slice(index) + '</div>';
        return content;
    }
    
    const exportHandler = () => {
        employees.map((employee) => {                
            const clonedElement = React.cloneElement( cloneContainer, { ref: documenteditorContainer });
            const seraialized = documenteditorContainer?.documentEditor.serialize();
            if (cloneContainer){
                if (seraialized){
                    cloneContainer.documentEditor.isReadOnly = false;
                    cloneContainer.documentEditor.open(seraialized);
                    mergeCloneDocument(employee.eMail);
                    cloneContainer.documentEditor.isReadOnly = true;
                    cloneContainer.documentEditor.save('sample-editor-' + employee.name, 'Docx');
                }            
            }
            }
        );
    }
    function save(){
        if(documenteditorContainer){
            documenteditorContainer.documentEditor.save('sample-demo','Docx');
        }
    }
    eventListeners();  
    return(
        <>
            <div className='common-toolbar'>
                <button className='btn btn-primary' onClick={save}>Save</button>
                <div className='ms-auto'>
                    <button className='btn btn-secondary ms-2' onClick={exportHandler}>Export</button>
                </div>
            </div>
            {visibleSpinner && <Spinner />}
            <div id="drag-and-drop-container">
                <Layout  fieldList={fieldList} setFieldValue={setFieldValue} addNewFieldHandler={addNewFieldHandler}/>
                <div className='document-editor'>
                    <DocumentEditorContainerComponent documentEditorSettings={settings} toolbarClick={toolbarClickHandler} id='container' created={ (e:any) => onDocumentCreated(e) } ref={(e:any) => { documenteditorContainer = e;}}  enableToolbar = {true} height={'100%'} />  
                </div>
            </div>
            {
                showModal && 
                <DynamicTable openDocumentEditorHandler={OpenDocumentWindowHandler} showModal={setShowModal}></DynamicTable>
            }
            {
                showSignaturePadModal && 
                <Signature close={handleClose} submit={ handleSubmit }/>
            }
            <div className='height-0 position-fixed'>                
                <DocumentEditorContainerComponent id='clone-container' ref={(e:any) => { cloneContainer = e;}}  enableToolbar={false} height={'0px'} />
            </div>
        </>
    )
}

export default DragAndDropContainer;