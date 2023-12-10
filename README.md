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

##Custom Errors:
```
// CustomError.js
class CustomError extends Error {
  constructor(name, httpStatusCode, description, isOperational) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpStatusCode = httpStatusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

module.exports = CustomError;
```

- You can use this CustomError class to throw errors in your routes. For example:
```
const CustomError = require('./CustomError');

app.get('/api/someRoute', (req, res, next) => {
  try {
    // Some code that might throw an error
    throw new CustomError('DatabaseError', 500, 'Failed to fetch data from database', true);
  } catch (error) {
    next(error);
  }
});
```

- In your error handling middleware, you can check if the error is an instance of CustomError and handle it accordingly:
```
app.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    // Handle custom error
    res.status(err.httpStatusCode).json({ error: err.message });
  } else {
    // Handle generic error
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
```

- To log errors to an external service like Sentry, you can install the @sentry/node package:
```
npm install @sentry/node
```

- Then, you can initialize Sentry in your server file:
```
const Sentry = require('@sentry/node');

Sentry.init({ dsn: 'YOUR_SENTRY_DSN' });
```

- And use Sentry's error handling middleware:
```
app.use(Sentry.Handlers.errorHandler());
```


- In your route files (e.g., backend/routes/dailyTotals.js, backend/routes/database.js, etc.), import the CustomError class and use it to throw errors. For example:

```
const CustomError = require('../CustomError');

// In your route
app.get('/api/someRoute', (req, res, next) => {
	try {
		// Some code that might throw an error
		throw new CustomError('DatabaseError', 500, 'Failed to fetch data from database', true);
	} catch (error) {
		next(error);
	}
});
```

- In your backend/server.js file, add the error handling middleware:
```
app.use((err, req, res, next) => {
	if (err instanceof CustomError) {
		// Handle custom error
		res.status(err.httpStatusCode).json({ error: err.message });
	} else {
		// Handle generic error
		console.error(err.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
```

- Install in backend: npm install @sentry/node

- In your backend/server.js file, initialize Sentry and add Sentry's error handling middleware:

```
const Sentry = require('@sentry/node');

Sentry.init({ dsn: 'YOUR_SENTRY_DSN' });

app.use(Sentry.Handlers.errorHandler());
```

```
Create an account or log in to Sentry at https://sentry.io/welcome/.
Once logged in, create a new project.
Choose the platform (in your case, it's likely to be JavaScript or Node.js).
After the project is created, you'll be taken to a page with your DSN, which is a string that looks something like this: https://<public_key>:<secret_key>@sentry.io/<project_id>.
Copy this DSN and replace YOUR_SENTRY_DSN in your code with it.
```

- This will automatically log all errors that occur in your application to Sentry. You can view these errors in the Sentry dashboard.

- Replace 'YOUR_SENTRY_DSN' with your actual Sentry DSN. If you don't have a Sentry account, you can create one for free on the Sentry website.


### Flatten and map:

  - This is a single array of all the dailyTotals from all TeamMember documents. Each dailyTotal is a separate object in the array.
```
router.get('/all', async (req, res) => {
 	try {
 		// Fetch daily totals for all team member
 		const allDailyTotals = await TeamMember.find({}, 'dailyTotals');

 		// Flatten the array and return
 		const flattenedDailyTotals = allDailyTotals.flatMap((member) =>
 			member.dailyTotals.map((total) => ({
 				...total,
 				teamMember: total.teamMember,
 				position: total.position,
 				date: total.date,
 				foodSales: total.foodSales,
 				barSales: total.barSales,
 				nonCashTips: total.nonCashTips,
 				cashTips: total.cashTips,
 			}))
 			// member.dailyTotals.map((total) => {
 			// 	const totalObject = total.toObject();
 			// 	return {
 			// 		...totalObject,
 			// 		teamMember: totalObject.teamMember,
 			// 		position: totalObject.position,
 			// 		date: totalObject.date,
 			// 		foodSales: totalObject.foodSales,
 			// 		barSales: totalObject.barSales,
 			// 		nonCashTips: totalObject.nonCashTips,
 			// 		cashTips: totalObject.cashTips,
 			// 	};
 			// })
 		);
 			console.log('Flattened Daily Totals:', flattenedDailyTotals);
 		res.json(flattenedDailyTotals);
 	} catch (error) {
 		console.error('Error fetching daily totals:', error);
 		res.status(500).json({
 			error: `Error fetching daily totals: ${
 				error.message || 'Internal Server Error'
 			}`,
 		});
 	}
});
```