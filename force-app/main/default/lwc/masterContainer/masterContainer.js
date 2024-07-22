import { LightningElement } from 'lwc';

export default class MasterContainer extends LightningElement {

    partnerType;

    handleSearch(event) {  
        if(event) {
            this.partnerType = event.detail;
            console.log('event:',event);
        } 
    }
}