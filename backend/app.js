const express=require('express');
const cors=require('cors');

const paymentRoutes=require('./src/routes/routes');

const app = express();
app.use(cors());
app.use(express.json())

app.use('/api',paymentRoutes);

const PORT=process.env.PORT || 3000;

app.listen(PORT, () => {
    // Log the server URL only in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Server is running at http://localhost:${PORT}`);
    }
  });