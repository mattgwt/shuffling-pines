README: Assignment 2, Shuffling Pines
=======
### by Matthew Tyler

##### Build Instructions:
1. Download repository (or unzip)
2. Run 'npm install' to install Node packages
3. Run 'bower install' to install Bower packages
4. Run 'gulp' to run tests, minify/uglify/concat source, place output files in 'bist' directory, and start Karma server. 


##### Summary:
The assignment has been completed according to the specs, including the bonus features (soft delete, and inline editing). 

Add Guest Form: The default view is the add-guest form. The guest name, transition date, pick-up/drop-off, and location (if pick-up is selected) may be entered. As information is typed in, it will be displayed in a box below the form. "Submit" adds the guest to localStorage, causes the full contents of localStorage to be written to the console, and switches to the Guests view.

Guest List View: Lists all guests in storage. The option "Show deleted?" at the top toggles whether (soft-)deleted guests are to be shown, or not. Editing a given guest's information and clicking "Apply Changes" will commit the changes to the database; "Discard Changes" will reset the fields to their stored values. The "Deleted?" checkbox sets or unsets the soft-deleted flag.