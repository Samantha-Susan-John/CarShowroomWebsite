const express = require('express');
const slugify = require('slugify');
const Category = require('../models/category');



exports.addCategory = async (req, res) => {
    const { name, parentId } = req.body;
    const categoryObject = {
        name: name,
        slug: slugify(name)
    };

    if (parentId) {
        categoryObject.parentId = parentId;
    }

    try {
        const category = new Category(categoryObject);
        const savedCategory = await category.save();
        res.status(201).json({ category: savedCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getCategories = (req, res) => {
    Category.find({})
        .then(categories => {
            res.status(200).json({ categories });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        });
}

