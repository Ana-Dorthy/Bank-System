import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const PORT = 5000;

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'Banking';

let db;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase JSON payload limit to 10 MB
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Helper function to convert MongoDB _id to id
const transformDocument = (doc) => {
  if (doc) {
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest };
  }
  return doc;
};

// Banks API Routes
app.get('/api/banks', async (req, res) => {
  try {
    const banks = await db.collection('banks').find({}).toArray();
    res.json(banks.map(transformDocument));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/banks', async (req, res) => {
  try {
    const bankData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const result = await db.collection('banks').insertOne(bankData);
    const newBank = await db.collection('banks').findOne({ _id: result.insertedId });
    res.status(201).json(transformDocument(newBank));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/banks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.createdAt;
    
    await db.collection('banks').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    const updatedBank = await db.collection('banks').findOne({ _id: new ObjectId(id) });
    res.json(transformDocument(updatedBank));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/banks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete related branches and employees
    await db.collection('branches').deleteMany({ bankId: id });
    await db.collection('employees').deleteMany({ bankId: id });
    
    await db.collection('banks').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Bank deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Branches API Routes
app.get('/api/branches', async (req, res) => {
  try {
    const branches = await db.collection('branches').find({}).toArray();
    res.json(branches.map(transformDocument));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/branches', async (req, res) => {
  try {
    const branchData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const result = await db.collection('branches').insertOne(branchData);
    const newBranch = await db.collection('branches').findOne({ _id: result.insertedId });
    res.status(201).json(transformDocument(newBranch));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/branches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.createdAt;
    
    await db.collection('branches').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    const updatedBranch = await db.collection('branches').findOne({ _id: new ObjectId(id) });
    res.json(transformDocument(updatedBranch));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/branches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete related employees
    await db.collection('employees').deleteMany({ branchId: id });
    
    await db.collection('branches').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customers API Routes
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await db.collection('customers').find({}).toArray();
    res.json(customers.map(transformDocument));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const customerData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const result = await db.collection('customers').insertOne(customerData);
    const newCustomer = await db.collection('customers').findOne({ _id: result.insertedId });
    res.status(201).json(transformDocument(newCustomer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.createdAt;
    
    await db.collection('customers').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    const updatedCustomer = await db.collection('customers').findOne({ _id: new ObjectId(id) });
    res.json(transformDocument(updatedCustomer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete related KYC records
    await db.collection('kyc').deleteMany({ customerId: id });
    
    await db.collection('customers').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// KYC API Routes
app.get('/api/kyc', async (req, res) => {
  try {
    const kycRecords = await db.collection('kyc').find({}).toArray();
    res.json(kycRecords.map(transformDocument));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/kyc', async (req, res) => {
  try {
    const { customerId, panNumber, linkedBanks, documentType, documentNumber, verificationStatus, documentProof } = req.body;

    const kycData = {
      customerId,
      panNumber,
      linkedBanks,
      documentType,
      documentNumber,
      verificationStatus,
      documentProof,
      createdAt: new Date().toISOString()
    };

    const result = await db.collection('kyc').insertOne(kycData);
    const newKYC = await db.collection('kyc').findOne({ _id: result.insertedId });
    res.status(201).json(transformDocument(newKYC));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.put('/api/kyc/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.createdAt;

    await db.collection('kyc').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    const updatedKYC = await db.collection('kyc').findOne({ _id: new ObjectId(id) });
    res.json(transformDocument(updatedKYC));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.delete('/api/kyc/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('kyc').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'KYC record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Employees API Routes
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await db.collection('employees').find({}).toArray();
    res.json(employees.map(transformDocument));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const employeeData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const result = await db.collection('employees').insertOne(employeeData);
    const newEmployee = await db.collection('employees').findOne({ _id: result.insertedId });
    res.status(201).json(transformDocument(newEmployee));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.createdAt;
    
    await db.collection('employees').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    const updatedEmployee = await db.collection('employees').findOne({ _id: new ObjectId(id) });
    res.json(transformDocument(updatedEmployee));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('employees').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accounts API Routes
app.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await db.collection('accounts').find({}).toArray();
    res.json(accounts.map(transformDocument));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/accounts', async (req, res) => {
  try {
    const accountData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const result = await db.collection('accounts').insertOne(accountData);
    const newAccount = await db.collection('accounts').findOne({ _id: result.insertedId });
    res.status(201).json(transformDocument(newAccount));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.createdAt;
    
    await db.collection('accounts').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    const updatedAccount = await db.collection('accounts').findOne({ _id: new ObjectId(id) });
    res.json(transformDocument(updatedAccount));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete related transactions
    await db.collection('transactions').deleteMany({ accountId: id });
    
    await db.collection('accounts').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transactions API Routes
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await db.collection('transactions').find({}).toArray();
    res.json(transactions.map(transformDocument));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const result = await db.collection('transactions').insertOne(transactionData);
    const newTransaction = await db.collection('transactions').findOne({ _id: result.insertedId });
    res.status(201).json(transformDocument(newTransaction));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.createdAt;
    
    await db.collection('transactions').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    const updatedTransaction = await db.collection('transactions').findOne({ _id: new ObjectId(id) });
    res.json(transformDocument(updatedTransaction));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('transactions').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});