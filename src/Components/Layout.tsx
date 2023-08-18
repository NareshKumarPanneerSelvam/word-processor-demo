import { SelectedEventArgs } from "@syncfusion/ej2-react-inputs";
import { TabComponent, TabItemDirective, TabItemsDirective } from "@syncfusion/ej2-react-navigations";
import { useEffect, useState } from "react";
import { TabModel } from "../Models/TabModel";
import {AiFillPlusCircle} from 'react-icons/ai'
import DragContents from "../DragContents";
import Variables from "./Variables";
import { Variable } from "../Models/Variable";

interface Props{
    fieldList : Variable[];
    setFieldValue(id : number, value : string) : void;
    addNewFieldHandler(field : string) : void;
}

function Layout({fieldList, setFieldValue, addNewFieldHandler}: Props){
    const [selectedTab, setSelectedTab] = useState<TabModel>();
    const [tabItems, setTabItems] = useState<TabModel[]>([
        { id: 1, headerText: "Elements", type : 'Elements', selected : true },
        { id: 2, headerText: "Variable", type : 'Variables', selected : false }
    ]);
    let tabRefernece : TabComponent | null;

    useEffect(() => {
        setSelectedTab(tabItems.find(tab => tab.selected));
    }, [tabItems])
    

    const tabSelectHandler = (tab : TabModel) => {
        const updatedTabs : TabModel[] = tabItems.map((tabItem) => 
            tabItem.id === tab.id ? 
            (tabItem.selected ? tabItem : {...tabItem, selected : true})  :
            (tabItem.selected ? {...tabItem, selected : false} : tabItem) );
        console.log(updatedTabs);
        setTabItems(updatedTabs);
    }

    return (
        <div className='drag-contents'>
            <div className='custom-tab'>
                <div className="tab-items">
                    {tabItems.map((tabItem) => 
                        <div key={tabItem.id} className={tabItem.selected ? "tab-item active" : "tab-item"} onClick={e => tabSelectHandler(tabItem)}>{tabItem.headerText}</div>
                    )}
                </div>
            </div>
            {
                selectedTab?.type === 'Elements' ? ( 
                    <DragContents />
                )  : selectedTab?.type === 'Variables' ? (
                    <Variables fieldList={fieldList} setFieldValue={setFieldValue} addNewFieldHandler={addNewFieldHandler} />
                    ) : (
                    <></>
                )
            }
        </div>
    );
}

export default Layout;