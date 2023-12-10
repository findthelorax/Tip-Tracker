// import React, { useState } from "react";
// import Header from "./components/header";
// import TeamOperations from "./components/teamMembers";
// import DatabaseOperations from "./components/databaseOps";
// import WeeklySales from "./components/weeklySales";
// import DailyTotals from "./components/dailyTotals";
// import ErrorComponent from "./components/errorComponent";
// import { TeamContext } from "./components/teamContext";
// import { ErrorProvider, ErrorContext } from "./components/ErrorContext";

// function App() {
//     const [team, setTeam] = useState([]);
//     const [name, setName] = useState("");
//     const [position, setPosition] = useState("bartender");
//     const [error, setError] = useState(null);
//     const [refresh, setRefresh] = useState(false);

//     return (
//         <div className="App">
//             <TeamContext.Provider value={{ team, setTeam }}>
//                 <Header />

//                 <DatabaseOperations setRefresh={setRefresh} />

//                 <TeamOperations
//                     team={team}
//                     setTeam={setTeam}
//                     name={name}
//                     setName={setName}
//                     position={position}
//                     setPosition={setPosition}
//                     refresh={refresh}
//                     setRefresh={setRefresh}
//                     // addTeamMember={addTeamMember}
//                     // displayTeam={displayTeam}
//                     // fetchTeamMembers={fetchTeamMembers}
//                     // deleteTeamMember={deleteTeamMember}
//                 />

//                 <DailyTotals
//                     team={team}
//                     setTeam={setTeam}
//                     setError={setError}
//                     refresh={refresh}
//                     setRefresh={setRefresh}
//                 />

//                 <WeeklySales refresh={refresh} setRefresh={setRefresh} />

//                 <ErrorComponent error={error} />
//             </TeamContext.Provider>
//         </div>
//     );
// }

// export default App;

import React, { useState } from "react";
import Header from "./components/header";
import TeamOperations from "./components/teamMembers";
import DatabaseOperations from "./components/databaseOps";
import WeeklySales from "./components/weeklySales";
import DailyTotals from "./components/dailyTotals";
import ErrorComponent from "./components/errorComponent";
import { TeamContext } from "./components/teamContext";
import { ErrorProvider, ErrorContext } from "./components/ErrorContext";

function App() {
    const [team, setTeam] = useState([]);
	const [name, setName] = useState("");
    const [position, setPosition] = useState("bartender");
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const updateTeam = (newTeam) => {
        setTeam(newTeam);
    };

    const updateName = (newName) => {
        setName(newName);
    };

    const updatePosition = (newPosition) => {
        setPosition(newPosition);
    };

    const updateRefresh = (newRefresh) => {
        setRefresh(newRefresh);
    };

    return (
        <ErrorProvider>
            <div className="App">
                <TeamContext.Provider value={{ team, setTeam }}>
                    <Header />

                    <DatabaseOperations 
						updateRefresh={updateRefresh}
					/>

                    <TeamOperations
                        updateTeam={updateTeam}
                        updateName={updateName}
                        updatePosition={updatePosition}
                        updateRefresh={updateRefresh}
                    />

                    <DailyTotals
                        updateTeam={updateTeam}
                        setError={setError}
                        refresh={refresh}
                        setRefresh={updateRefresh}
                    />

                    <WeeklySales refresh={refresh} setRefresh={updateRefresh} />

                    <ErrorComponent error={error} />
                </TeamContext.Provider>
            </div>
        </ErrorProvider>
    );
}

export default App;
