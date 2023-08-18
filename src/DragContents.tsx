import { DragEvent } from 'react';
import './App.css'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

// type DragContentsProps = {
//     onDrag(event : DragEvent<HTMLElement> , content : string) : void; 
// }
function DragContents(){
    function onDrag(event : DragEvent , content : string){
        event.dataTransfer.setData('text/plain', content);
    }
    return(
        <>
            <Tippy content = {<img src={process.env.PUBLIC_URL + '/Pricing_Table_1.png'} alt="Pricing Table" width={330}/>}>
                <p draggable className='drag-content' onDragStart={(e) => onDrag(e , 'pricing-table-1')}>Pricing table 1</p>
            </Tippy>
            <Tippy content = {<img src={process.env.PUBLIC_URL + '/Pricing_Table_2.png'} alt="Pricing Table" width={330}/>}>
                <p draggable className='drag-content' onDragStart={(e) => onDrag(e , 'pricing-table-2')}>Pricing table 2</p>
            </Tippy>
            <p draggable className='drag-content' onDragStart={(e) => onDrag(e , 'dynamic-table')}>Dynamic pricing table</p>
            <p draggable className='drag-content' onDragStart={(e) => onDrag(e , 'signature')}>Signature</p>
            <p draggable className='drag-content' onDragStart={(e) => onDrag(e , 'Name')}>Name</p>
            <p draggable className='drag-content' onDragStart={(e) => onDrag(e , 'Job title')}>Job title</p>
            <p draggable className='drag-content' onDragStart={(e) => onDrag(e , 'Email')}>Email</p>
        </>
    )
}

export default DragContents;