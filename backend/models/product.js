const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    default: null,
    min: [0, 'Discount price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please provide a product category'],
    enum: {
      values: [
        'Electronics',
        'Clothing',
        'Home',
        'Books',
        'Beauty',
        'Sports',
        'Toys',
        'Other'
      ],
      message: 'Please select a valid category'
    }
  },
  brand: {
    type: String,
    required: [true, 'Please provide a product brand'],
    trim: true
  },
  stock: {
    type: Number,
    required: [true, 'Please provide product stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  image: {
    type: String,
    required: [true, 'Please provide a product image URL']
  },
  images: {
    type: [String],
    required: [true, 'Please provide at least one product image'],
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'At least one image is required'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5'],
    set: val => Math.round(val * 10) / 10 // Round to 1 decimal place
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  numReviews: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ category: 1 });
productSchema.index({ ratingsAverage: -1 });

// Virtual property for discounted percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.discountPrice && this.price) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Updated pre-save middleware for Mongoose 9
productSchema.pre('save', async function () {
  // Update the updatedAt field
  this.updatedAt = Date.now();

  // Any other existing logic should go here
  // For example, if you have discount validation:
  if (this.discountPrice && this.discountPrice >= this.price) {
    throw new Error('Discount price must be less than the regular price');
  }
});

// Static method to get top-rated products
productSchema.statics.getTopRated = function() {
  return this.find({ ratingsAverage: { $gte: 4.5 } }).sort({ ratingsAverage: -1 });
};

// Method to calculate average rating
productSchema.methods.calculateAverageRating = async function() {
  const stats = await this.model('Product').aggregate([
    { $match: { _id: this._id } },
    { $unwind: '$reviews' },
    {
      $group: {
        _id: '$_id',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$reviews.rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    this.ratingsQuantity = stats[0].nRating;
    this.ratingsAverage = stats[0].avgRating;
    await this.save();
  } else {
    this.ratingsQuantity = 0;
    this.ratingsAverage = 0;
    await this.save();
  }
};

// Export the model safely
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);