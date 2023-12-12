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


# To-Do
	- add tipOut data to dailyTotals array and table
	- populate weeklyTotals table with the data from a selected week. Automatically populated with the current week Sunday to Saturday.
	- add in logic for calculating tipOuts
	- replace alerts with a modal



# FIX
    - Fix fetchDailyTotals /teamMembers and fetchDailyTotals returns the same data.
	- Move teamMember.js api calls to a separate file
	- Display daily totals table
	- Move submit daily totals function

    - in dailyTotals.js and databaseOps.js the useEffect is rendering twice in a row
```
	useEffect(() => {
		fetchTotals();
	}, [fetchTotals]);
```
```
    useEffect(() => {
        fetchDatabases();
    }, [fetchDatabases]);
```


## Notes
	- reducer is a function that determines how the application's state should change in response to an action. It takes the current state and an action as arguments, and returns the new state.

	- dispatch is a function from the useReducer hook. When you call dispatch with an action, React will call your reducer with the current state and that action. The reducer returns the new state, and React updates the component with the new state.

### Modal
```
npm install react-modal

import Modal from 'react-modal';

const [isModalOpen, setIsModalOpen] = useState(false);
const [memberToDelete, setMemberToDelete] = useState(null);

const closeModal = () => {
    setIsModalOpen(false);
};

const confirmDelete = useCallback(async () => {
    if (memberToDelete) {
        try {
            await deleteTeamMember(memberToDelete._id);
            setTeam((prevTeam) =>
                prevTeam.filter((member) => member._id !== memberToDelete._id)
            );
            closeModal();
        } catch (error) {
            console.error('Error deleting team member:', error);
            // Replace this with your error handling logic
        }
    }
}, [memberToDelete, setTeam]);

const deleteTeamMemberFromTeam = (id, teamMemberName, position) => {
    setMemberToDelete({ _id: id, teamMemberName, position });
    setIsModalOpen(true);
};

// ...

<Modal
    isOpen={isModalOpen}
    onRequestClose={closeModal}
    contentLabel="Delete Confirmation"
>
    <h2>Confirm Delete</h2>
    <p>ARE YOU SURE YOU WANT TO DELETE:</p>
    <p>{memberToDelete?.teamMemberName.toUpperCase()} - {memberToDelete?.position}</p>
    <button onClick={confirmDelete}>Yes</button>
    <button onClick={closeModal}>No</button>
</Modal>

<button
    onClick={() =>
        deleteTeamMemberFromTeam(
            member._id,
            member.teamMemberName,
            member.position
        )
    }
>
    Delete
</button>

Remember to initialize Modal with Modal.setAppElement('#root') or your app's root element id.
	- Modal.setAppElement('#root');
Please note that you should replace #root with the id of your app's root element.
```