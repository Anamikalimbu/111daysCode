import React from 'react';

const FriendCard = ({ name, age, hobby }) => {
  return (
    <div className="friend-card">
      <div className="card-content">
        <h2>{name}</h2>
        <p><strong>Age:</strong> {age}</p>
        <p><strong>Hobby:</strong> {hobby}</p>
      </div>
    </div>
  );
};

export default FriendCard;
