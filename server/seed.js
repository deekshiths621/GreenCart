import mongoose from 'mongoose';
import 'dotenv/config';
import Product from './models/Product.js';
import Category from './models/Category.js';
import connectDB from './configs/db.js';

// Categories data
const categories = [
  {
    name: "Vegetables",
    description: "Fresh and organic vegetables for daily cooking",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
    isActive: true
  },
  {
    name: "Fruits",
    description: "Fresh seasonal fruits rich in vitamins",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400",
    isActive: true
  },
  {
    name: "Dairy",
    description: "Fresh dairy products and milk items",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400",
    isActive: true
  },
  {
    name: "Drinks",
    description: "Refreshing beverages and drinks",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
    isActive: true
  },
  {
    name: "Grains",
    description: "Quality grains and cereals",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    isActive: true
  },
  {
    name: "Spices",
    description: "Aromatic spices for flavoring",
    image: "https://images.unsplash.com/photo-1596040033229-a0b8d1f6a8f2?w=400",
    isActive: true
  },
  {
    name: "Meat",
    description: "Fresh meat and poultry products",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400",
    isActive: true
  },
  {
    name: "Bakery",
    description: "Fresh baked goods and bread",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    isActive: true
  },
  {
    name: "Snacks",
    description: "Tasty snacks and munchies",
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400",
    isActive: true
  }
];

