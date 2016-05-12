'use strict';

angular.module('contactApp.contacts', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/contacts', {
    templateUrl: 'contacts/contacts.html',
    controller: 'ContactsCtrl'
  });
}])

// Contacts controller
.controller('ContactsCtrl', function($scope, $firebaseArray) {
    //init firebase
     var ref = new Firebase('https://contactrep.firebaseio.com/contacts');
    //Get Contacts
    $scope.contacts = $firebaseArray(ref);
    //console.log($scope.contacts);
    
    // Show Add form 
    $scope.showAddForm = function(){
        $scope.addFormShow = true;
    }
    
     // Edit form 
    $scope.showEditForm = function(contact){
        $scope.editFormShow = true;
        
        $scope.id             = contact.$id;
        $scope.name           = contact.name;
        $scope.email          = contact.email;
        $scope.company        = contact.company;
        $scope.work_phone     = contact.phones[0].work_phone;
        $scope.mobile_phone   = contact.phones[0].mobile_phone;
        $scope.home_phone     = contact.phones[0].home_phone;
        $scope.city           = contact.address[0].city;
        $scope.street_address = contact.address[0].street_address;
        
    }
    // Hide form
    $scope.hide = function(){
        $scope.addFormShow = false; 
        $scope.contactShow = false;
        
    }
    // Submit Contacts
    $scope.addFormSubmit = function() {
        console.log('adding contact');
  
    // Assign value
    if($scope.name){ var name = $scope.name } else { var name = null; }
    if($scope.email){ var email = $scope.email } else { var email = null; }
    if($scope.company){ var company = $scope.company } else { var company = null; }
    if($scope.work_phone){ var work_phone = $scope.work_phone } else { var work_phone = null; }
    if($scope.mobile_phone){ var mobile_phone = $scope.mobile_phone } else { var mobile_phone = null; }
    if($scope.home_phone){ var home_phone = $scope.home_phone } else { var home_phone = null; }
    if($scope.city){ var city = $scope.city } else { var city = null; }
    if($scope.street_address){ var street_address = $scope.street_address } else { var street_address = null; }
    
    // Build Object
    
    $scope.contacts.$add({
        name: name,
        email: email,
        company: company,
        phones: [
            {
            work_phone: work_phone,
            mobile_phone: mobile_phone,
            home_phone: home_phone
            }
        ],
        address: [
            {
            city: city,
            street_address: street_address
            }
        ] 
    }).then(function(ref){
        var id = ref.key();
        console.log('added contact with ID: ' +id);
        
       //Clear form
        clearFields();
        // Hide form
        
        $scope.addFormShow = false;
        
        // send msg
        $scope.msg='Contact added';
         
    });
   }
    
    $scope.editFormSubmit = function(){
        console.log('Updating contact..');
        
        //Get ID
        var id = $scope.id;
        
        // Get record
        var record = $scope.contacts.$getRecord(id);
        
        // Assign Values
        
        record.name                                = $scope.name ;
        record.email                               = $scope.email;
        record.company                             = $scope.company;
        record.phones[0].work_phone                = $scope.work_phone;
        record.phones[0].mobile_phone              = $scope.mobile_phone;
        record.phones[0].home_phone                = $scope.home_phone;
        record.address[0].city                     = $scope.city;
        record.address[0].street_address           = $scope.street_address;
        
        // Save contact
        
        $scope.contacts.$save(record).then(function(ref){
            console.log(ref.key);
        });
        
        clearFields();
        
        // Hide form
        $scope.editFormShow = false;
        
        $scope.msg = "contact updated";
        
    }
    
    $scope.showContact = function(contact){
        console.log('getting contact ...');
        
        $scope.name           = contact.name;
        $scope.email          = contact.email;
        $scope.company        = contact.company;
        $scope.work_phone     = contact.phones[0].work_phone;
        $scope.mobile_phone   = contact.phones[0].mobile_phone;
        $scope.home_phone     = contact.phones[0].home_phone;
        $scope.city           = contact.address[0].city;
        $scope.street_address = contact.address[0].street_address;
        
        $scope.contactShow = true;
    }
    
    $scope.removeContact = function(contact){
        console.log('Removing contact...');
        
        $scope.contacts.$remove(contact);
        
        $scope.msg = "contact removed";
        
    }
    // clear scope fields
   function clearFields() {
       console.log('clearing all fields...')
        $scope.name = '';
        $scope.email = '';
        $scope.company = '';
        $scope.work_phone = ''; 
        $scope.mobile_phone = '';
        $scope.home_phone = ''; 
        $scope.city = '';
        $scope.street_address = '';
    

        
    }
    
});