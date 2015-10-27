// Test tabManager
describe("tabManager", function(){
	var tabManager;
	
	// Load app module
	beforeEach(module('shuffling'));
	
	// Load tabManager
	beforeEach(inject(function(_tabManager_){
		tabManager = _tabManager_;	
	}));
	
	it('should initialize pane to be "form"', function(){
		expect(tabManager.curPane('form')).toBe(true);
	});
	
	it('should set pane to be "guests"', function(){
		tabManager.setPane("guests");
		expect(tabManager.curPane('guests')).toBe(true);
	});
});

// Test dataManager
describe("dataManager", function(){
	var dataManager;
	
	// Sample guest objects for testing
	var testguest = { 'id' : 1, 'name' : 'testguest', 'date' : '1-1-15', 
					 'status' : 'pickup', 'location' : 'guest location' };
	
	var testguest2 = { 'id' : 1, 'name' : 'testguest2', 'date' : '2-2-15', 
					 'status' : 'dropoff', 'location' : 'guest location2' };	
	
	// Load app module
	beforeEach(module('shuffling'));
	
	// Load dataManager
	beforeEach(inject(function(_dataManager_){
		dataManager = _dataManager_;
	}));
	
	// test localStorage
	it('localStorage should be functioning', function(){
		localStorage.setItem('3', 'test');
		expect(localStorage.getItem('3')).toBe('test');
	});
	
	// test saveGuest
	it('saveGuest should insert correctly to local storage', function(){
		dataManager.clearDB();
		
		dataManager.saveGuest(testguest.name, testguest.date, testguest.status, testguest.location);
		
		var guest = dataManager.test_getGuest(1);
		
		expect(guest.name).toBe(testguest.name);
		expect(guest.date).toBe(testguest.date);
		expect(guest.status).toBe(testguest.status);
		expect(guest.location).toBe(testguest.location);
		expect(guest.deleted).toBe(false);
	});
	
	// test getGuests
	it('getGuests should return the guests array', function(){
		dataManager.clearDB();
		
		dataManager.saveGuest(testguest.name, testguest.date, testguest.status, testguest.location);
		
		var guests = dataManager.getGuests();
		
		expect(guests[0].name).toBe(testguest.name);
		expect(guests[0].date).toBe(testguest.date);
		expect(guests[0].status).toBe(testguest.status);
		expect(guests[0].location).toBe(testguest.location);
		expect(guests[0].deleted).toBe(false);
	});

	// test deleteGuest
	it('deleteGuest should delete the guest', function(){
		dataManager.clearDB();
		
		dataManager.saveGuest(testguest.name, testguest.date, testguest.status, testguest.location);
		
		var guest = dataManager.test_getGuest(1);
		
		expect(guest.deleted).toBe(false);
		
		dataManager.deleteGuest(1);
		guest = dataManager.test_getGuest(1);
		
		expect(guest.deleted).toBe(true);
	});
	
	// test updateGuest
	it('updateGuest should update all info', function(){
		dataManager.clearDB();

		dataManager.saveGuest(testguest.name, testguest.date, testguest.status, testguest.location);
		
		dataManager.updateGuest(testguest2, true);
		
		var guest = dataManager.test_getGuest(1);
		
		expect(guest.name).toBe(testguest2.name);
		expect(guest.date).toBe(testguest2.date);
		expect(guest.status).toBe(testguest2.status);
		expect(guest.location).toBe(testguest2.location);
		expect(guest.deleted).toBe(true);		
	});
	
	// test getGuestStatus
	it('getGuestStatus should return correct status', function(){
		dataManager.clearDB();

		dataManager.saveGuest(testguest.name, testguest.date, testguest.status, testguest.location);
		
		expect(dataManager.getGuestStatus(1)).toBe(testguest.status);
	});
});

