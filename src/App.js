import logo from './logo.svg';
import { useState, useEffect } from 'react';
import { db } from './firebase.config';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import './App.css';

function App() {
  const [users, setUsers] = useState(['hello', 'john']);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const loadedUsers = [];
    const usersRef = await getDocs(collection(db, 'users'));
    usersRef.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      loadedUsers.push({ ...doc.data(), id: doc.id });
    });
    setUsers(loadedUsers);
  };

  const fetchSingleSessions = async (id) => {
    const loadedSessions = [];
    const sessionsRef = await getDocs(collection(db, `users/${id}/sessions`));
    sessionsRef.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      loadedSessions.push({ ...doc.data(), id: doc.id });
    });
    setSessions(loadedSessions);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {sessions.length > 0 &&
          sessions.map((session) => {
            const climbs = session.climbs !== undefined ? session.climbs : [];
            if (climbs) {
              return (
                <div key={session.id}>
                  {climbs.map((climb, idx) => {
                    return (
                      <div key={session.id + idx}>
                        <h5>{climb.date}</h5>
                        <p>Grade: {climb.grade}</p>
                        <p>Attempts: {climb.attempts}</p>
                      </div>
                    );
                  })}
                </div>
              );
            }
          })}
        {users.map((user) => {
          return (
            <div key={user.id}>
              <h3>{`${user.first_name} ${user.last_name}`}</h3>
              <h4>Username: {user.username}</h4>
              <button onClick={() => fetchSingleSessions(user.id)}>
                Get User's Sessions
              </button>
            </div>
          );
        })}
      </header>
    </div>
  );
}

export default App;
