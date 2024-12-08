const { MongoClient } = require('mongodb');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'ecommerce';

function parseDate(dateStr) {
  try {
    const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
    const date = new Date(year, month - 1, day); 
    return date;
  } catch (error) {
    console.error('Error parsing date:', dateStr);
    return null;
  }
}

function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}

function parseNumber(value) {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

function cleanString(value) {
  return value && typeof value === 'string' ? value.trim() : 'Unknown';
}

async function loadData() {
  try {
    const productsPath = path.join(__dirname, '../../products.csv');
    const salesPath = path.join(__dirname, '../../sales.csv');

    console.log('Checking file paths:');
    console.log('Products file:', productsPath);
    console.log('Sales file:', salesPath);

    if (!fs.existsSync(productsPath)) {
      throw new Error('Products CSV file not found!');
    }
    if (!fs.existsSync(salesPath)) {
      throw new Error('Sales CSV file not found!');
    }

    const client = await MongoClient.connect(uri);
    console.log('\nConnected to MongoDB');

    const db = client.db(dbName);
    
    // Drop existing collections to start fresh
    try {
      await db.collection('products').drop();
      console.log('Products collection dropped');
    } catch (error) {
      console.log('Products collection does not exist');
    }

    try {
      await db.collection('sales').drop();
      console.log('Sales collection dropped');
    } catch (error) {
      console.log('Sales collection does not exist');
    }
    
    // Load products
    const products = [];
    let skippedProducts = 0;

    await new Promise((resolve, reject) => {
      fs.createReadStream(productsPath)
        .pipe(csv())
        .on('data', (data) => {
          const price = parseNumber(data.Price);
          if (price > 0 && data.ProductID && data.ProductName && data.Category) {
            products.push({
              _id: cleanString(data.ProductID),
              name: cleanString(data.ProductName),
              category: cleanString(data.Category),
              price: price
            });
          } else {
            skippedProducts++;
          }
        })
        .on('end', resolve)
        .on('error', (error) => {
          console.error('Error reading products CSV:', error);
          reject(error);
        });
    });

    if (products.length > 0) {
      await db.collection('products').insertMany(products);
      console.log(`Loaded ${products.length} valid products`);
      console.log(`Skipped ${skippedProducts} invalid products`);
    }

    // Load sales
    const sales = [];
    let skippedSales = 0;
    let minDate = new Date();
    let maxDate = new Date(0);

    await new Promise((resolve, reject) => {
      fs.createReadStream(salesPath)
        .pipe(csv())
        .on('data', (data) => {
          const saleDate = parseDate(data.Date);
          const quantity = parseNumber(data.Quantity);
          const totalAmount = parseNumber(data.TotalAmount);
          
          if (isValidDate(saleDate) && quantity > 0 && totalAmount > 0 && data.ProductID) {
           
            if (saleDate < minDate) minDate = saleDate;
            if (saleDate > maxDate) maxDate = saleDate;

            sales.push({
              productId: cleanString(data.ProductID),
              quantity: quantity,
              totalAmount: totalAmount,
              saleDate: saleDate
            });
          } else {
            skippedSales++;
            if (skippedSales <= 3) {
              console.log('Skipped invalid sale:', {
                date: saleDate,
                isValidDate: isValidDate(saleDate),
                quantity,
                totalAmount,
                productId: data.ProductID,
                originalData: data
              });
            }
          }
        })
        .on('end', resolve)
        .on('error', (error) => {
          console.error('Error reading sales CSV:', error);
          reject(error);
        });
    });

    if (sales.length > 0) {
      await db.collection('sales').insertMany(sales);
      console.log(`Loaded ${sales.length} valid sales`);
      console.log(`Skipped ${skippedSales} invalid sales`);
      console.log(`Date range in sales data: from ${minDate.toISOString()} to ${maxDate.toISOString()}`);

      
      console.log('\nSample sales:');
      sales.slice(0, 5).forEach((sale, index) => {
        console.log(`Sale ${index + 1}: ProductID=${sale.productId}, Quantity=${sale.quantity}, Date=${sale.saleDate.toISOString()}, Amount=${sale.totalAmount}`);
      });
    }

    // Create indexes
    await db.collection('sales').createIndex({ saleDate: 1 });
    await db.collection('sales').createIndex({ productId: 1 });
    await db.collection('products').createIndex({ category: 1 });

    console.log('Data loading completed successfully');
    await client.close();
  } catch (error) {
    console.error('Error loading data:', error);
    process.exit(1);
  }
}

loadData(); 