import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axiosClient.post('/user/signup', form);
      setSuccess('Account created. You can log in now.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || 'Signup failed. Please try again.';
      setError(msg);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Username
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: 6 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: 6 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: 6 }}
            />
          </label>
        </div>

        {error && <p style={{ color: 'red', marginBottom: 8 }}>{error}</p>}
        {success && <p style={{ color: 'green', marginBottom: 8 }}>{success}</p>}

        <button type="submit" style={{ padding: '8px 16px' }}>
          Sign Up
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

