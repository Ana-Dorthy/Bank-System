import React, { useState, useEffect } from 'react';
import { Bank, Branch, Customer, KYC, Employee, Account, Transaction } from './types';
import ManageBank from './components/ManageBank';
import ManageBranch from './components/ManageBranch';
import ManageCustomer from './components/ManageCustomer';
import ManageKYC from './components/ManageKYC';
import ManageEmployee from './components/ManageEmployee';
import Operations from './components/Operations';
import { banksApi, branchesApi, customersApi, kycApi, employeesApi, accountsApi, transactionsApi } from './services/api';

type ActiveTab = 'banks' | 'branches' | 'customers' | 'kyc' | 'employees' | 'operations';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('banks');
  const [loading, setLoading] = useState(false);
  
  const [banks, setBanks] = useState<Bank[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [kycRecords, setKycRecords] = useState<KYC[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [banksData, branchesData, customersData, kycData, employeesData, accountsData, transactionsData] = await Promise.all([
        banksApi.getAll(),
        branchesApi.getAll(),
        customersApi.getAll(),
        kycApi.getAll(),
        employeesApi.getAll(),
        accountsApi.getAll(),
        transactionsApi.getAll(),
      ]);

      setBanks(banksData);
      setBranches(branchesData);
      setCustomers(customersData);
      setKycRecords(kycData);
      setEmployees(employeesData);
      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data from database. Please check if MongoDB is running.');
    } finally {
      setLoading(false);
    }
  };

  const addBank = async (bankData: Omit<Bank, 'id' | 'createdAt'>) => {
    try {
      const newBank = await banksApi.create(bankData);
      setBanks(prev => [...prev, newBank]);
    } catch (error) {
      console.error('Error adding bank:', error);
      alert('Error adding bank');
    }
  };

  const updateBank = async (id: string, bankData: Omit<Bank, 'id' | 'createdAt'>) => {
    try {
      const updatedBank = await banksApi.update(id, bankData);
      setBanks(prev => prev.map(bank => 
        bank.id === id ? updatedBank : bank
      ));
    } catch (error) {
      console.error('Error updating bank:', error);
      alert('Error updating bank');
    }
  };

  const deleteBank = async (id: string) => {
    try {
      await banksApi.delete(id);
      setBanks(prev => prev.filter(bank => bank.id !== id));
      setBranches(prev => prev.filter(branch => branch.bankId !== id));
      setEmployees(prev => prev.filter(employee => employee.bankId !== id));
    } catch (error) {
      console.error('Error deleting bank:', error);
      alert('Error deleting bank');
    }
  };

  const addBranch = async (branchData: Omit<Branch, 'id' | 'createdAt'>) => {
    try {
      const newBranch = await branchesApi.create(branchData);
      setBranches(prev => [...prev, newBranch]);
    } catch (error) {
      console.error('Error adding branch:', error);
      alert('Error adding branch');
    }
  };

  const updateBranch = async (id: string, branchData: Omit<Branch, 'id' | 'createdAt'>) => {
    try {
      const updatedBranch = await branchesApi.update(id, branchData);
      setBranches(prev => prev.map(branch => 
        branch.id === id ? updatedBranch : branch
      ));
    } catch (error) {
      console.error('Error updating branch:', error);
      alert('Error updating branch');
    }
  };

  const deleteBranch = async (id: string) => {
    try {
      await branchesApi.delete(id);
      setBranches(prev => prev.filter(branch => branch.id !== id));
      setEmployees(prev => prev.filter(employee => employee.branchId !== id));
    } catch (error) {
      console.error('Error deleting branch:', error);
      alert('Error deleting branch');
    }
  };

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    try {
      const newCustomer = await customersApi.create(customerData);
      setCustomers(prev => [...prev, newCustomer]);
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Error adding customer');
    }
  };

  const updateCustomer = async (id: string, customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    try {
      const updatedCustomer = await customersApi.update(id, customerData);
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? updatedCustomer : customer
      ));
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Error updating customer');
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await customersApi.delete(id);
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      setKycRecords(prev => prev.filter(kyc => kyc.customerId !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Error deleting customer');
    }
  };

  const addKYC = async (kycData: Omit<KYC, 'id' | 'createdAt'>) => {
    try {
      const newKYC = await kycApi.create(kycData);
      setKycRecords(prev => [...prev, newKYC]);
    } catch (error) {
      console.error('Error adding KYC:', error);
      alert('Error adding KYC record');
    }
  };

  const updateKYC = async (id: string, kycData: Omit<KYC, 'id' | 'createdAt'>) => {
    try {
      const updatedKYC = await kycApi.update(id, kycData);
      setKycRecords(prev => prev.map(kyc => 
        kyc.id === id ? updatedKYC : kyc
      ));
    } catch (error) {
      console.error('Error updating KYC:', error);
      alert('Error updating KYC record');
    }
  };

  const deleteKYC = async (id: string) => {
    try {
      await kycApi.delete(id);
      setKycRecords(prev => prev.filter(kyc => kyc.id !== id));
    } catch (error) {
      console.error('Error deleting KYC:', error);
      alert('Error deleting KYC record');
    }
  };

  const addEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
    try {
      const newEmployee = await employeesApi.create(employeeData);
      setEmployees(prev => [...prev, newEmployee]);
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee');
    }
  };

  const updateEmployee = async (id: string, employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
    try {
      const updatedEmployee = await employeesApi.update(id, employeeData);
      setEmployees(prev => prev.map(employee => 
        employee.id === id ? updatedEmployee : employee
      ));
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error updating employee');
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await employeesApi.delete(id);
      setEmployees(prev => prev.filter(employee => employee.id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee');
    }
  };

  const addAccount = async (accountData: Omit<Account, 'id' | 'createdAt'>) => {
    try {
      const newAccount = await accountsApi.create(accountData);
      setAccounts(prev => [...prev, newAccount]);
      
      if (accountData.balance > 0) {
        const transactionData = {
          accountId: newAccount.id,
          type: 'deposit' as const,
          amount: accountData.balance,
          balance: accountData.balance,
          description: 'Initial Deposit',
          referenceNumber: `TXN${Date.now()}`
        };
        const newTransaction = await transactionsApi.create(transactionData);
        setTransactions(prev => [...prev, newTransaction]);
      }
    } catch (error) {
      console.error('Error adding account:', error);
      alert('Error adding account');
    }
  };

  const handleDeposit = async (accountId: string, amount: number, description: string) => {
    try {
      const account = accounts.find(acc => acc.id === accountId);
      if (!account) return;

      const newBalance = account.balance + amount;
      
      await accountsApi.update(accountId, { ...account, balance: newBalance });
      setAccounts(prev => prev.map(acc => 
        acc.id === accountId ? { ...acc, balance: newBalance } : acc
      ));

      const transactionData = {
        accountId,
        type: 'deposit' as const,
        amount,
        balance: newBalance,
        description,
        referenceNumber: `TXN${Date.now()}`
      };
      const newTransaction = await transactionsApi.create(transactionData);
      setTransactions(prev => [...prev, newTransaction]);

      alert('Deposit successful!');
    } catch (error) {
      console.error('Error processing deposit:', error);
      alert('Error processing deposit');
    }
  };

  const handleWithdraw = async (accountId: string, amount: number, description: string) => {
    try {
      const account = accounts.find(acc => acc.id === accountId);
      if (!account || account.balance < amount) return;

      const newBalance = account.balance - amount;
      
      await accountsApi.update(accountId, { ...account, balance: newBalance });
      setAccounts(prev => prev.map(acc => 
        acc.id === accountId ? { ...acc, balance: newBalance } : acc
      ));

      const transactionData = {
        accountId,
        type: 'withdraw' as const,
        amount,
        balance: newBalance,
        description,
        referenceNumber: `TXN${Date.now()}`
      };
      const newTransaction = await transactionsApi.create(transactionData);
      setTransactions(prev => [...prev, newTransaction]);

      alert('Withdrawal successful!');
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('Error processing withdrawal');
    }
  };

  const handleTransfer = async (fromAccountId: string, toAccountId: string, amount: number, description: string) => {
    try {
      const fromAccount = accounts.find(acc => acc.id === fromAccountId);
      const toAccount = accounts.find(acc => acc.id === toAccountId);
      
      if (!fromAccount || !toAccount || fromAccount.balance < amount) return;

      const fromNewBalance = fromAccount.balance - amount;
      const toNewBalance = toAccount.balance + amount;
      const refNumber = `TXN${Date.now()}`;
      
      await accountsApi.update(fromAccountId, { ...fromAccount, balance: fromNewBalance });
      await accountsApi.update(toAccountId, { ...toAccount, balance: toNewBalance });
      
      setAccounts(prev => prev.map(acc => {
        if (acc.id === fromAccountId) return { ...acc, balance: fromNewBalance };
        if (acc.id === toAccountId) return { ...acc, balance: toNewBalance };
        return acc;
      }));

      const fromTransactionData = {
        accountId: fromAccountId,
        type: 'transfer_out' as const,
        amount,
        balance: fromNewBalance,
        description,
        referenceNumber: refNumber,
        toAccountId
      };
      
      const toTransactionData = {
        accountId: toAccountId,
        type: 'transfer_in' as const,
        amount,
        balance: toNewBalance,
        description,
        referenceNumber: refNumber
      };

      const [fromTransaction, toTransaction] = await Promise.all([
        transactionsApi.create(fromTransactionData),
        transactionsApi.create(toTransactionData)
      ]);

      setTransactions(prev => [...prev, fromTransaction, toTransaction]);

      alert('Transfer successful!');
    } catch (error) {
      console.error('Error processing transfer:', error);
      alert('Error processing transfer');
    }
  };

  const tabs = [
    { id: 'banks' as ActiveTab, label: 'Manage Banks',  color: 'blue' },
    { id: 'branches' as ActiveTab, label: 'Manage Branches',  color: 'green', disabled: banks.length === 0 },
    { id: 'customers' as ActiveTab, label: 'Customers', color: 'purple' },
    { id: 'kyc' as ActiveTab, label: 'Manage KYC',  color: 'orange' },
    { id: 'employees' as ActiveTab, label: 'Manage Employees', color: 'indigo' },
    { id: 'operations' as ActiveTab, label: 'Operations', color: 'teal' }
  ];

  const getTabColorClasses = (color: string, isActive: boolean, isDisabled: boolean) => {
    if (isDisabled) {
      return 'bg-gray-100 text-gray-400 cursor-not-allowed';
    }
    
    const colorMap = {
      blue: isActive ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50',
      green: isActive ? 'bg-green-600 text-white' : 'bg-white text-green-600 hover:bg-green-50',
      purple: isActive ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 hover:bg-purple-50',
      orange: isActive ? 'bg-orange-600 text-white' : 'bg-white text-orange-600 hover:bg-orange-50',
      indigo: isActive ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 hover:bg-indigo-50',
      teal: isActive ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 hover:bg-teal-50'
    };
    
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data from MongoDB...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Bank Management System</h1>
          <p className="text-gray-600">Comprehensive banking operations management platform with MongoDB</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tabs.map((tab) => {
            // const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isDisabled = tab.disabled;
            
            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && setActiveTab(tab.id)}
                disabled={isDisabled}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm ${getTabColorClasses(tab.color, isActive, isDisabled)}`}
                title={isDisabled ? 'Create a bank first to enable this feature' : ''}
              >
                {tab.label}
                {isDisabled && (
                  <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1 rounded">
                    Disabled
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="max-w-7xl mx-auto">
          {activeTab === 'banks' && (
            <ManageBank
              banks={banks}
              onAddBank={addBank}
              onUpdateBank={updateBank}
              onDeleteBank={deleteBank}
            />
          )}
          
          {activeTab === 'branches' && (
            <ManageBranch
              banks={banks}
              branches={branches}
              onAddBranch={addBranch}
              onUpdateBranch={updateBranch}
              onDeleteBranch={deleteBranch}
            />
          )}

          {activeTab === 'customers' && (
            <ManageCustomer
              customers={customers}
              onAddCustomer={addCustomer}
              onUpdateCustomer={updateCustomer}
              onDeleteCustomer={deleteCustomer}
            />
          )}

          {activeTab === 'kyc' && (
            <ManageKYC
              banks={banks}
              customers={customers}
              kycRecords={kycRecords}
              onAddKYC={addKYC}
              onUpdateKYC={updateKYC}
              onDeleteKYC={deleteKYC}
            />
          )}

          {activeTab === 'employees' && (
            <ManageEmployee
              banks={banks}
              branches={branches}
              employees={employees}
              onAddEmployee={addEmployee}
              onUpdateEmployee={updateEmployee}
              onDeleteEmployee={deleteEmployee}
            />
          )}

          {activeTab === 'operations' && (
            <Operations
              banks={banks}
              branches={branches}
              customers={customers}
              accounts={accounts}
              transactions={transactions}
              onAddAccount={addAccount}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              onTransfer={handleTransfer}
            />
          )}
        </div>

      </div>
    </div>
  );
}

export default App;