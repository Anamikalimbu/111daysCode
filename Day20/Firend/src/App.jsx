import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FriendCard from './components/FriendCard';
import './App.css';

function App() {
  const friends = [
    { id: 1, name: 'Smriti Rai', age: 19, hobby: 'Playing mobile games' },
    { id: 2, name: 'Ragita Bogati', age: 17, hobby: 'Crochet' },
    { id: 3, name: 'Sargam Rai', age: 19, hobby: 'Playing Basketball' },
    { id: 4, name: 'Pema Tamang', age: 16, hobby: 'Playing Volleyball' },
    { id: 5, name: 'Abin khawas', age: 8, hobby: 'Drawing' },
  ];

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        <div className="friends-grid">
          {friends.map((friend) => (
            <FriendCard
              key={friend.id}
              name={friend.name}
              age={friend.age}
              hobby={friend.hobby}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
