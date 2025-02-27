public with sharing class getPartners {

    @AuraEnabled(cacheable=true)
    public static List<Account> getPartnerAccounts(String partnerTypeId){
        
        if(!String.isEmpty(partnerTypeId)){
            return [SELECT Id, Name, Partner_Type_Lookup__c, Partner_Type_Lookup__r.Name, Partner_Budget__c, Partner_Total_Sales_Revenue__c, Partner_Active_Pipeline_Value__c,
            Partner_Primary_POC__c, Partner_Primary_POC__r.Name,Partner_Primary_POC__r.title, Partner_Primary_POC__r.Salutation, Partner_Contract_Start_Date__c, Partner_Contract_End_Date__c, Partner_Training_Completed__c, 
            Partner_Status__c, Number_of_trained_Partner_contacts__c, Partner_WebSite__c, Partner_Geo_Location__Latitude__s, 
            Partner_Geo_Location__Longitude__s, Partner_Geo_Location__c,
            (Select FirstName,LastName,title,Salutation from Contacts) FROM Account
           WHERE Partner_Status__c IN ('Active','Inactive','Pending') AND Partner_Type_Lookup__c =: partnerTypeId];
        }
        return new list<account>();
    }
}