import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken, setUsername: setParentUsername, setUserId }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook to navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Logging in with:', { username, password }); // Log input data
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', { username, password });
      console.log('Login response:', response.data); // Log the response from the server
  
      // Assuming the response contains the token and user information
      const { token, user } = response.data;

      // Check if user is defined
      if (!user) {
        throw new Error('User data is not available');
      }

      // Store the token, username, and userId in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('username', user.username); // Store username
      localStorage.setItem('userId', user._id); // Store user ID
  
      // Set token and user data in parent component
      setParentUsername(user.username); 
      setToken(token);
      setUsername(user.username);
      setUserId(user._id);
  
      // Navigate to the code editor page
      navigate('/code-editor');
      
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message); // Log the error response
      alert('Invalid credentials');
    }
  };

  

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      <p>Don't have an account? <a href="/signup">Signup here</a></p> {/* Link to signup page */}
    </form>
  );
};

export default Login;
