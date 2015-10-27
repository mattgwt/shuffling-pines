var app = angular.module('shuffling', []);

// Tab manager, provides interface to change/update the current tab
app.service('tabManager', function(){
	var pane = "form";
	
	return {
		// Set the active pane to a new value
		setPane: function(value){
			pane = value;
		},
		// Get the current active pane
		curPane: function(value){
			return value === pane;	
		}
	};
});

// Data manager service. Handles adding, updating, deleting guests
app.service('dataManager', function() {
	var guests_arr = [];
	var guestStorage = localStorage;
	
	// Populate the database with a few sample records
	// called when the FormController loads
	var initializeDB = function(){
		guestStorage.clear();
		
		var guestData1 = { 'id' : 1,
						 'name' : 'John Smith',
						 'date' : '2015-10-15',
						 'status' : 'pickup',
						 'location' : 'Behind the grocery store',
						 'deleted' : false };		
		
		var guestData2 = { 'id' : 2,
						 'name' : 'Jane Doe',
						 'date' : '2015-10-25',
						 'status' : 'dropoff',
						 'location' : 'Out front of her house',
						 'deleted' : false };
		
		var guestData3 = { 'id' : 3,
						 'name' : 'Bob',
						 'date' : '2015-11-20',
						 'status' : 'arrived',
						 'location' : 'At the clinic',
						 'deleted' : true };
		
		guestStorage.setItem(guestData1.id, JSON.stringify(guestData1));
		guestStorage.setItem(guestData2.id, JSON.stringify(guestData2));
		guestStorage.setItem(guestData3.id, JSON.stringify(guestData3));
		
		refreshGuests();
	};
	
	// Clear the DB
	var clearDB = function(){
		guestStorage.clear();	
	};
	
	// Add a new guest
	var saveGuest = function(name, date, status, location){
		var id = guestStorage.length + 1;
		var guestData = { 'id' : id,
						 'name' : name,
						 'date' : date,
						 'status' : status,
						 'location' : location,
						 'deleted' : false };

		guestStorage.setItem(id, JSON.stringify(guestData));

		refreshGuests();
	};
	
	// Return the array of guests
	var getGuests = function(){
		return guests_arr;	
	};
	
	// Function for testing: return a single guest json object by key
	var test_getGuest = function(key){
		return JSON.parse(guestStorage.getItem(key));
	};
	
	// Update the array of guests
	var refreshGuests = function(){
		guests_arr = [];
		
		for( var i = 0; i < guestStorage.length; i++){
			var guest = guestStorage.getItem(guestStorage.key(i));
			
			try {
				if(guest) {
					guests_arr.push(JSON.parse(guest));
				}
			} catch(ex) {  }
		}
	};
	
	// Delete a guest (soft delete, set delete flag to 1)
	var deleteGuest = function(guestID){
		// return true on success, false on failure
		var guestData = guestStorage.getItem(guestID);

		if(guestData === null)
			return false;
		
		guestData = JSON.parse(guestData);
		
		guestData.deleted = true;

		guestStorage.setItem(guestID, JSON.stringify(guestData));

		refreshGuests();
		return true;
	};
	
	// Update a guest
	var updateGuest = function(guest, gdeleted){
		// Update the correct entry in guestStorage with new values
		// then refresh guests array
		
		var guestData = { 'id' : guest.id,
						 'name' : guest.name,
						 'date' : guest.date,
						 'status' : guest.status,
						 'location' : guest.location,
						 'deleted' : gdeleted };
		
		guestStorage.setItem(guest.id, JSON.stringify(guestData));

		refreshGuests();
		
		return true;
	};
	
	var getGuestStatus = function(guestID){
		var guestData = guestStorage.getItem(guestID);

		if(guestData === null)
			return false;
		
		guestData = JSON.parse(guestData);
		
		return guestData.status;
	};
	
	return {
		saveGuest: saveGuest,
		updateGuest: updateGuest,
		refreshGuests: refreshGuests,
		getGuests: getGuests,
		deleteGuest: deleteGuest,
		initializeDB: initializeDB,
		getGuestStatus: getGuestStatus,
		test_getGuest: test_getGuest,
		clearDB: clearDB
	};
});

app.controller('FormController', ['dataManager', 'tabManager', function(dataManager, tabManager){
	var FCtrl = this;
	
	// Initializations
	FCtrl.guest_location = "";
	dataManager.initializeDB();
	
	// Function to evaluate if location box should be displayed
	FCtrl.showLocation = function(){
		return FCtrl.pickup_dropoff === 'pickup';
	};
	
	// Function to add a guest (process the form)
	FCtrl.addGuest = function(){
		dataManager.saveGuest(FCtrl.guest_name, FCtrl.transition_date, FCtrl.pickup_dropoff, FCtrl.guest_location);
		
		FCtrl.clearForm();
		tabManager.setPane("guests");
		
		// Output full array to console.log
		guests = dataManager.getGuests();
		for(var i=0; i<guests.length; i++){
			console.log(guests[i]);	
		};
	};
	
	// Function to reset all form inputs
	FCtrl.clearForm = function(){
		FCtrl.guest_name = "";
		FCtrl.transition_date = "";
		FCtrl.pickup_dropoff = "";
		FCtrl.guest_location = "";
	};
}]);

app.controller('GuestListController', ['dataManager', 'tabManager', function(dataManager, tabManager){
	var GLCtrl = this;
	
	// Grab the current guests array from the data manager
	GLCtrl.getGuests = function(){
		return dataManager.getGuests();
	};
	
	// Refresh the guests array in memory from stored data
	GLCtrl.refreshGuests = function(){
		dataManager.refreshGuests();
	};
	
	// Determine if we should show the current guest
	// based on whether show_deleted is checked or not
	GLCtrl.showGuest = function(guest){
		if(GLCtrl.show_deleted)
			return true;
		else if(guest.deleted === false)
			return true;
		else 
			return false;
	};
	
	// Edit a guest's data
	GLCtrl.updateGuest = function(guest, gdeleted){
		// If the delete box on the form is not checked, gdeleted will be undefined
		// in this case need to set it to false
		gdeleted = typeof gdeleted !== 'undefined' ? gdeleted : false;

		return dataManager.updateGuest(guest, gdeleted);
	};
	
	// Return the next possible status
	// pickup -> arrived, dropoff -> arrived, arrived -> pickup
	GLCtrl.getNextStatus = function(status){	
		//var status = GLCtrl.getStatus(id);
		
		if(status == "pickup")
			return "arrived";
		if(status == "dropoff")
			return "arrived";
		if(status == "arrived")
			return "pickup";
	};
	
	GLCtrl.getStatus = function(id){
		return dataManager.getGuestStatus(id);
	};
	
}]);

app.controller('TabController', ['dataManager', 'tabManager', function(dataManager, tabManager){
	var TCtrl = this;
	
	// Set aliases for tabManager functions
	TCtrl.curPane = function(value){return tabManager.curPane(value); };
	TCtrl.setPane = function(value){return tabManager.setPane(value); };
}]);