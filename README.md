# Tip Tracker


```
npx create-react-app restaurant-team-app
```
# backend
    - npm install

```
app.get('/api/team', async (req, res) => {
	const teamMembers = await TeamMember.find();
	res.json(teamMembers);
});

app.post('/api/team', async (req, res) => {
	const { name, position } = req.body;

	if (!name || !position) {
		return res
			.status(400)
			.json({ error: 'Both name and position are required' });
	}

	const newMember = new TeamMember({ name, position });
	await newMember.save();

	res.json(newMember);
});

app.delete('/api/team/:id', async (req, res) => {
	const memberId = req.params.id;
	try {
		// Find and remove the team member by ID
		await TeamMember.findOneAndDelete({ _id: memberId });
		res.json({
			success: true,
			message: 'Team member deleted successfully',
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: error.message || 'Internal Server Error',
		});
	}
});



app.get('/api/teams/dailyTotalsAll', async (req, res) => {
	try {
		// Fetch daily totals for all team member
		const allDailyTotals = await TeamMember.find({}, 'dailyTotals');

		// Flatten the array and return
		const flattenedDailyTotals = allDailyTotals.flatMap((member) =>
			member.dailyTotals.map((total) => ({
				...total,
				teamMember: total._doc.teamMember,
				position: total._doc.position,
				date: total._doc.date,
				foodSales: total.foodSales.toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD',
				}),
				barSales: total.barSales.toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD',
				}),
				nonCashTips: total.nonCashTips.toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD',
				}),
				cashTips: total.cashTips.toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD',
				}),
			}))
		);

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

// Example server route for handling daily totals submission for a specific team member
app.post(`/api/team/:id/dailyTotals`, async (req, res) => {
	try {
		const memberId = req.params.id;
		// const { workerName, position, date, foodSales, barSales, nonCashTips, cashTips } = req.body;
		// const { teamMember, dailyTotals } = req.body;

		const dailyTotals = req.body.dailyTotals;

		if (!Array.isArray(dailyTotals)) {
			return res
				.status(400)
				.json({
					success: false,
					message: 'dailyTotals must be an array.',
				});
		}

		// Validate each entry in dailyTotals
		for (const entry of dailyTotals) {
			if (
				!entry.date ||
				!entry.foodSales ||
				!entry.barSales ||
				!entry.nonCashTips ||
				!entry.cashTips
			) {
				return res
					.status(400)
					.json({
						success: false,
						message:
							'Each dailyTotals entry must have all required fields.',
					});
			}

			// Check if a daily total for the same date and teamMember already exists
			const existingEntry = await TeamMember.findOne({
				_id: memberId,
				'dailyTotals.date': entry.date,
				'dailyTotals.teamMember': entry.teamMember,
			});
			if (existingEntry) {
				return res
					.status(400)
					.json({
						success: false,
						message:
							'A daily total for this date and team member already exists.',
					});
			}
		}

		// Find the team member by ID
		const teamMember = await TeamMember.findById(memberId);

		if (!teamMember) {
			return res.status(404).json({
				success: false,
				message: 'Team member not found',
			});
		}

		teamMember.dailyTotals.push(...dailyTotals);

		// Save the updated team member
		await teamMember.save();

		res.status(200).json({
			success: true,
			message: 'Daily totals submitted successfully',
		});
	} catch (error) {
		console.error('Error processing dailyTotals request:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to submit daily totals',
		});
	}
});

// Add a new API endpoint for deleting a specific daily total
app.delete(
	'/api/team/:memberId/dailyTotals/:dailyTotalId',
	async (req, res) => {
		const memberId = req.params.memberId;
		const dailyTotalId = req.params.dailyTotalId;

		try {
			// Find the team member by ID
			const teamMember = await TeamMember.findById(memberId);

			if (!teamMember) {
				return res.status(404).json({
					success: false,
					message: 'Team member not found',
				});
			}

			// Find the index of the daily total to be deleted
			const indexToDelete = teamMember.dailyTotals.findIndex(
				(total) => total._id.toString() === dailyTotalId
			);

			// Check if the daily total exists
			if (indexToDelete === -1) {
				return res.status(404).json({
					success: false,
					message: 'Daily total not found',
				});
			}

			// Remove the daily total from the array
			teamMember.dailyTotals.splice(indexToDelete, 1);

			// Save the updated team member
			await teamMember.save();

			const dailyTotal = teamMember.dailyTotals.id(
				req.params.dailyTotalId
			);
			if (!dailyTotal)
				return res
					.status(404)
					.send('The daily total with the given ID was not found.');

			dailyTotal.remove();
			await teamMember.save();

			res.send(dailyTotal);
			res.status(200).json({
				success: true,
				message: 'Daily total deleted successfully',
			});
		} catch (error) {
			console.error('Error deleting daily total:', error);
			res.status(500).json({
				success: false,
				message: 'Internal Server Error',
			});
		}
	}
);
```

# frontend
    - npm install express mongoose cors body-parser
    - npm install axios
    - npm install mongodb