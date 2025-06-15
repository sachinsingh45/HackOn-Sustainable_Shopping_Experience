const Product = require('./models/Product');
const productsData = require('./constant/productsData');

const defaultData = async () => {
    try {
        // First, clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert new products
        const result = await Product.insertMany(productsData);
        console.log('Products saved successfully:', result.length);
        
        process.exit(0);
    } catch (error) {
        console.log('Error saving products:', error);
        process.exit(1);
    }
};

module.exports = defaultData; 