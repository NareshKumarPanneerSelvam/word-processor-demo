import React ,{ useState , useEffect } from 'react';
import '../App.css';
import SignatureCanvas from 'react-signature-canvas';
import {measureTextWidth , measureTextHeight, resizeImage} from '../Service/CommonService';
import { FileInfo, SelectedEventArgs, UploaderComponent } from '@syncfusion/ej2-react-inputs';


type SignatureProps = {
    close() : void,
    submit(url : string) : void
}
function Signature({close , submit} : SignatureProps){
    const [activeButton, setActiveButton] = useState(0);
    const [selectedSign , setSelectedSign] = useState(1);
    const [name,setName] = useState<string>('your name');
    const [fontFamily,setFontFamily] = useState<string>('Sacramento');
    const [showPreview , setShowPreview] = useState<boolean>(false);
    const [previewImageSrc , setPreviewImageSrc] = useState<string | null>('');

    let signatureCanvasRef : SignatureCanvas | null;
    //let uploadObj: UploaderComponent | null;

    //canvas
    let offscreenCanvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
  

    useEffect(() => {
        calculateFontSize(name);
        setActiveButton(0);
    },[])

    const handleButtonClick = (buttonIndex:number) => {
        setActiveButton(buttonIndex);
        if(activeButton === 0){
            setTimeout(() => calculateFontSize(name),1000)
          }
    };
    
    function clearSignature(){
        if(signatureCanvasRef && activeButton === 1){
            signatureCanvasRef.clear();
        }
    }
    
    function calculateFontSize(text : string){
        const divs = document.querySelectorAll('.signature-type') as NodeListOf<HTMLDivElement>;
        if(divs.length > 0){
            const sampleDiv = divs[0]; // Take any one of the divs as a sample
            if(sampleDiv){
                const containerWidth = sampleDiv.clientWidth - 20; // Subtract twice the padding (10px on each side)
                const containerHeight = sampleDiv.clientHeight - 20; // Subtract twice the padding (10px on top and bottom)
                
                const textWidth = measureTextWidth(text);
                const textHeight = measureTextHeight(text);
            
                const fontSizeWidth = (containerWidth / textWidth);
                const fontSizeHeight = (containerHeight / textHeight);
                
                // Use the smaller font size to ensure the text fits both width and height
                const fontSize = Math.min(fontSizeWidth, fontSizeHeight).toString();
                divs.forEach((div) => {
                    div.style.fontSize = fontSize + 'rem'; 
                });
            }
        }
    }

    function handleNameChange(e : React.ChangeEvent<HTMLInputElement>){
        calculateFontSize(e.target.value);
        setName(e.target.value);
    }

    function handleSubmit(){
        if(activeButton === 0){
            offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = 250; // Adjust the width as needed
            offscreenCanvas.height = 60; // Adjust the height as needed
            context = offscreenCanvas.getContext('2d')!;
            context.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
            const maxWidth = 230; // Maximum width of the image
            const maxHeight = 70; // Maximum height of the image
        
            let fontSize = 48; // Initial font size
            let textMetrics;
        
            while (true) {
              // Calculate text dimensions with the current font size
              context.font = `400 ${fontSize}px ${fontFamily}, cursive`;
              textMetrics = context.measureText(name);
        
              if (textMetrics.width <= maxWidth && fontSize <= maxHeight) {
                break;
              }
        
              // Reduce font size to fit within canvas dimensions
              fontSize -= 2; // Adjust step as needed
            }
        
            // Set the custom font family and calculated font size
            context.font = `400 ${fontSize}px ${fontFamily}, cursive`;
        
            // Draw the text in the center of the image
            const x = (offscreenCanvas.width - textMetrics.width) / 2;
            const y = (offscreenCanvas.height + fontSize) / 2 - 20;
            context.fillText(name, x, y);
            const url = offscreenCanvas.toDataURL();
            submit(url);
        }
        else if(activeButton === 1 && signatureCanvasRef){
            var imageUrl = signatureCanvasRef.toDataURL();
            signatureCanvasRef.clear();
            submit(imageUrl);
        }
        else if(activeButton ===2 && previewImageSrc){
            submit(previewImageSrc)
        }
    }

    function handleSelectedSign(index : number , fontFamily : string){
        setSelectedSign(index);
        setFontFamily(fontFamily);
    }

    // Event triggers when file uploaded 
    function onSelected(args: SelectedEventArgs): void {
        const allImages = ['png', 'jpg', 'jpeg'];
        const files = args.filesData;
        for (const file of files) {
            if (allImages.indexOf(file.type.toLowerCase()) === -1) {
                file.status = 'File type is not allowed';
                file.statusCode = '0';
            }
            else{
                let fileInfo:FileInfo = files[0];
                const img: any = document.createElement("img");
                const reader: any = new FileReader();
                reader.onload = (e: any) => {
                  img.src = e.target.result;
                };
                reader.readAsDataURL(fileInfo.rawFile);
                img.onload = function() {
                    setPreviewImageSrc(resizeImage(this.height, this.width, img,300,100));
                    setShowPreview(true);
                };
            }
        }
        args.isModified = true;
    }

    //To remove uploaded image
    function removeImage(){
        setShowPreview(false);
        setPreviewImageSrc(null);
    }
  
    return(
        <div className={`modal fade show d-block`} id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Signature</h5>
                    <button type="button" className="btn-close" onClick={close}></button>
                </div>
                <div className="modal-body">
                {
                    <>
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className={`btn btn-secondary ${activeButton === 0 ? 'active' : ''}`} onClick={() => handleButtonClick(0)}>
                                Type
                            </button>
                            <button type="button" className={`btn btn-secondary ${activeButton === 1 ? 'active' : ''}`} onClick={() => handleButtonClick(1)}>
                                 Draw
                            </button>
                            <button type="button" className={`btn btn-secondary ${activeButton === 2 ? 'active' : ''}`} onClick={() => handleButtonClick(2)}>
                                Upload
                            </button>
                        </div>

                        {
                            activeButton !== null && 
                            (
                                <div className="mt-3">
                                    {/* Display the corresponding content for the active button */}
                                    {
                                        activeButton === 0 && 
                                        <div id='button-type-container'>
                                            <div className='name-input-container'>
                                                <label>Your name</label>
                                                <input type='text' className='name-input' value={name} onChange={(e)=> handleNameChange(e)}/>
                                            </div>
                                            <div id="signature-group-container" role="group">
                                                <div className='row first-row'>
                                                    <div className={`col signature-type type-1 ${selectedSign === 1 ? 'active' : ''}`} onClick={()=> handleSelectedSign(1,'Sacramento')}>
                                                        {name}
                                                    </div>
                                                    <div className={`col signature-type type-2 ${selectedSign === 2 ? 'active' : ''}`}  onClick={()=> handleSelectedSign(2,'Allura')}>
                                                        {name}
                                                    </div>
                                                </div>
                                                <div className='row second-row'>
                                                    <div className={`col signature-type type-3 ${selectedSign === 3 ? 'active' : ''}`}  onClick={()=> handleSelectedSign(3,'Great vibes')}>
                                                        {name}
                                                    </div>
                                                    <div className={`col signature-type type-4 ${selectedSign === 4 ? 'active' : ''}`}  onClick={()=> handleSelectedSign(4,'Dancing script')}>
                                                        {name}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {
                                        activeButton === 1 && 
                                        <>
                                            <p id='sign-clear' onClick={ clearSignature }>Clear</p>
                                            <div id='button-draw-container'>
                                                <SignatureCanvas ref={(ref) => { signatureCanvasRef = ref }} penColor='black'
                                                    canvasProps={{width: 300, height: 80, className: 'signature-canvas'}} /> 
                                            </div>
                                        </>
                                    }
                                    {
                                        activeButton === 2 && 
                                        <div id='button-upload-container'>
                                            {
                                                !showPreview && 
                                                <UploaderComponent id='fileUpload' selected={ onSelected }/>
                                            }
                                            {
                                                showPreview && previewImageSrc &&
                                                <div>
                                                    <p id='upload-remove' onClick={ removeImage }>Remove</p>
                                                    <div className='d-flex align-items-center justify-content-center'>
                                                        <img src={previewImageSrc} alt=''/>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            )
                        }
                    </>
                }
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={ close }>Close</button>
                    <button type="button" className="btn btn-secondary" onClick={ handleSubmit }>Submit</button>
                </div>
                </div>
            </div>
        </div> 
    )
}

export default Signature;