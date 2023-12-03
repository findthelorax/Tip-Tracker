import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
	const [team, setTeam] = useState([]);
	const [name, setName] = useState('');
	const [position, setPosition] = useState('bartender');
  const [dailyTotals, setDailyTotals] = useState({
    worker: '',
    position: '',
    date: '',
    foodSales: '',
    barSales: '',
    nonCashTips: '',
    cashTips: '',
    barTipOuts: '',
    runnerTipOuts: '',
    hostTipOuts: '',
    totalTipOut: '',
    tipsReceived: '',
    tipsPayroll: '',
  });
  const [weeklyTotals, setWeeklyTotals] = useState({
    worker: '',
    position: '',
    startDate: '',
    endDate: '',
    foodSales: '',
    barSales: '',
    nonCashTips: '',
    cashTips: '',
    barTipOuts: '',
    runnerTipOuts: '',
    hostTipOuts: '',
    totalTipOut: '',
    tipsReceived: '',
    tipsPayroll: '',
  });
  const [dailyTotalsList, setDailyTotalsList] = useState([]);
  const [weeklyTotalsList, setWeeklyTotalsList] = useState([]);

	const addTeamMember = async () => {
    if (name && position) {
      try {
        const response = await axios.post(
          'http://localhost:3001/api/team',
					{ name, position }
          );
          setTeam([...team, response.data]);
          clearInputs();
        } catch (error) {
          console.error('Error adding team member:', error);
          alert('Failed to add team member');
        }
      } else {
        alert('Please enter both name and position');
      }
    };
    
    useEffect(() => {
      displayTeam();
    }, []);

	const displayTeam = async () => {
		try {
			const response = await axios.get('http://localhost:3001/api/team');
			setTeam(response.data);
		} catch (error) {
			console.error('Error fetching team members:', error);
			alert('Failed to fetch team members');
		}
	};

	const clearInputs = () => {
		setName('');
		setPosition('bartender');
	};

  const deleteTeamMember = async (id) => {
    try {
      // Send a DELETE request to the server to delete the team member by ID
      await axios.delete(`http://localhost:3001/api/team/${id}`);
      // Remove the deleted team member from the local state
      setTeam((prevTeam) => prevTeam.filter((member) => member._id !== id));
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('Failed to delete team member');
    }
  };

  const handleDailyTotalsChange = (field, value) => {
    setDailyTotals({
      ...dailyTotals,
      [field]: value || '',
    });
  };

  const handleWeeklyTotalsChange = (field, value) => {
    setWeeklyTotals({
      ...weeklyTotals,
      [field]: value,
    });
  };
  
  useEffect(() => {
    fetchDailyTotals();
  }, []);

  const fetchDailyTotals = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/dailyTotals');
      const latestDailyTotals = response.data[0] || {}; // Get the latest entry

      setDailyTotals({
        worker: '',
        position: '',
        date: '',
        foodSales: '',
        barSales: '',
        nonCashTips: '',
        cashTips: '',
        barTipOuts: '',
        runnerTipOuts: '',
        hostTipOuts: '',
        totalTipOut: '',
        tipsReceived: '',
        tipsPayroll: '',
        ...latestDailyTotals, // Update with the latest entry if available
      });
    } catch (error) {
      console.error('Error fetching daily totals:', error);
      alert('Failed to fetch daily totals');
    }
  };

  const submitDailyTotals = async () => {
    try {
      // Send the data to the server
      await axios.post('http://localhost:3001/api/dailyTotals', dailyTotals);
      setDailyTotalsList([...dailyTotalsList, { ...dailyTotals, position: team.find(member => member.name === dailyTotals.worker)?.position }]);

      await fetchDailyTotals();
      // Clear inputs after submission
      setDailyTotals({
        worker: '',
        position: '',
        date: '',
        foodSales: '',
        barSales: '',
        nonCashTips: '',
        cashTips: '',
      });
    } catch (error) {
      console.error('Error submitting daily totals:', error);
      alert('Failed to submit daily totals');
    }
  };

	return (
		<div className="App">
			<h1>Restaurant Team Management</h1>

			<div className="input-card">
				<label htmlFor="name">Name:</label>
				<input
					type="text"
					id="name"
					placeholder="Enter name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>

				<label htmlFor="position">Position:</label>
				<select
					id="position"
					value={position}
					onChange={(e) => setPosition(e.target.value)}
				>
					<option value="bartender">Bartender</option>
					<option value="runner">Runner</option>
					<option value="server">Server</option>
					<option value="host">Host</option>
				</select>

				<button onClick={addTeamMember}>Add to Team</button>
			</div>
      <div className="team-card">
        <h2>Team Members</h2>
				{team.map((member) => (
					<div key={member._id} className="member-card">
						<strong>{member.name.charAt(0).toUpperCase() + member.name.slice(1)}</strong> - {member.position}
            <button onClick={() => deleteTeamMember(member._id)}>Delete</button>
					</div>
				))}
			</div>

      <div>
        <h2>Daily Totals</h2>
        <div>
          <label htmlFor="worker">Worker:</label>
          <select
            id="worker"
            value={dailyTotals.worker}
            onChange={(e) => handleDailyTotalsChange('worker', e.target.value)}
          >
            <option value="">Select Worker</option>
            {team.map((member) => (
              <option key={member._id} value={member.name}>
                {`${member.name} - ${member.position}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={dailyTotals.date}
            onChange={(e) => handleDailyTotalsChange('date', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="foodSales">Food Sales:</label>
          <input
            type="number"
            id="foodSales"
            value={dailyTotals.foodSales}
            onChange={(e) => handleDailyTotalsChange('foodSales', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="barSales">Bar Sales:</label>
          <input
            type="number"
            id="barSales"
            value={dailyTotals.barSales}
            onChange={(e) => handleDailyTotalsChange('barSales', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="nonCashTips">Non-Cash Tips:</label>
          <input
            type="number"
            id="nonCashTips"
            value={dailyTotals.nonCashTips}
            onChange={(e) => handleDailyTotalsChange('nonCashTips', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="cashTips">Cash Tips:</label>
          <input
            type="number"
            id="cashTips"
            value={dailyTotals.cashTips}
            onChange={(e) => handleDailyTotalsChange('cashTips', e.target.value)}
          />
        </div>
        <button onClick={submitDailyTotals}>Submit Daily Totals</button>
        <div className="sales-card">
          <h2>Daily Totals</h2>
          {dailyTotals && (
            <div className="daily-totals-table">
              <div className="totals-header">
                <div>Worker</div>
                <div>Position</div>
                <div>Date</div>
                <div>Food Sales</div>
                <div>Bar Sales</div>
                <div>Non-Cash Tips</div>
                <div>Cash Tips</div>
                <div>Bar Tip Out</div>
                <div>Runner Tip Out</div>
                <div>Host Tip Out</div>
                <div>Total Tip Out</div>
                <div>Tips Received</div>
                <div>Payroll Tips</div>
              </div>
              {/* Map through daily totals and display in rows */}
              {dailyTotalsList.map((dailyTotal, index) => (
                <div key={index} className="totals-row">
                  <div>{dailyTotal.worker}</div>
                  <div>{dailyTotal.position}</div>
                  <div>{dailyTotal.date}</div>
                  <div>{dailyTotal.foodSales}</div>
                  <div>{dailyTotal.barSales}</div>
                  <div>{dailyTotal.nonCashTips}</div>
                  <div>{dailyTotal.cashTips}</div>
                  <div>{dailyTotal.barTipOuts}</div>
                  <div>{dailyTotal.runnerTipOuts}</div>
                  <div>{dailyTotal.hostTipOuts}</div>
                  <div>{dailyTotal.totalTipOut}</div>
                  <div>{dailyTotal.tipsReceived}</div>
                  <div>{dailyTotal.tipsPayroll}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="sales-card">
          <h2>Weekly Totals</h2>
          {weeklyTotals && (
            <div className="weekly-totals-table">
              <div className="totals-header">
                <div>Worker</div>
                <div>Position</div>
                <div>Start Date</div>
                <div>End Date</div>
                <div>Food Sales</div>
                <div>Bar Sales</div>
                <div>Non-Cash Tips</div>
                <div>Cash Tips</div>
                <div>Bar Tip Out</div>
                <div>Runner Tip Out</div>
                <div>Host Tip Out</div>
                <div>Total Tip Out</div>
                <div>Tips Received</div>
                <div>Payroll Tips</div>
              </div>
              {/* Map through weekly totals and display in rows */}
              {weeklyTotalsList.map((weeklyTotal, index) => (
                <div key={index} className="totals-row">
                  <div>{weeklyTotal.worker}</div>
                  <div>{weeklyTotal.position}</div>
                  <div>{weeklyTotal.startDate}</div>
                  <div>{weeklyTotal.endDate}</div>
                  <div>{weeklyTotal.foodSales}</div>
                  <div>{weeklyTotal.barSales}</div>
                  <div>{weeklyTotal.nonCashTips}</div>
                  <div>{weeklyTotal.cashTips}</div>
                  <div>{weeklyTotal.barTipOuts}</div>
                  <div>{weeklyTotal.runnerTipOuts}</div>
                  <div>{weeklyTotal.hostTipOuts}</div>
                  <div>{weeklyTotal.totalTipOut}</div>
                  <div>{weeklyTotal.tipsReceived}</div>
                  <div>{weeklyTotal.tipsPayroll}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
		</div>
	);
}

export default App;
