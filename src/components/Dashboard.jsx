import React from "react";

const banks = [
  { id: "sbi", name: "SBI Bank", accountNumber: "1234-567-8901", balance: "₹1,50,000.00" },
  { id: "hdfc", name: "HDFC Bank", accountNumber: "1234-567-8902", balance: "₹80,250.75" },
  { id: "icici", name: "ICICI Bank", accountNumber: "1234-567-8903", balance: "₹42,900.25" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center py-4 px-6 bg-white shadow-md">
        <div className="flex items-center space-x-2">
          {/* <div className="bg-blue-600 text-white rounded-full p-2 font-bold">SB</div> */}
          <div>
            <h1 className="text-xl font-semibold">IndoSecure</h1>
            <p className="text-sm text-gray-600">Welcome Prasanna!</p>
          </div>
        </div>
        <button className="text-blue-600 font-medium">Sign Out</button>
      </header>

      <main className="max-w-4xl mx-auto mt-8">
        <div className="bg-blue-600 text-white rounded-xl p-6 mb-6">
          <h2 className="text-sm">Total Balance</h2>
          <p className="text-3xl font-bold">₹2,73,150.00</p>
          <div className="text-sm mt-2">Accounts: 3 | Customer No: 717 621 310</div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Select a Bank</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {banks.map((bank) => (
            <div key={bank.id} className="bg-white rounded-xl shadow p-4 border hover:shadow-lg transition">
              <div className="text-lg font-semibold text-gray-800">{bank.name}</div>
              <div className="text-sm text-gray-500 mb-2">{bank.accountNumber}</div>
              <div className="text-sm text-gray-600">Account Balance</div>
              <div className="text-xl font-bold text-green-600">{bank.balance}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