// Dummy products data from assets.js - using reliable placeholder images
const dummyProducts = [
  // Vegetables
  {
    name: "Potato 500g",
    category: "Vegetables",
    price: 25,
    offerPrice: 20,
    image: ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400"],
    description: [
      "Fresh and organic",
      "Rich in carbohydrates",
      "Ideal for curries and fries",
    ],
    inStock: true,
  },

  {
    name: "Potato2 500g",
    category: "Vegetables",
    price: 30,
    offerPrice: 25,
    image: ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400"],
    description: [
      "Fresh and organic",
      "Rich in carbohydrates",
      "Ideal for curries and fries",
    ],
    inStock: true,
  },
  {
    name: "Tomato 1 kg",
    category: "Vegetables",
    price: 40,
    offerPrice: 35,
    image: ["https://images.unsplash.com/photo-1546470427-227a1e226c9f?w=400"],
    description: [
      "Juicy and ripe",
      "Rich in Vitamin C",
      "Perfect for salads and sauces",
      "Farm fresh quality",
    ],
    inStock: true,
  },
  {
    name: "Carrot 500g",
    category: "Vegetables",
    price: 30,
    offerPrice: 28,
    image: ["https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400"],
    description: [
      "Sweet and crunchy",
      "Good for eyesight",
      "Ideal for juices and salads",
    ],
    inStock: true,
  },
  {
    name: "Spinach 500g",
    category: "Vegetables",
    price: 18,
    offerPrice: 15,
    image: ["https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400"],
    description: [
      "Rich in iron",
      "High in vitamins",
      "Perfect for soups and salads",
    ],
    inStock: true,
  },
  {
    name: "Onion 500g",
    category: "Vegetables",
    price: 22,
    offerPrice: 19,
    image: ["https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400"],
    description: [
      "Fresh and pungent",
      "Perfect for cooking",
      "A kitchen staple",
    ],
    inStock: true,
  },

  // Fruits
  {
    name: "Apple 1 kg",
    category: "Fruits",
    price: 120,
    offerPrice: 110,
    image: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400"],
    description: [
      "Crisp and juicy",
      "Rich in fiber",
      "Boosts immunity",
      "Perfect for snacking and desserts",
      "Organic and farm fresh",
    ],
    inStock: true,
  },
  {
    name: "Orange 1 kg",
    category: "Fruits",
    price: 80,
    offerPrice: 75,
    image: ["https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400"],
    description: [
      "Juicy and sweet",
      "Rich in Vitamin C",
      "Perfect for juices and salads",
    ],
    inStock: true,
  },
  {
    name: "Banana 1 kg",
    category: "Fruits",
    price: 50,
    offerPrice: 45,
    image: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400"],
    description: [
      "Sweet and ripe",
      "High in potassium",
      "Great for smoothies and snacking",
    ],
    inStock: true,
  },
  {
    name: "Mango 1 kg",
    category: "Fruits",
    price: 150,
    offerPrice: 140,
    image: ["https://images.unsplash.com/photo-1553279768-865429fa0078?w=400"],
    description: [
      "Sweet and flavorful",
      "Perfect for smoothies and desserts",
      "Rich in Vitamin A",
    ],
    inStock: true,
  },
  {
    name: "Grapes 500g",
    category: "Fruits",
    price: 70,
    offerPrice: 65,
    image: ["https://images.unsplash.com/photo-1599819177333-9162e1d0f4d4?w=400"],
    description: [
      "Fresh and juicy",
      "Rich in antioxidants",
      "Perfect for snacking and fruit salads",
    ],
    inStock: true,
  },

  // Dairy
  {
    name: "Amul Milk 1L",
    category: "Dairy",
    price: 60,
    offerPrice: 55,
    image: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400"],
    description: [
      "Pure and fresh",
      "Rich in calcium",
      "Ideal for tea, coffee, and desserts",
      "Trusted brand quality",
    ],
    inStock: true,
  },
  {
    name: "Paneer 200g",
    category: "Dairy",
    price: 90,
    offerPrice: 85,
    image: ["https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400"],
    description: [
      "Soft and fresh",
      "Rich in protein",
      "Ideal for curries and snacks",
    ],
    inStock: true,
  },
  {
    name: "Eggs 12 pcs",
    category: "Dairy",
    price: 90,
    offerPrice: 85,
    image: ["https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400"],
    description: [
      "Farm fresh",
      "Rich in protein",
      "Ideal for breakfast and baking",
    ],
    inStock: true,
  },
  {
    name: "Cheese 200g",
    category: "Dairy",
    price: 140,
    offerPrice: 130,
    image: ["https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400"],
    description: [
      "Creamy and delicious",
      "Perfect for pizzas and sandwiches",
      "Rich in calcium",
    ],
    inStock: true,
  },

  // Drinks
  {
    name: "Coca-Cola 1.5L",
    category: "Drinks",
    price: 80,
    offerPrice: 75,
    image: ["https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400"],
    description: [
      "Refreshing and fizzy",
      "Perfect for parties and gatherings",
      "Best served chilled",
    ],
    inStock: true,
  },
  {
    name: "Pepsi 1.5L",
    category: "Drinks",
    price: 78,
    offerPrice: 73,
    image: ["https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400"],
    description: [
      "Chilled and refreshing",
      "Perfect for celebrations",
      "Best served cold",
    ],
    inStock: true,
  },
  {
    name: "Sprite 1.5L",
    category: "Drinks",
    price: 79,
    offerPrice: 74,
    image: ["https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400"],
    description: [
      "Refreshing citrus taste",
      "Perfect for hot days",
      "Best served chilled",
    ],
    inStock: true,
  },
  {
    name: "Fanta 1.5L",
    category: "Drinks",
    price: 77,
    offerPrice: 72,
    image: ["https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400"],
    description: [
      "Sweet and fizzy",
      "Great for parties and gatherings",
      "Best served cold",
    ],
    inStock: true,
  },
  {
    name: "7 Up 1.5L",
    category: "Drinks",
    price: 76,
    offerPrice: 71,
    image: ["https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400"],
    description: [
      "Refreshing lemon-lime flavor",
      "Perfect for refreshing",
      "Best served chilled",
    ],
    inStock: true,
  },

  // Grains
  {
    name: "Basmati Rice 5kg",
    category: "Grains",
    price: 550,
    offerPrice: 520,
    image: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"],
    description: [
      "Long grain and aromatic",
      "Perfect for biryani and pulao",
      "Premium quality",
    ],
    inStock: true,
  },
  {
    name: "Wheat Flour 5kg",
    category: "Grains",
    price: 250,
    offerPrice: 230,
    image: ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"],
    description: [
      "High-quality whole wheat",
      "Soft and fluffy rotis",
      "Rich in nutrients",
    ],
    inStock: true,
  },
  {
    name: "Organic Quinoa 500g",
    category: "Grains",
    price: 450,
    offerPrice: 420,
    image: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"],
    description: [
      "High in protein and fiber",
      "Gluten-free",
      "Rich in vitamins and minerals",
    ],
    inStock: true,
  },
  {
    name: "Brown Rice 1kg",
    category: "Grains",
    price: 120,
    offerPrice: 110,
    image: ["https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400"],
    description: [
      "Whole grain and nutritious",
      "Helps in weight management",
      "Good source of magnesium",
    ],
    inStock: true,
  },
  {
    name: "Barley 1kg",
    category: "Grains",
    price: 150,
    offerPrice: 140,
    image: ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"],
    description: [
      "Rich in fiber",
      "Helps improve digestion",
      "Low in fat and cholesterol",
    ],
    inStock: true,
  },

  // Bakery
  {
    name: "Brown Bread 400g",
    category: "Bakery",
    price: 40,
    offerPrice: 35,
    image: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400"],
    description: [
      "Soft and healthy",
      "Made from whole wheat",
      "Ideal for breakfast and sandwiches",
    ],
    inStock: true,
  },
  {
    name: "Butter Croissant 100g",
    category: "Bakery",
    price: 50,
    offerPrice: 45,
    image: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400"],
    description: [
      "Flaky and buttery",
      "Freshly baked",
      "Perfect for breakfast or snacks",
    ],
    inStock: true,
  },
  {
    name: "Chocolate Cake 500g",
    category: "Bakery",
    price: 350,
    offerPrice: 325,
    image: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400"],
    description: [
      "Rich and moist",
      "Made with premium cocoa",
      "Ideal for celebrations and parties",
    ],
    inStock: true,
  },
  {
    name: "Whole Wheat Bread 400g",
    category: "Bakery",
    price: 45,
    offerPrice: 40,
    image: ["https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400"],
    description: [
      "Healthy and nutritious",
      "Made with whole wheat flour",
      "Ideal for sandwiches and toast",
    ],
    inStock: true,
  },
  {
    name: "Vanilla Muffins 6 pcs",
    category: "Bakery",
    price: 100,
    offerPrice: 90,
    image: ["https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400"],
    description: [
      "Soft and fluffy",
      "Perfect for a quick snack",
      "Made with real vanilla",
    ],
    inStock: true,
  },

  // Instant
  {
    name: "Maggi Noodles 280g",
    category: "Instant",
    price: 55,
    offerPrice: 50,
    image: ["https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400"],
    description: [
      "Instant and easy to cook",
      "Delicious taste",
      "Popular among kids and adults",
    ],
    inStock: true,
  },
  {
    name: "Top Ramen 270g",
    category: "Instant",
    price: 45,
    offerPrice: 40,
    image: ["https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400"],
    description: [
      "Quick and easy to prepare",
      "Spicy and flavorful",
      "Loved by college students and families",
    ],
    inStock: true,
  },
  {
    name: "Knorr Cup Soup 70g",
    category: "Instant",
    price: 35,
    offerPrice: 30,
    image: ["https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400"],
    description: [
      "Convenient for on-the-go",
      "Healthy and nutritious",
      "Variety of flavors",
    ],
    inStock: true,
  },
  {
    name: "Yippee Noodles 260g",
    category: "Instant",
    price: 50,
    offerPrice: 45,
    image: ["https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400"],
    description: [
      "Non-fried noodles for healthier choice",
      "Tasty and filling",
      "Convenient for busy schedules",
    ],
    inStock: true,
  },
  {
    name: "Maggi Oats Noodles 72g",
    category: "Instant",
    price: 40,
    offerPrice: 35,
    image: ["https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400"],
    description: [
      "Healthy alternative with oats",
      "Good for digestion",
      "Perfect for breakfast or snacks",
    ],
    inStock: true,
  },
];

