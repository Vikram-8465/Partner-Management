import { LightningElement } from 'lwc';

export default class CardDetail extends LightningElement {
    recordId;

    handlePartnerReviews(event){
        this.recordId = event.detail;
    }
}