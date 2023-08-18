import { IconType } from "react-icons/lib/esm/iconBase";
import { TabType } from "./CustomTypes";

export interface TabModel{
    id : number,
    headerText : string,
    type : TabType,
    selected : boolean,
}