import { LightningElement, wire, api } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';
import getPartnerReviews from '@salesforce/apex/getPartnerReviews.PartnerReviews';

export default class ViewPartnerReviews extends LightningElement {
    @api partnerAccountId;
    partnerAccountReviews = [];
    partnerReviewsFound = false;
    currentReviewIndex = 0;

    @wire(getPartnerReviews, { partnerAccountId: '$partnerAccountId' })
    reviews({ error, data }) {
        if (error) {
            console.error(error);
        } else if (data) {
            this.partnerAccountReviews = data;
            this.partnerReviewsFound = data.length > 0;
            this.updateDisplayedReview();
        }
    }

    
    get currentReview() {
        return this.partnerAccountReviews[this.currentReviewIndex];
    }

    get isPreviousDisabled() {
        return this.currentReviewIndex === 0;
    }

    get isNextDisabled() {
        return this.currentReviewIndex === this.partnerAccountReviews.length - 1;
    }

    get showDetails() {
        return this.currentReview ? true : false;
    }

    nextHandler() {
        if (this.currentReviewIndex < this.partnerAccountReviews.length - 1) {
            this.currentReviewIndex++;
            this.updateDisplayedReview();
        }
    }

    previousHandler() {
        if (this.currentReviewIndex > 0) {
            this.currentReviewIndex--;
            this.updateDisplayedReview();
        }
    }

    updateDisplayedReview() {
        // Trigger reactivity
        this.partnerAccountReviews = [...this.partnerAccountReviews];
    }

    addReview() {
        const url = '/flow/give_partner_review?recordId=' + this.recordId;
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
               url: url
            }
        });
     
    }
}