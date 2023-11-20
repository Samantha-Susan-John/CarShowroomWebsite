const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 3001;

mongoose.connect(`mongodb+srv://samanthasjohn22:Sam2002@cluster0.osd469u.mongodb.net/CarShowroom?retryWrites=true&w=majority`).then(() => {
  console.log('Database connected');
}, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const carSchema = new mongoose.Schema({
  brand: String,
  model: String,
  year: Number,
  image: String, // Add an image field to store the URL or path
});

// Pre-save hook to encode the image URL before saving it to the database
carSchema.pre('save', function (next) {
  this.image = encodeURIComponent(this.image);
  next();
});

const Car = mongoose.model('Car', carSchema, 'SearchResults');

const corsOptions = {
  origin: 'http://localhost:3002',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.get('/search', async (req, res) => {
  const searchTerm = req.query.q;

  if (!searchTerm || (isNaN(searchTerm) && typeof searchTerm !== 'string')) {
    return res.status(400).json({
      error: 'Invalid search term'
    });
  }

  try {
    const results = await Car.find({
      $or: [{
          brand: {
            $regex: searchTerm,
            $options: 'i'
          }
        },
        {
          model: {
            $regex: searchTerm,
            $options: 'i'
          }
        },
        {
          year: !isNaN(searchTerm) ? parseInt(searchTerm) : undefined
        }, // Parse the searchTerm as an integer
      ],
    });

    console.log('Results from SearchResults collection:', results);

    res.json(results);
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
});

app.get('/product/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Car.findById(productId);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
});

app.get('/api/check-availability', async (req, res) => {
  console.log('Received a request to check availability');
  const model = req.query.model;

  try {
    const car = await Car.findOne({ model: new RegExp(model, 'i') });

    if (!car) {
      return res.status(404).json({
        available: false,
        error: 'Car not found'
      });
    }

    res.json({ available: true });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      available: false,
      error: 'Internal Server Error'
    });
  }
});



app.post('/api/add-car', async (req, res) => {
  const { brand, model, year, image, availability } = req.body;

  try {
    const newCar = new Car({
      brand,
      model,
      year,
      image,
      availability: parseInt(availability, 10), // Convert to a number
    });

    await newCar.save();

    res.json({ message: 'Car added successfully' });
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
