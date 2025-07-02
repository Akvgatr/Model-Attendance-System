import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending data:", form);  // Debug: See what is being sent
    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/users/register/',
        form,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      alert('Registered successfully! Token: ' + res.data.token);
    } catch (err) {
      console.error('Registration Error:', err);  // View full error in console
      if (err.response) {
        alert('Registration failed: ' + JSON.stringify(err.response.data));
      } else {
        alert('Registration failed: ' + err.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
        type="email"
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        onChange={handleChange}
        required
      />
      <select name="role" onChange={handleChange}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
