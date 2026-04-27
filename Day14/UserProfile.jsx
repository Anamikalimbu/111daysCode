import { useParams } from 'react-router-dom';

function UserProfile() {
  // 'userId' must match the parameter name defined in the Route path (/users/:userId)
  const { userId } = useParams();

  return (
    <div>
      <h1>User Profile</h1>
      <p>Showing details for User ID: <strong>{userId}</strong></p>
    </div>
  );
}

export default UserProfile;
