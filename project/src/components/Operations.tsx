import React, { useState } from 'react';
import { Calculator, DollarSign, RefreshCw, CheckCircle, CreditCard, FileText } from 'lucide-react';
import { Bank, Branch, Customer } from '../types';

interface OperationsProps {
  banks: Bank[];
  branches: Branch[];
  customers: Customer[];
}

type Operation = {
  id: string;
  title: string;
  description: string;
};

const OPERATIONS: Operation[] = [
  { id: 'interest',    title: 'Interest Calculation',       description: 'Calculate daily/periodic interest on savings, term deposits, loans',   },
  { id: 'fees',        title: 'Fee & Charges',             description: 'Monthly maintenance fees, overdraft charges, late-payment penalties',  },
  { id: 'reconciliation', title: 'Transaction Reconciliation', description: "Compare the day's transaction log vs. core-banking ledger",               },
  { id: 'cheque',      title: 'Cheque Clearing',           description: 'Update account statuses once funds are cleared',           },
  { id: 'emi',         title: 'EMI Processing',            description: "On each due date, automatically debit EMI from borrower's account",  },
  // { id: 'settlement',  title: 'Interbank Settlement',      description: 'Net off ACH/NEFT/RTGS batches with the clearing house',      },
];

export default function Operations({ banks, branches, customers }: OperationsProps) {
  const [selectedOp, setSelectedOp] = useState<Operation>(OPERATIONS[0]);

  return (
    <div className="flex h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Left column: operation cards */}
      <div className="w-1/3 p-6 space-y-4 border-r border-gray-200 overflow-y-auto">
        <h2 className="text-2xl font-semibold">Core Banking Operations</h2>
        <p className="text-gray-600 mb-4">Select an operation to manage banking processes</p>
        <div className="grid gap-3">
          {OPERATIONS.map(op => {
            // const Icon = op.icon;
            const active = op.id === selectedOp.id;
            return (
              <div
                key={op.id}
                onClick={() => setSelectedOp(op)}
                className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-shadow ${
                  active ? 'ring-2 ring-teal-500 bg-teal-50' : 'hover:ring-1 hover:ring-gray-300'
                }`}
              >
                {/* <Icon className={`h-6 w-6 ${active ? 'text-teal-600' : 'text-gray-500'}`} /> */}
                <div>
                  <h3 className="font-medium text-gray-800">{op.title}</h3>
                  <p className="text-sm text-gray-600">{op.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right column: selected panel */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedOp.id === 'interest'      && <InterestCalculation />}
        {selectedOp.id === 'fees'          && <FeeCharges />}
        {selectedOp.id === 'reconciliation' && <Reconciliation />}
        {selectedOp.id === 'cheque'        && <ChequeClearing />}
        {selectedOp.id === 'emi'           && <EmiProcessing />}
        {/* {selectedOp.id === 'settlement'    && <Placeholder title="Interbank Settlement" />} */}
      </div>
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return <div className="text-gray-500 italic">{title} panel is under construction.</div>;
}

function InterestCalculation() {
  const [period, setPeriod] = useState<'daily'|'monthly'|'yearly'>('daily');
  const [principal, setPrincipal] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [interest, setInterest] = useState<number|null>(null);

  const handleExecute = () => {
    const timeFactor = period === 'daily' ? 1/365 : period === 'monthly' ? 1/12 : 1;
    const intr = (principal * rate * timeFactor) / 100;
    setInterest(parseFloat(intr.toFixed(2)));
  };

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">Interest Calculation</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Interest Period</label>
          <select
            value={period}
            onChange={e => setPeriod(e.target.value as any)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Principal Amount (₹)</label>
          <input
            type="number"
            value={principal}
            onChange={e => setPrincipal(+e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Interest Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={e => setRate(+e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <button
          onClick={handleExecute}
          className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700"
        >
          Execute
        </button>
        {interest !== null && (
          <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <p className="text-gray-700">Calculated Interest:</p>
            <p className="text-2xl font-bold text-teal-600">₹{interest.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FeeCharges() {
  const [feeType,      setFeeType]      = useState<string>('');
  const [accountNumber,setAccountNumber]= useState<string>('');
  const [amount,        setAmount]       = useState<string>('');

  const handleExecute = () => console.log({ feeType, accountNumber, amount });

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-white bg-orange-600 p-3 rounded-t-lg">Fee &amp; Charges</h2>
      <div className="bg-white p-6 rounded-b-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Fee Type</label>
            <select
              value={feeType}
              onChange={e => setFeeType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select fee type</option>
              <option>Maintenance</option>
              <option>Overdraft</option>
              <option>Late Payment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter account no."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Fee Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter amount"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button className="px-6 py-2 bg-gray-300 rounded-lg">Cancel</button>
            <button onClick={handleExecute} className="px-6 py-2 bg-orange-500 text-white rounded-lg">
              Execute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Reconciliation() {
  const [date,       setDate]      = useState<string>('');
  const [branchCode, setBranchCode]= useState<string>('');
  const handleExec   = () => console.log({ date, branchCode });

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-white bg-blue-600 p-3 rounded-t-lg">Transaction Reconciliation</h2>
      <div className="bg-white p-6 rounded-b-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Reconciliation Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Branch Code</label>
            <input
              type="text"
              value={branchCode}
              onChange={e => setBranchCode(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter branch code"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button className="px-6 py-2 bg-gray-300 rounded-lg">Cancel</button>
            <button onClick={handleExec} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
              Execute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChequeClearing() {
  const [chequeNo, setChequeNo] = useState<string>('');
  const [status,   setStatus]   = useState<string>('');
  const [amt,      setAmt]       = useState<string>('');
  const handleExec = () => console.log({ chequeNo, status, amt });

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-white bg-purple-600 p-3 rounded-t-lg">Cheque Clearing</h2>
      <div className="bg-white p-6 rounded-b-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Cheque Number</label>
            <input
              type="text"
              value={chequeNo}
              onChange={e => setChequeNo(e.target.value)} className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select status</option>
              <option>Cleared</option>
              <option>Bounced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Amount (₹)</label>
            <input
              type="number"
              value={amt}
              onChange={e => setAmt(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button className="px-6 py-2 bg-gray-300 rounded-lg">Cancel</button>
            <button onClick={handleExec} className="px-6 py-2 bg-purple-600 text-white rounded-lg">
              Execute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmiProcessing() {
  const [loanAccNo, setLoanAccNo] = useState<string>('');
  const [dueDate,   setDueDate]   = useState<string>('');
  const handleExec  = () => console.log({ loanAccNo, dueDate });

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-white bg-green-600 p-3 rounded-t-lg">EMI Processing</h2>
      <div className="bg-white p-6 rounded-b-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Loan Account No.</label>
            <input
              type="text"
              value={loanAccNo}
              onChange={e => setLoanAccNo(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">EMI Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button className="px-6 py-2 bg-gray-300 rounded-lg">Cancel</button>
            <button onClick={handleExec} className="px-6 py-2 bg-green-600 text-white rounded-lg">
              Execute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}