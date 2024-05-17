import express from 'express';
import mongoose from 'mongoose';
import usersRoute from './routes/users'
import productsRote from './routes/product'
const app = express();

app.use(express.json());

app.use('/api/users', usersRoute);
app.use('/api/products', productsRote);

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/space-o")
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
