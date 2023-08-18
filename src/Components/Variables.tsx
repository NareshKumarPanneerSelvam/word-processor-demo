import { useState, DragEvent } from "react";
import { Variable } from "../Models/Variable";

interface Props{
    fieldList : Variable[];
    setFieldValue(id : number, value : string) : void;
    addNewFieldHandler(field : string) : void;
}

function Variables({fieldList, setFieldValue, addNewFieldHandler}: Props){
    const [addNewModal, setAddNewModal] = useState<boolean>(false);
    const [newVariable, setNewVariable] = useState<string>('');
    const [searchText, setSearchText] = useState<string>('');
    const [newFieldValidation, setNewFieldValidation] = useState<boolean>(false);

    const onDrag = (event : DragEvent , content : string, field : Variable) => {
        //setDragItem(field);
        event.dataTransfer.setData('text/plain', content);
        event.dataTransfer.setData('drag-variable', field.field);
    }  

    const newVariableButtonHandler = () => {
        setNewVariable(''); 
        setAddNewModal(true);
    }
    
    const newFieldInputHandler = (value : string) => {
        if (value.includes(' '))
            value = value.replace(' ','');
        setNewVariable(value);
        let formattedText = value.replace(/^<*/, '<<');
        formattedText = formattedText.replace(/>*$/, '>>');
        if (fieldList && fieldList.some(field => field.field.toLocaleLowerCase() === formattedText.toLocaleLowerCase()))
            setNewFieldValidation(true);
        else if (newFieldValidation)
            setNewFieldValidation(false);
    }

    return(
        <>
            <div id="variable-modal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="modal-title fw-bold py-1">Variables</span>
                        </div>
                        <div className="modal-body">
                            <div className="d-flex align-items-center">
                                <input type='text' value={searchText} onInput={e => setSearchText(e.currentTarget.value)} placeholder="Search..." className="form-control search-box"></input>
                                <img onClick={newVariableButtonHandler} className="fw-bold add-btn" src="../../plus-icon.png" />
                            </div>
                            <div className="flex-wrap">
                                {fieldList?.length > 0 &&
                                    fieldList.filter(field => field.field.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())).map((field) =>
                                        <div key={field.id} draggable={true} className="field-wrapper" onDragStart={e => onDrag(e, 'field-insert', field)}>
                                            <span className="variable-field-text">{field.field}</span>
                                            <input type='text' className="form-control" value={field.fieldValue} onChange={e => setFieldValue(field.id, e.target.value)} />
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                addNewModal && 
                <div className="modal d-block" id="modal">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <span className="modal-title fw-bold">Add new variable</span>
                                <button type="button" className="btn-close fw-bold" onClick={e => setAddNewModal(false)}></button>
                            </div>
                            <div className="modal-body new-variable">
                                <input autoFocus placeholder="Add..." className="form-control" type='text' value={newVariable} onInput={e => newFieldInputHandler(e.currentTarget.value)} />
                                <small style={{height:'6px', color:'red', display:'block'}}>
                                    {newFieldValidation && `This varaible is already exists!`}
                                </small>
                            </div>
                            <div className="modal-footer">
                                <button style={{width:'80px'}} className="btn btn-secondary" onClick={e => setAddNewModal(false)}>Cancel</button>
                                <button style={{width:'80px'}} disabled={!(newVariable.length > 0) || newFieldValidation} onClick={e => {setAddNewModal(false); addNewFieldHandler(newVariable)}} className="btn btn-success">Add</button>
                            </div>
                        </div>
                    </div>
                </div>
                                
            }
        </>
    );
}

export default Variables;