// Test FormController
describe("FormController", function(){
	var formController, tabManager;
	
	// Load app module
	beforeEach(module('shuffling'));
	
	beforeEach(inject(function($controller){
		formController = $controller('FormController');	
	}));	
	
	beforeEach(function(){
		inject(function($injector){
			tabManager = $injector.get('tabManager');
			dataManager = $injector.get('dataManager');
		});
	});
	
	// test clearForm
	it('clearForm should set the form elements to blank', function(){
		formController.clearForm();
		expect(formController.guest_name).toBe('');
		expect(formController.transition_date).toBe('');
		expect(formController.pickup_dropoff).toBe('');
		expect(formController.guest_location).toBe('');
	});
	
	// test showLocation
	it('showLocation should be true when pickup_dropoff is pickup', function(){
		formController.pickup_dropoff = 'pickup';
		expect(formController.showLocation()).toBe(true);
	});

	it('showLocation should be false when pickup_dropoff is dropoff', function(){
		formController.pickup_dropoff = 'dropoff';
		expect(formController.showLocation()).toBe(false);
	});
	
	// test addGuest
	it('test addGuest function: should call dm.saveGuest, clearForm(), set pane to guests', function(){
		tabManager.setPane("form");
		spyOn(formController, 'clearForm');
		spyOn(dataManager, 'saveGuest');
		
		formController.guest_name = "testg";
		formController.transition_date = "12-1-12";
		formController.pickup_dropoff = "pickup";
		formController.guest_location = "myloc";
		
		formController.addGuest();
		
		expect(formController.clearForm).toHaveBeenCalled();
		expect(dataManager.saveGuest).toHaveBeenCalled();
		expect(tabManager.curPane('guests')).toBe(true);
	});
});

// test tabController
describe("TabController", function(){
	var tabController;

	// Load app module
	beforeEach(module('shuffling'));
	
	// Inject controller
	beforeEach(inject(function($controller){
		tabController = $controller('TabController');
	}));
	
	// test curPane
	it('should initialize pane to be "form"', function(){
		expect(tabController.curPane('form')).toBe(true);
	});
	
	// test setPane
	it('should set pane to be "guests"', function(){
		tabController.setPane("guests");
		expect(tabController.curPane('guests')).toBe(true);
	});
});

// Test GuestListController
describe("GuestListController", function(){
	var guestListController, dataManager;
	
	// Load app module
	beforeEach(module('shuffling'));
	
	beforeEach(inject(function($controller){
		guestListController = $controller('GuestListController');	
	}));
	
	beforeEach(inject(function(_dataManager_){
		dataManager = _dataManager_;
	}));
	
	// test getGuests
	it('getGuests should call dm.getGuests', function(){
		spyOn(dataManager, 'getGuests');
		guestListController.getGuests();
		
		expect(dataManager.getGuests).toHaveBeenCalled();
	});
	
	// test refreshGuests
	it('refreshGuests should call dm.refreshGuests', function(){
		spyOn(dataManager, 'refreshGuests');
		guestListController.refreshGuests();
		
		expect(dataManager.refreshGuests).toHaveBeenCalled();
	});	
	
	// test showGuest
	it('showGuest should return true if the guest shown be shown, false otherwise', function(){
		
		var guest = { 'deleted' : true };
		guestListController.show_deleted = true;
		expect(guestListController.showGuest(guest)).toBe(true);
		
		guestListController.show_deleted = false;
		expect(guestListController.showGuest(guest)).toBe(false);
	});
	
	// test updateGuest
	it('updateGuest should call dm.updateGuest', function(){
		spyOn(dataManager, 'updateGuest');
		guestListController.updateGuest(null);
		
		expect(dataManager.updateGuest).toHaveBeenCalled();
	});	
	
	// test getStatus
	it('getStatus should call dm.getGuestGuest', function(){
		spyOn(dataManager, 'getGuestStatus');
		guestListController.getStatus(1);
		
		expect(dataManager.getGuestStatus).toHaveBeenCalled();
	});	
	
	// test getNextStatus
	it('next status of "pickup" should be "arrived"', function(){
		expect(guestListController.getNextStatus('pickup')).toBe('arrived');
	});
	
	it('next status of "dropoff" should be "arrived"', function(){
		expect(guestListController.getNextStatus('dropoff')).toBe('arrived');
	});
	
	it('next status of "arrived" should be "pickup"', function(){
		expect(guestListController.getNextStatus('arrived')).toBe('pickup');
	});
	
});