import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function EmployeeFormPage({ mode = 'add' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isEdit = mode === 'edit';
  const existingEmployee = location.state?.employee;

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    position: '',
    salary: '',
    date_of_joining: '',
  });

  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState('');

  // pre-fill form in edit mode
  useEffect(() => {
    if (isEdit && existingEmployee) {
      setForm({
        first_name: existingEmployee.first_name || '',
        last_name: existingEmployee.last_name || '',
        email: existingEmployee.email || '',
        department: existingEmployee.department || '',
        position: existingEmployee.position || '',
        salary: existingEmployee.salary || '',
        date_of_joining: existingEmployee.date_of_joining
          ? String(existingEmployee.date_of_joining).slice(0, 10)
          : '',
      });
    }
  }, [isEdit, existingEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === 'salary') {
          data.append(key, Number(value));
        } else {
          data.append(key, value);
        }
      });

      if (profilePic) {
       
        data.append('profilePic', profilePic);
      }

      if (isEdit) {
        await axiosClient.put(`/emp/employees/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axiosClient.post('/emp/employees', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate('/employees');
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || 'Failed to save employee';
      setError(msg);
    }
  };

 
  let existingPicUrl = null;
  if (isEdit && existingEmployee?.profilePicUrl) {
    existingPicUrl = existingEmployee.profilePicUrl.startsWith('http')
      ? existingEmployee.profilePicUrl
      : `http://localhost:8080${existingEmployee.profilePicUrl}`;
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h1>{isEdit ? 'Edit Employee' : 'Add Employee'}</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>
            First Name
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: 6 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Last Name
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: 6 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
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

        <div style={{ marginBottom: 10 }}>
          <label>
            Department
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: 6 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Position
            <input
              name="position"
              value={form.position}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: 6 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Salary
            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: 6 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Date of Joining
            <input
              type="date"
              name="date_of_joining"
              value={form.date_of_joining}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: 6 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Profile Picture
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'block', marginTop: 4 }}
            />
          </label>
        </div>

        {existingPicUrl && (
          <div style={{ marginBottom: 10 }}>
            <span>Current picture:</span>
            <br />
            <img
              src={existingPicUrl}
              alt="current profile"
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                objectFit: 'cover',
                marginTop: 4,
              }}
            />
          </div>
        )}

        {error && (
          <p style={{ color: 'red', marginBottom: 10 }}>{error}</p>
        )}

        <div style={{ marginTop: 10 }}>
          <button type="submit" style={{ marginRight: 10, padding: '6px 12px' }}>
            {isEdit ? 'Update' : 'Save'}
          </button>
          <button
            type="button"
            style={{ padding: '6px 12px' }}
            onClick={() => navigate('/employees')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
