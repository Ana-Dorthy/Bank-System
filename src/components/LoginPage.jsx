import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


// const banks = [
//   { id: 'sbi', name: 'SBI Bank', accountNumberLimit: 11 },
//   { id: 'hdfc', name: 'HDFC Bank', accountNumberLimit: 16 },
//   { id: 'icici', name: 'ICICI Bank', accountNumberLimit: 12 },
// ];

export default function LoginPage() {
  const [selectedBankId, setSelectedBankId] = useState('');
  const [customerNo, setCustomerNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();


//   const selectedBank = banks.find(bank => bank.id === selectedBankId);
//   console.log(selectedBankId,"sbs");
  const maxLength =  9;

  const handleCustomerNoChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); 
  
    if (value.length <= maxLength) {
      const formatted = value.match(/.{1,3}/g)?.join(' ') || '';
      setCustomerNo(formatted);
    }
    // console.log("Cust No: ",checkingg);
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerNo || !password || !/^[a-zA-Z0-9]*$/.test(password)) return;
  
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md border">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">IndoSecure</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Bank</label>
            <select
              value={selectedBankId}
              onChange={(e) => {
                setSelectedBankId(e.target.value);
                setCustomerNo('');
              }}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Choose Bank --</option>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>{bank.name}</option>
              ))}
            </select>
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
            <input
              type="text"
              value={customerNo}
              onChange={handleCustomerNoChange}
              className="w-full px-4 py-2 border rounded"
              placeholder={`Enter ${maxLength}-digit customer id`}
            //   disabled={!selectedBankId}
            // disabled={
            //     isLoading ||
            //     !customerNo ||
            //     !password ||
            //     customerNo.replace(/\s/g, '').length !== maxLength ||
            //     !/^[a-zA-Z0-9]*$/.test(password)
            //   }              
              required
            />
            {/* {selectedBank && ( */}
              <p className="text-xs text-gray-500 mt-1">
              {customerNo.replace(/\s/g, '').length}/{maxLength} digits
              </p>
            {/* )} */}
          </div>

          <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full px-4 py-2 border rounded pr-10"
      placeholder="Enter your password"
      required
    />
    <button
      type="button"
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-600"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? 'Hide' : 'Show'}
    </button>
  </div>

  {!/^[a-zA-Z0-9]*$/.test(password) && (
    <p className="text-xs text-red-600 mt-1">Password can only contain letters and numbers.</p>
  )}
</div>


          <button
            type="submit"
            disabled={
                isLoading ||
                !customerNo ||
                !password ||
                customerNo.replace(/\s/g, '').length !== maxLength ||
                !/^[a-zA-Z0-9]*$/.test(password)
              }              
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-500 text-center">
         password: demo123
        </div>
      </div>
    </div>
  );
}
//    Demo: SBI 12345678901, HDFC 1234567890123456, ICICI 123456789012,
