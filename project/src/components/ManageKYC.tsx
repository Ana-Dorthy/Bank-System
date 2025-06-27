import React, { useState } from 'react';
import { Bank, Customer, KYC } from '../types';

interface ManageKYCProps {
  banks: Bank[];
  customers: Customer[];
  kycRecords: KYC[];
  onAddKYC: (kyc: Omit<KYC, 'id' | 'createdAt'>) => void;
  onUpdateKYC: (id: string, kyc: Omit<KYC, 'id' | 'createdAt'>) => void;
  onDeleteKYC: (id: string) => void;
}

export default function ManageKYC({ banks, customers, kycRecords, onAddKYC, onUpdateKYC, onDeleteKYC }: ManageKYCProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingKYC, setEditingKYC] = useState<KYC | null>(null);

  const [formData, setFormData] = useState({
    customerId: '',
    panNumber: '',
    linkedBanks: [] as string[],
    documentType: '',
    documentNumber: '',
    documentProof: '',
    verificationStatus: 'pending' as 'pending' | 'verified' | 'rejected',
    issuedDate: '',
    expiryDate: '',
    placeOfIssue: ''
  });

  const resetForm = () => {
    setFormData({
      customerId: '',
      panNumber: '',
      linkedBanks: [],
      documentType: '',
      documentNumber: '',
      documentProof: '',
      verificationStatus: 'pending',
      issuedDate: '',
      expiryDate: '',
      placeOfIssue: ''
    });
    setEditingKYC(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingKYC) {
      onUpdateKYC(editingKYC.id, formData);
    } else {
      onAddKYC(formData);
    }
    resetForm();
  };

  const handleEdit = (kyc: KYC) => {
    setEditingKYC(kyc);
    setFormData({
      customerId: kyc.customerId,
      panNumber: kyc.panNumber || '',
      linkedBanks: kyc.linkedBanks,
      documentType: kyc.documentType,
      documentNumber: kyc.documentNumber,
      documentProof: kyc.documentProof || '',
      verificationStatus: kyc.verificationStatus,
      issuedDate: kyc.issuedDate || '',
      expiryDate: kyc.expiryDate || '',
      placeOfIssue: kyc.placeOfIssue || ''
    });
    setIsFormOpen(true);
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setFormData({
      ...formData,
      customerId,
      panNumber: customer?.panNumber ?? ''
    });
  };

  const handleBankSelection = (bankId: string, checked: boolean) => {
    const updated = checked
      ? [...formData.linkedBanks, bankId]
      : formData.linkedBanks.filter(id => id !== bankId);
    setFormData({ ...formData, linkedBanks: updated });
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage KYC</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
        >
          Add KYC Record
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Customer</label>
            <select
              required
              value={formData.customerId}
              onChange={(e) => handleCustomerChange(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select a customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} - {c.panNumber || 'No PAN'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">PAN Number (Optional)</label>
            <input
              type="text"
              readOnly
              value={formData.panNumber}
              className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Document Type</label>
            <select
              required
              value={formData.documentType}
              onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select type</option>
              <option value="Aadhaar">Aadhaar Card</option>
              {/* <option value="Voter ID">Voter ID</option>
              <option value="Passport">Passport</option>
              <option value="Driving License">Driving License</option> */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Document Number</label>
            <input
              type="text"
              required
              value={formData.documentNumber}
              onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Issued Date</label>
            <input
              type="date"
              value={formData.issuedDate}
              onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Place of Issue</label>
            <input
              type="text"
              value={formData.placeOfIssue}
              onChange={(e) => setFormData({ ...formData, placeOfIssue: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="col-span-1">
  <label className="block text-sm font-medium text-gray-700 mb-2">Document Proof</label>

  <div className="flex items-center space-x-4">
    <label
      htmlFor="upload-proof"
      className="cursor-pointer inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-orange-700 transition-colors"
    >
       Choose 
    </label>
    <span className="text-sm text-gray-600 truncate w-2/3">
      {formData.documentProof ? 'File Uploaded ' : 'No file chosen'}
    </span>
  </div>

  <input
    id="upload-proof"
    type="file"
    accept="application/pdf"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, documentProof: reader.result as string });
        };
        reader.readAsDataURL(file);
      }
    }}
    className="hidden"
  />
</div>


          <div>
            <label className="block text-sm font-medium mb-1">Verification Status</label>
            <select
              required
              value={formData.verificationStatus}
              onChange={(e) =>
                setFormData({ ...formData, verificationStatus: e.target.value as 'pending' | 'verified' | 'rejected' })
              }
              className="w-full border px-3 py-2 rounded"
            >
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Linked Banks</label>
            <div className="flex flex-wrap gap-3">
              {banks.map((bank) => (
                <label key={bank.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.linkedBanks.includes(bank.id)}
                    onChange={(e) => handleBankSelection(bank.id, e.target.checked)}
                  />
                  {bank.name}
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex gap-4">
            <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
              {editingKYC ? 'Update KYC' : 'Add KYC'}
            </button>
            <button type="button" onClick={resetForm} className="bg-gray-300 px-6 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {kycRecords.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No KYC records yet.</p>
        ) : (
          kycRecords.map((kyc) => (
            <div key={kyc.id} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-bold">{getCustomerName(kyc.customerId)}</h4>
                  <p className="text-sm">PAN: {kyc.panNumber || 'N/A'}</p>
                  <p className="text-sm">Type: {kyc.documentType}</p>
                  <p className="text-sm">Doc No: {kyc.documentNumber}</p>
                  <p className="text-sm">Issued: {kyc.issuedDate || 'N/A'}</p>
                  <p className="text-sm">Expiry: {kyc.expiryDate || 'N/A'}</p>
                  <p className="text-sm">Place of Issue: {kyc.placeOfIssue || 'N/A'}</p>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(kyc.verificationStatus)}`}>
                    {kyc.verificationStatus}
                  </span>
                  {kyc.documentProof && (
                    <div className="mt-2 flex gap-3">
                      <a
                        href={kyc.documentProof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        View PDF
                      </a>
                      <a
                        href={kyc.documentProof}
                        download={`kyc-document-${kyc.id}.pdf`}
                        className="text-green-600 underline text-sm"
                      >
                        Download PDF
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(kyc)} className="text-orange-600 hover:underline text-sm">
                    Edit
                  </button>
                  <button onClick={() => onDeleteKYC(kyc.id)} className="text-red-600 hover:underline text-sm">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
