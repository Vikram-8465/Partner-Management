import { LightningElement, wire, api } from 'lwc';
import getPartnerAccounts from '@salesforce/apex/getPartners.getPartnerAccounts';
import { publish, MessageContext } from 'lightning/messageService';
import PARTNER_REVIEW_CHANNEL from '@salesforce/messageChannel/PartnerReviewMessageChannel__c';

export default class PartnerSearchResult extends LightningElement {
    @api
    partner;  
    selectedCard;
    partners = [];

    @wire(MessageContext)
    messageContext;

    @wire(getPartnerAccounts, {partnerTypeId: '$partner'})
    getPartnerAccounts({ error, data }) {
        if (error) {
            console.error(error);
        } else if (data) {
            this.partners = data.map(account => ({ 
                ...account,
                style : this.getPartnerTypes(account.Partner_Type_Lookup__r.Name),
                imgUrl : this.getImageUrl(account.Contacts.Salutation)
            }));  
            console.log(JSON.stringify(data));
        }
    }

    get getPartners() {
        return this.partners.length > 0 ? true : false;
    }

    handlePartnerClick(event) {
        // Remove border from the previously selected card
        if (this.selectedCard) {
            this.selectedCard.classList.remove('selected-card');
        }

        // Add border to the currently clicked card
        const currentCard = event.currentTarget;
        currentCard.classList.add('selected-card');
         // Save the currently clicked card as the selected card
         this.selectedCard = currentCard;

        // Publish a message to the PartnerReviewMessageChannel__c message channel
        if(currentCard.dataset.id) {
            const message = {
                accountId: currentCard.dataset.id
            };
            publish(this.messageContext, PARTNER_REVIEW_CHANNEL, message);
    
        }
        
       
    }

    getPartnerTypes(type) {
        if(type) {
            switch(type) {
                case 'Distributors':
                    return 'background-color: green; color: white';
                case 'Technology Partner':
                    return 'background-color: red; color: white';
                case 'Client Advocates':
                    return 'background-color: blue; color: white';
                case 'Affiliates':  
                    return 'background-color: violet; color: white';
                default:
                    return 'background-color: black; color: white';
            } 
        }
       
    }

    getImageUrl(salotaion){
         const randomNumber = Math.floor(Math.random() * 100);
        switch (salotaion) {
            case 'Mr.' : 
               return `https://randomuser.me/api/portraits/men/${randomNumber}.jpg`;
            case 'Ms.':
               return `https://randomuser.me/api/portraits/women/${randomNumber}.jpg`;
            default: 
               return `https://randomuser.me/api/portraits/men/${randomNumber}.jpg`;
        }
    }
}