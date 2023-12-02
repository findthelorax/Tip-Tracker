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

	useEffect(() => {
		displayTeam();
	}, []);

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

  const handleDailyTotalsChange = (field, value) => {
    setDailyTotals({
      ...dailyTotals,
      [field]: value,
    });
  };

  const handleWeeklyTotalsChange = (field, value) => {
    setWeeklyTotals({
      ...weeklyTotals,
      [field]: value,
    });
  };

  const submitDailyTotals = async () => {
    try {
      // Send the data to the server
      await axios.post('http://localhost:3001/api/dailyTotals', dailyTotals);
      setDailyTotalsList([...dailyTotalsList, { ...dailyTotals }]);
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

  const submitWeeklyTotals = async () => {
    try {
      // Send the data to the server
      await axios.post('http://localhost:3001/api/weeklyTotals', weeklyTotals);
      setWeeklyTotalsList([...weeklyTotalsList, { ...weeklyTotals }]);
      // Clear inputs after submission
      setWeeklyTotals({
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
    } catch (error) {
      console.error('Error submitting weekly totals:', error);
      alert('Failed to submit weekly totals');
    }
  };

  const displayCalculatedSales = async () => {
    try {
      // Fetch the calculated sales from the server
      const response = await axios.get('http://localhost:3001/api/calculateSales');
      setCalculatedSales(response.data);
    } catch (error) {
      console.error('Error fetching calculated sales:', error);
      alert('Failed to fetch calculated sales');
    }
  };
  const [calculatedSales, setCalculatedSales] = useState(null);

  useEffect(() => {
    displayCalculatedSales();
  }, []);

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
						<strong>{member.name}</strong> - {member.position}
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        <h2>Weekly Totals</h2>
        <div>
          <label htmlFor="workerWeekly">Worker:</label>
          <select
            id="workerWeekly"
            value={weeklyTotals.worker}
            onChange={(e) => handleWeeklyTotalsChange('worker', e.target.value)}
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
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={weeklyTotals.startDate}
            onChange={(e) => handleWeeklyTotalsChange('startDate', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={weeklyTotals.endDate}
            onChange={(e) => handleWeeklyTotalsChange('endDate', e.target.value)}
          />
        </div>
        {/* ... Add other input fields for weekly totals */}
        <button onClick={submitWeeklyTotals}>Submit Weekly Totals</button>
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
            
      <div className="sales-card">
        <h2>Calculated Sales</h2>
        {calculatedSales && (
          <div className="calculated-sales-table">
            <div className="calculated-sales-header">
              <div>Worker</div>
              <div>Position</div>
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
            {calculatedSales.teamMembers.map((member) => (
              <div key={member._id} className="calculated-sales-row">
                <div>{member.name}</div>
                <div>{member.position}</div>
                <div>{member.weeklyTotals.foodSales}</div>
                <div>{member.weeklyTotals.barSales}</div>
                <div>{member.weeklyTotals.nonCashTips}</div>
                <div>{member.weeklyTotals.cashTips}</div>
                <div>{member.weeklyTotals.barTipOuts}</div>
                <div>{member.weeklyTotals.runnerTipOuts}</div>
                <div>{member.weeklyTotals.hostTipOuts}</div>
                <div>{member.weeklyTotals.totalTipOut}</div>
                <div>{member.weeklyTotals.tipsReceived}</div>
                <div>{member.weeklyTotals.tipsPayroll}</div>
              </div>
            ))}
            <div className="calculated-sales-summary">
              <div>Total</div>
              <div></div>
              <div>{calculatedSales.totalSales.foodSales}</div>
              <div>{calculatedSales.totalSales.barSales}</div>
              <div>{calculatedSales.totalSales.nonCashTips}</div>
              <div>{calculatedSales.totalSales.cashTips}</div>
              <div>{calculatedSales.totalSales.barTipOuts}</div>
              <div>{calculatedSales.totalSales.runnerTipOuts}</div>
              <div>{calculatedSales.totalSales.hostTipOuts}</div>
              <div>{calculatedSales.totalSales.totalTipOut}</div>
              <div>{calculatedSales.totalSales.tipsReceived}</div>
              <div>{calculatedSales.totalSales.tipsPayroll}</div>
            </div>
          </div>
        )}
      </div>
		</div>
	);
}

export default App;
