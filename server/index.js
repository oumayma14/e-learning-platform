const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('uploads'));


app.use('/', authRoutes);
app.use('/api', userRoutes);

app.listen(3002, () => {
    console.log('Server is running on port 3002');
});