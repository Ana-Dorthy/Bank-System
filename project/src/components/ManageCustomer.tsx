import React, { useState } from 'react';
import { Customer } from '../types';

interface ManageCustomerProps {
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  onUpdateCustomer: (id: string, customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  onDeleteCustomer: (id: string) => void;
}

export default function ManageCustomer({ customers, onAddCustomer, onUpdateCustomer, onDeleteCustomer }: ManageCustomerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    panNumber: '',
    aadharNumber: '',
    gender: '',
    maritalStatus: '',
    occupation: '',
    annualIncome: '',
    isActive: true
  });

  const handleInput = (field: string, value: string) => {
    let updatedValue = value;
    switch (field) {
      case 'phone':
        updatedValue = value.replace(/\D/g, '').slice(0, 10);
        break;
      case 'aadharNumber':
        updatedValue = value.replace(/\D/g, '').slice(0, 12);
        break;
      case 'panNumber':
        updatedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
        break;
      case 'annualIncome':
        updatedValue = value.replace(/[^0-9]/g, '');
        break;
      default:
        break;
    }
    setFormData(prev => ({ ...prev, [field]: updatedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      onUpdateCustomer(editingCustomer.id, formData);
      setEditingCustomer(null);
    } else {
      onAddCustomer(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      panNumber: '',
      aadharNumber: '',
      gender: '',
      maritalStatus: '',
      occupation: '',
      annualIncome: '',
      isActive: true
    });
    setIsFormOpen(false);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      dateOfBirth: customer.dateOfBirth,
      panNumber: customer.panNumber || '',
      aadharNumber: customer.aadharNumber,
      gender: customer.gender,
      maritalStatus: customer.maritalStatus,
      occupation: customer.occupation,
      annualIncome: customer.annualIncome,
      isActive: customer.isActive
    });
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    resetForm();
    setEditingCustomer(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Customers</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Add Customer
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput('First Name', formData.firstName, val => setFormData({ ...formData, firstName: val }), 'text', 'Enter first name')}
          {renderInput('Last Name', formData.lastName, val => setFormData({ ...formData, lastName: val }), 'text', 'Enter last name')}
          {renderInput('Email', formData.email, val => setFormData({ ...formData, email: val }), 'email', 'example@domain.com')}
          {renderInput('Phone', formData.phone, val => handleInput('phone', val), 'tel', '10-digit number')}
          {renderInput('Date of Birth', formData.dateOfBirth, val => setFormData({ ...formData, dateOfBirth: val }), 'date', '')}
          {renderInput('PAN Number', formData.panNumber, val => handleInput('panNumber', val), 'text', 'ABCDE1234F')}
          {renderInput('Aadhar Number', formData.aadharNumber, val => handleInput('aadharNumber', val), 'text', '12-digit number')}
          {renderInput('Gender', formData.gender, val => setFormData({ ...formData, gender: val }), 'text', 'Male/Female/Other')}
          {renderInput('Marital Status', formData.maritalStatus, val => setFormData({ ...formData, maritalStatus: val }), 'text', 'Single/Married')}
          {renderInput('Occupation', formData.occupation, val => setFormData({ ...formData, occupation: val }), 'text', 'e.g., Engineer')}
          {renderInput('Annual Income', formData.annualIncome, val => handleInput('annualIncome', val), 'text', 'Only numbers')}

          <div className="flex items-center gap-2">
            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
            <label className="text-sm font-medium text-gray-700">Active Customer</label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={3}
              placeholder="Enter full address"
            />
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              {editingCustomer ? 'Update Customer' : 'Add Customer'}
            </button>
            <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {customers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No customers registered yet. Add your first customer to get started.</p>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                  <div>
                    <h3 className="font-semibold text-gray-800">{customer.firstName} {customer.lastName}</h3>
                    <p className="text-sm text-gray-600">PAN: {customer.panNumber}</p>
                    <p className="text-sm text-gray-600">Aadhar: {customer.aadharNumber}</p>
                    <p className="text-sm text-gray-600">Gender: {customer.gender}</p>
                    <p className="text-sm text-gray-600">DOB: {new Date(customer.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email: {customer.email}</p>
                    <p className="text-sm text-gray-600">Phone: {customer.phone}</p>
                    <p className="text-sm text-gray-600">Occupation: {customer.occupation}</p>
                    <p className="text-sm text-gray-600">Income: {customer.annualIncome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address: {customer.address}</p>
                    <p className="text-sm text-gray-600">Marital: {customer.maritalStatus}</p>
                    <p className="text-sm text-gray-600">Status: {customer.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleEdit(customer)} className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg">Edit</button>
                  <button onClick={() => onDeleteCustomer(customer.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function renderInput(label: string, value: string, onChange: (val: string) => void, type: string = 'text', placeholder: string = '') {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        required
        placeholder={placeholder}
      />
    </div>
  );
}