// Seed the database
const seedDatabase = async () => {
    try {
        // Connect with proper options for replica sets
        const options = {
            retryWrites: true,
            w: 'majority',
            readPreference: 'primary'
        };
        
        mongoose.connection.on("connected", () => console.log("Database Connected"));
        
        // Remove directConnection parameter and add proper options
        const uri = process.env.MONGODB_URI.replace('directConnection=true', 'retryWrites=true&w=majority');
        await mongoose.connect(uri, options);
        
        // Clear existing categories
        console.log('Clearing existing categories...');
        const deleteCategoriesResult = await Category.deleteMany({});
        console.log(`Deleted ${deleteCategoriesResult.deletedCount} existing categories`);
        
        // Clear existing products
        console.log('Clearing existing products...');
        const deleteResult = await Product.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} existing products`);
        
        // Insert categories first
        console.log('Inserting categories...');
        const insertCategoriesResult = await Category.insertMany(categories);
        console.log(`Successfully seeded ${insertCategoriesResult.length} categories!`);
        
        // Insert dummy products
        console.log('Inserting dummy products...');
        const insertResult = await Product.insertMany(dummyProducts);
        
        console.log(`Successfully seeded ${insertResult.length} products!`);
        console.log('Database seeding completed!');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error.message);
        console.error(error);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
};

// Run the seed function
seedDatabase();
