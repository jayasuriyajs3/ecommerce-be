const express= require('express');
const Product = require('../models/product');
const router=express.Router();

router.get('/',async(req,res)=>{
    try{
        // Query directly from MongoDB native collection to bypass schema validation
        const mongoose = require('mongoose');
        const db = mongoose.connection.db;
        const productsCollection = db.collection('productste');
        
        const products = await productsCollection.find({}).toArray();
        console.log(`Found ${products.length} products from productste collection`);
        
        // Ensure all products have required fields
        const validatedProducts = products.map(p => ({
            id: p.id || p._id.toString(),
            name: p.name || 'Unknown',
            price: p.price || '0',
            description: p.description || '',
            image: p.image || '',
            _id: p._id
        }));
        
        // Always return 200 with array (empty or populated)
        res.status(200).json(validatedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
});

router.post('/',async(req,res)=>{
    try{
        const {name,price,description,image} = req.body;
        const product=await Product.create({name,price,description,image});
        res.status(201).json({ message: "Product created successfully", product: product });
    } catch (error) {
        res.status(500).json({ message: "Failed to create product", error: error.message });
    }
});

// Get product by ID
router.get('/:id', async(req,res)=>{
    try{
        const mongoose = require('mongoose');
        const db = mongoose.connection.db;
        const productsCollection = db.collection('productste');
        
        const numericId = parseInt(req.params.id);
        console.log('Searching for product with id:', numericId, 'type:', typeof numericId);
        
        // Try to find by id field first (numeric)
        let product = await productsCollection.findOne({ id: numericId });
        console.log('Found by numeric id:', product ? 'Yes' : 'No');
        
        // If not found, try with string id
        if (!product) {
            product = await productsCollection.findOne({ id: req.params.id });
            console.log('Found by string id:', product ? 'Yes' : 'No');
        }
        
        // If still not found, log all products to debug
        if (!product) {
            const allProducts = await productsCollection.find({}).toArray();
            console.log('All products in collection:', allProducts.map(p => ({ id: p.id, name: p.name, _id: p._id })));
        }
        
        if(product){
            // Format response
            const formattedProduct = {
                id: product.id || product._id.toString(),
                name: product.name || 'Unknown',
                price: product.price || '0',
                description: product.description || '',
                image: product.image || '',
                _id: product._id
            };
            res.status(200).json({ product: formattedProduct });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch(error){
        console.error('Error in GET /:id:', error);
        res.status(500).json({ message: "Failed to fetch product", error: error.message });
    }
});

// Update product by ID (Admin only)
router.put('/:id', async(req,res)=>{
    try{
        const mongoose = require('mongoose');
        const db = mongoose.connection.db;
        const productsCollection = db.collection('productste');
        
        const numericId = parseInt(req.params.id);
        const { name, price, description, image } = req.body;
        
        // Build update object (only include provided fields)
        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (price !== undefined) updateFields.price = price;
        if (description !== undefined) updateFields.description = description;
        if (image !== undefined) updateFields.image = image;
        
        // Try to update by id field first
        let result = await productsCollection.findOneAndUpdate(
            { id: numericId },
            { $set: updateFields },
            { returnDocument: 'after' }
        );
        
        // If not found, try with string id
        if (!result) {
            result = await productsCollection.findOneAndUpdate(
                { id: req.params.id },
                { $set: updateFields },
                { returnDocument: 'after' }
            );
        }
        
        if(result){
            res.status(200).json({ message: "Product updated successfully", product: result });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch(error){
        console.error('Error updating product:', error);
        res.status(500).json({ message: "Failed to update product", error: error.message });
    }
});

// Delete product by ID
router.delete('/:id', async(req,res)=>{
    try{
        const mongoose = require('mongoose');
        const db = mongoose.connection.db;
        const productsCollection = db.collection('productste');
        
        const numericId = parseInt(req.params.id);
        
        // Try to delete by id field first
        let result = await productsCollection.findOneAndDelete({ id: numericId });
        
        // If not found, try with string id
        if (!result) {
            result = await productsCollection.findOneAndDelete({ id: req.params.id });
        }
        
        if(result.value){
            res.status(200).json({ message: "Product deleted successfully", product: result.value });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch(error){
        res.status(500).json({ message: "Failed to delete product", error: error.message });
    }
});

module.exports=router;