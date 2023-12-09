# Tip Tracker
- I believe I ran:
	- npx create-react-app tip-tracker
	- cd frontend | cd backend
	- in each folder
	```
	npm install express mongoose cors axios body-parser react bootstrap mongodb date-fns-tz
	```

	### frontend
		- nodemon

	### backend
		- nodemon server.js


#To-Do
 - Fix dateUtlis getting incorrect date format
 - make sure dailyTotals table is displaying data properly
 - add tipOut data to dailyTotals array and table
 - populate weeklyTotals table with the data from a selected week. Automatically populated with the current week Sunday to Saturday.
 - add in logic for calculating tipOuts

 - make sure deleting a teamber removes their data from the tables and recalculates.