

import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import LEAFLET from '@salesforce/resourceUrl/leaflet';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

export default class PartnerLocation extends LightningElement {
    @api partnerAccountId;
    latitude;
    longitude;
    leafletMap;
    isMapAvailable = false;

    @wire(getRecord, { recordId: '$partnerAccountId', fields: ['Account.Partner_Geo_Location__Latitude__s', 'Account.Partner_Geo_Location__Longitude__s'] })
    processOutput({ data, error }) {
        if (data) {
            this.latitude = data.fields.Partner_Geo_Location__Latitude__s.value;
            this.longitude = data.fields.Partner_Geo_Location__Longitude__s.value;
            this.isMapAvailable = !!(this.latitude && this.longitude);
        } else if (error) {
            console.error(error);
        }
    }

    connectedCallback() {
        if (this.isMapAvailable) {
            Promise.all([
                loadScript(this, LEAFLET + '/leaflet.js'),
                loadStyle(this, LEAFLET + '/leaflet.css')
            ])
            .then(() => { this.plotMap(); })
            .catch(error => { console.error(error); });
        }
    }

    plotMap() {
        const map = this.template.querySelector('.map');
        if (map) {
            this.leafletMap = L.map(map, { zoomControl: true }).setView([this.latitude, this.longitude], 13);
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { attribution: 'Contact Location' }).addTo(this.leafletMap);
            const leafletMarker = L.marker([this.latitude, this.longitude]);
            leafletMarker.addTo(this.leafletMap);
            this.leafletMap.setView([this.latitude, this.longitude]);
        }
    }
}
