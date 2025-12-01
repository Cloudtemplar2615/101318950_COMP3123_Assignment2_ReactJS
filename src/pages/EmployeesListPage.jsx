import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export default function EmployeesListPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');

  const fetchEmployees = async () => {
    try {
      setError('');
      const res = await axiosClient.get('/emp/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;

    try {
      await axiosClient.delete(`/emp/employees?eid=${id}`);
      setEmployees((prev) =>
        prev.filter((e) => (e.employee_id || e._id) !== id)
      );
    } catch (err) {
      console.error(err);
      alert('Failed to delete employee');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesDept = departmentFilter
      ? emp.department?.toLowerCase().includes(departmentFilter.toLowerCase())
      : true;

    const matchesPos = positionFilter
      ? emp.position?.toLowerCase().includes(positionFilter.toLowerCase())
      : true;

    return matchesDept && matchesPos;
  });

  return (
    <div className="page">
      <div className="card">
        <header className="page-header">
          <h1 className="page-title">Employees</h1>
          <div>
            <button
              className="btn btn-primary"
              style={{ marginRight: 8 }}
              onClick={() => navigate('/employees/add')}
            >
              Add Employee
            </button>
            <button className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <form className="filters" onSubmit={(e) => e.preventDefault()}>
          <input
            placeholder="Filter by department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          />
          <input
            placeholder="Filter by position"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
          />
        </form>

        {error && <p className="error-text">{error}</p>}

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pic</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => {
                const imgUrl = emp.profilePicUrl
                  ? emp.profilePicUrl.startsWith('http')
                    ? emp.profilePicUrl
                    : `http://localhost:8080${emp.profilePicUrl}`
                  : null;

                return (
                  <tr key={emp.employee_id || emp._id}>
                    <td>
                      {imgUrl && (
                        <img
                          src={imgUrl}
                          alt="profile"
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      )}
                    </td>
                    <td>
                      {emp.first_name} {emp.last_name}
                    </td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
                    <td>{emp.position}</td>
                    <td>
                      <button
                        className="btn btn-outline"
                        style={{ marginRight: 6 }}
                        onClick={() =>
                          navigate(
                            `/employees/${emp.employee_id || emp._id}/edit`,
                            { state: { employee: emp } }
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          handleDelete(emp.employee_id || emp._id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={6}>No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
