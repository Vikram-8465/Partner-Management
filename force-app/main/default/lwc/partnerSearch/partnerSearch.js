import { LightningElement, wire } from 'lwc';
import partnerTypes from '@salesforce/apex/getPartnerTypes.partnerTypes';
import {NavigationMixin} from 'lightning/navigation';

export default class PartnerSearch extends NavigationMixin(LightningElement) {
    searchOptions;

    @wire(partnerTypes)
    partnerTypes({ error, data }) {
        if (error) {
            console.error(error);
        } else if (data) {
            this.searchOptions = data.map(type => ({ label: type.Name, value: type.Id }));
            console.log(data);
        }
    }

    handleSearchChange(event) {
        const partnerType = event.detail.value;
        const customEvent = new CustomEvent('search', {
            detail: partnerType
        })
        this.dispatchEvent(customEvent);
    }
  
    handleAddRelationship(event) {
     const {name} = event.target;
       switch (name) {
           case 'partnerType': this.navigation('Partner_Type__c');
               break;
           case 'account': this.navigation('Account');
               break;
           case 'contact': this.navigation('Contact');
               break;
           default: break;
       }
    }

    navigation(objectApiName, actionName = 'new', type = 'standard__objectPage') {
        console.log(objectApiName, actionName, type);
        this[NavigationMixin.Navigate]({
            type: type,
            attributes: {
                objectApiName: objectApiName,
                actionName: actionName
            }
        });
       
    }
}