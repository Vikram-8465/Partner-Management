public with sharing class getPartnerTypes {

   @AuraEnabled(cacheable = true)
   public static List<Partner_Type__c> partnerTypes(){
    try {
         return [Select Id,Name From Partner_Type__c limit 50000];
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
         }
   }
}  