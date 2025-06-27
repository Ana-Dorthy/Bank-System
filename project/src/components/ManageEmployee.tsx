import React, { useState } from 'react';
import { Bank, Branch, Employee } from '../types';

interface ManageEmployeeProps {
  banks: Bank[];
  branches: Branch[];
  employees: Employee[];
  onAddEmployee: (employee: Omit<Employee, 'id' | 'createdAt'>) => void;
  onUpdateEmployee: (id: string, employee: Omit<Employee, 'id' | 'createdAt'>) => void;
  onDeleteEmployee: (id: string) => void;
}

export default function ManageEmployee({
  banks,
  branches,
  employees,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
}: ManageEmployeeProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bankId: '',
    branchId: '',
    role: '',
    employeeId: '',
    hireDate: '',
    salary: 0,
    address: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    nationality: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const filteredBranches = branches.filter(branch => branch.bankId === formData.bankId);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Phone must be 10 digits';
    }

    if (!formData.bankId) errors.bankId = 'Bank is required';
    if (!formData.branchId) errors.branchId = 'Branch is required';
    if (!formData.role) errors.role = 'Role is required';
    if (!formData.employeeId.trim()) errors.employeeId = 'Employee ID is required';
    if (!formData.hireDate) errors.hireDate = 'Hire date is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.maritalStatus) errors.maritalStatus = 'Marital status is required';
    if (!formData.nationality.trim()) errors.nationality = 'Nationality is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = { ...formData };
    if (editingEmployee) {
      onUpdateEmployee(editingEmployee.id, payload);
      setEditingEmployee(null);
    } else {
      onAddEmployee(payload);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bankId: '',
      branchId: '',
      role: '',
      employeeId: '',
      hireDate: '',
      salary: 0,
      address: '',
      gender: '',
      dateOfBirth: '',
      maritalStatus: '',
      nationality: '',
    });
    setFormErrors({});
    setIsFormOpen(false);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      bankId: employee.bankId,
      branchId: employee.branchId,
      role: employee.role,
      employeeId: employee.employeeId,
      hireDate: employee.hireDate,
      salary: employee.salary,
      address: employee.address || '',
      gender: employee.gender || '',
      dateOfBirth: employee.dateOfBirth || '',
      maritalStatus: employee.maritalStatus || '',
      nationality: employee.nationality || '',
    });
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    resetForm();
    setEditingEmployee(null);
  };

  const handleBankChange = (bankId: string) => {
    setFormData({ ...formData, bankId, branchId: '' });
  };

  const getBankName = (bankId: string) => banks.find(b => b.id === bankId)?.name || 'Unknown Bank';
  const getBranchName = (branchId: string) => branches.find(b => b.id === branchId)?.name || 'Unknown Branch';

  const renderError = (field: string) =>
    formErrors[field] && <p className="text-red-600 text-sm mt-1">{formErrors[field]}</p>;

  const formFields = [
    { label: 'First Name', key: 'firstName', type: 'text', maxLength: 50, placeholder: 'John' },
    { label: 'Last Name', key: 'lastName', type: 'text', maxLength: 50, placeholder: 'Doe' },
    { label: 'Email', key: 'email', type: 'email', placeholder: 'example@domain.com' },
    { label: 'Phone', key: 'phone', type: 'tel', maxLength: 10, placeholder: '1234567890' },
    { label: 'Employee ID', key: 'employeeId', type: 'text', maxLength: 20, placeholder: 'EMP12345' },
    { label: 'Hire Date', key: 'hireDate', type: 'date' },
    { label: 'Salary', key: 'salary', type: 'number', min: 0, max: 1000000, placeholder: '50000' },
    { label: 'Address', key: 'address', type: 'text', placeholder: '123 Main St, City' },
    { label: 'Date of Birth', key: 'dateOfBirth', type: 'date' },
    { label: 'Nationality', key: 'nationality', type: 'text', maxLength: 30, placeholder: 'American' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Employees</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Add Employee
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg mb-6">
          {formFields.map(({ label, key, type, ...rest }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                value={(formData as any)[key]}
                placeholder={rest.placeholder}
                maxLength={rest.maxLength}
                min={rest.min}
                max={rest.max}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [key]: type === 'number' ? +e.target.value : e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {renderError(key)}
            </div>
          ))}

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {renderError('gender')}
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
            <select
              value={formData.maritalStatus}
              onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
            {renderError('maritalStatus')}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select role</option>
              <option value="Manager">Manager</option>
              <option value="Cashier">Cashier</option>
              <option value="Loan Officer">Loan Officer</option>
              <option value="IT Support">IT Support</option>
            </select>
            {renderError('role')}
          </div>

          {/* Bank */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
            <select
              value={formData.bankId}
              onChange={(e) => handleBankChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select a bank</option>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
            {renderError('bankId')}
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <select
              disabled={!formData.bankId}
              value={formData.branchId}
              onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select a branch</option>
              {filteredBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            {renderError('branchId')}
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex gap-3 mt-4">
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              {editingEmployee ? 'Update Employee' : 'Add Employee'}
            </button>
            <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-4">
        {employees.length === 0 ? (
          <p className="text-center text-gray-500">No employees added yet.</p>
        ) : (
          employees.map((employee) => (
            <div key={employee.id} className="p-4 border rounded bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{employee.firstName} {employee.lastName}</h3>
                  <p className="text-sm">ID: {employee.employeeId}</p>
                  <p className="text-sm">Email: {employee.email}</p>
                  <p className="text-sm">Phone: {employee.phone}</p>
                  <p className="text-sm">Role: {employee.role}</p>
                  <p className="text-sm">Gender: {employee.gender}</p>
                  <p className="text-sm">Nationality: {employee.nationality}</p>
                  <p className="text-sm">Bank: {getBankName(employee.bankId)}</p>
                  <p className="text-sm">Branch: {getBranchName(employee.branchId)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(employee)} className="text-indigo-600 underline">Edit</button>
                  <button onClick={() => onDeleteEmployee(employee.id)} className="text-red-600 underline">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
