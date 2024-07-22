import { LightningElement, wire } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';
import { subscribe, MessageContext,unsubscribe } from 'lightning/messageService';
import PARTNER_REVIEW_CHANNEL from '@salesforce/messageChannel/PartnerReviewMessageChannel__c';

import ACCOUNT_NAME from '@salesforce/schema/Account.Name';
import ACCOUNT_CONTRACT_START from '@salesforce/schema/Account.Partner_Contract_Start_Date__c';
import PARTNER_PRIMARY_POC_FIELD from '@salesforce/schema/Account.Partner_Type_Lookup__c';
import Partner_Budget__c_FIELD from '@salesforce/schema/Account.Partner_Budget__c';
import Partner_Total_Sales_Revenue_FIELD from '@salesforce/schema/Account.Partner_Total_Sales_Revenue__c';
import Partner_Active_Pipeline_Value_FIELD from '@salesforce/schema/Account.Partner_Active_Pipeline_Value__c';
import Partner_Contract_End_Date__c_FIELD from '@salesforce/schema/Account.Partner_Contract_End_Date__c';
import Number_of_trained_Partner_contacts__c_FIELD from '@salesforce/schema/Account.Number_of_trained_Partner_contacts__c';
import Partner_Latitude_FIELD from '@salesforce/schema/Account.Partner_Geo_Location__Latitude__s';
import Partner_Longitude_FIELD from '@salesforce/schema/Account.Partner_Geo_Location__Longitude__s';


export default class PartnerDetail extends NavigationMixin(LightningElement) {
   objectApiName = 'Account';
   recordId='';
   subscription = null;

   accountName = ACCOUNT_NAME;
   accContractStartDate = ACCOUNT_CONTRACT_START;
   primarypoc = PARTNER_PRIMARY_POC_FIELD;
   budget = Partner_Budget__c_FIELD;
   salesRevenue = Partner_Total_Sales_Revenue_FIELD;
   activepipeline = Partner_Active_Pipeline_Value_FIELD;
   contractEnd = Partner_Contract_End_Date__c_FIELD;
   totalTrained = Number_of_trained_Partner_contacts__c_FIELD;
   partnerLongitude = Partner_Longitude_FIELD;
   partnerLatitude = Partner_Latitude_FIELD;

   @wire(MessageContext)
   messageContext;

   connectedCallback() {
       this.subscribeToMessageChannel();
   }

   subscribeToMessageChannel() {
       this.subscription = subscribe(
           this.messageContext,
           PARTNER_REVIEW_CHANNEL,
           (message) => this.handleMessage(message)
       );
   }

   disconnectedCallback() {
    if (this.subscription) {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
}

   handleMessage(message) {
    console.log('message', message)
    if(message.accountId){  
       this.recordId = message.accountId;
     }
    }

   get showDetails() {
       return this.recordId ? true : false;
   }

   handleAddPartnerReview(){
    const url = '/flow/give_partner_review?recordId=' + this.recordId;
       this[NavigationMixin.Navigate]({
           type: 'standard__webPage',
           attributes: {
              url: url
           }
       });
    
   }

   handlePartnerReviews(){
       const customEvent = new CustomEvent('partnerreviews', {
           detail: this.recordId    
       })
       this.dispatchEvent(customEvent);
   }

}
