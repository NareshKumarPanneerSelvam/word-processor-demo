export interface TemplateElement{
    id : string;
    type : string;
    selected? : boolean;
    style : Style;
    innerHtml? : string | any;
    eventHandler : DragEvent;
}

export interface Style{
    color? : string;
    padding? : string;
    background? : string;
    border? : string;
    fontSize? : number | string;
    top : number | string;
    left : number | string;
    right? : number | string;
    bottom? : number | string;
    boxShadow?:string;
}


export interface PaddingDirection{
    top : number;
    left : number;
    bottom : number;
    right : number;
}