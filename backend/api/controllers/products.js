const prisma = require('../../prismaClient.js');
const { fileTypeFromFile } = require('file-type/node');
const fs = require('fs/promises');
const { relative } = require('path');
const { v2: cloudinary } = require('cloudinary');
const { v4: uuidv4 } = require('uuid');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});





exports.get_product = async (req, res, next) => {
    const { name, priceGte, priceLt } = req.query;

    let whereClause = {};

    // --- Gestion prix min ---
    if (priceGte) {
        const parsedPriceGte = parseInt(priceGte);

        if (!Number.isInteger(parsedPriceGte)) {
            return res.status(400).json({ message: "Your lowest price constraint is not a valid number." });
        } else {
            if (!whereClause.price) whereClause.price = {};
            whereClause.price.gte = parsedPriceGte;
        }
    }

    // --- Gestion prix max ---
    if (priceLt) {
        const parsedPriceLt = parseInt(priceLt);

        if (!Number.isInteger(parsedPriceLt)) {
            return res.status(400).json({ message: "Your highest price constraint is not a valid number." });
        } else {
            if (!whereClause.price) whereClause.price = {};
            whereClause.price.lte = parsedPriceLt;
        }
    }

    try {
        let products;

        if (name && name.trim() !== '') {
            // --- Recherche souple (ignore casse et espaces) ---
            const normalizedSearch = name.replace(/\s+/g, '').toLowerCase();

            products = await prisma.$queryRaw`
                SELECT p.id, p.name, p.price, p.inStock,
                       JSON_ARRAYAGG(JSON_OBJECT('id', i.id, 'url', i.url, 'altText', i.altText)) as images
                FROM Product p
                LEFT JOIN ProductImage i ON i.productId = p.id
                WHERE REPLACE(LOWER(p.name), ' ', '') LIKE ${'%' + normalizedSearch + '%'}
                GROUP BY p.id, p.name, p.price, p.inStock
            `;
        } else {
            // --- Cas sans filtre name : on utilise Prisma ---
            products = await prisma.product.findMany({
                where: whereClause,
                include: {
                    images: {
                        select: {
                            id: true,
                            url: true,
                            altText: true
                        }
                    }
                }
            });
        }

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found matching the criteria (or no products in the DB)." });
        }

        // --- Mise en forme uniforme ---
        const response = {
            total: products.length,
            products: products.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                inStock: product.inStock,
                images: product.images
                    ? (Array.isArray(product.images)
                        ? product.images
                        : JSON.parse(product.images)) // si ça vient du raw SQL
                    : [],
                request: {
                    type: 'GET',
                    url: process.env.BASE_URL + '/products/' + product.id
                }
            }))
        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};




exports.get_single_product = async (req, res, next) => {


    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(req.params.productId) },
            include: {
                images: {
                    select: {
                        id: true,
                        altText: true,
                        url: true
                    }
                }
            }
        });

        if (!product) {
            return res.status(404).json({ error: "Product not found, try another id." })
        };

        const response = {
            product: {
                id: product.id,
                name: product.name,
                price: product.price,
                inStock: product.inStock,
                images: product.images.map(image => ({
                    id: image.id,
                    altText: image.altText,
                    url: image.url
                })),
            },
            request: {
                type: 'GET',
                url: process.env.BASE_URL + '/products',
                comment: 'look at all products'
            }
        }
        // res.status(200).json({ message: 'Handling Get a specific product successfully' });

        res.status(200).json(response);

    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.post_new_product = async (req, res, next) => {

    try {
        const inStock = ["true", "True", "TRUE"].includes(req.body.inStock.toString());

        const price = parseFloat(req.body.price);

        if (isNaN(price)) {
            throw new Error('Invalid price');
        }
        const product = await prisma.product.create({
            data: {
                name: req.body.name,
                price: price,
                inStock: inStock || false
            }
        });

        res.status(201).json({
            message: "Product created!",
            product: product,
            request: {
                type: 'GET',
                url: process.env.BASE_URL + '/products/' + product.id,
                comment: 'Get all info of this product!'
            }
        })
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }


}

exports.post_new_image_product = async (req, res) => {
    const productId = parseInt(req.params.productId);
    const uploadedFiles = req.files;

    if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(400).json({ message: "No image files were uploaded." });
    }

    try {
        // Vérifier que le produit existe
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Vérifier la limite de 5 images
        const numberOfImages = await prisma.productImage.count({
            where: { productId }
        });
        if (numberOfImages + uploadedFiles.length > 5) {
            return res.status(400).json({ message: "Max 5 images per product." });
        }

        const productName = product.name.replace(/\s+/g, "_");

        const newProductImages = await Promise.all(
            uploadedFiles.map(async (file) => {
                if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
                    throw new Error("Only JPG/JPEG or PNG image files are allowed.");
                }

                // Upload Cloudinary avec une vraie Promise
                const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "products",
                            public_id: `${productName}_${uuidv4()}`,
                            resource_type: "image",
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(file.buffer); // envoie le buffer à Cloudinary
                });

                // altText généré si pas fourni
                let { altText } = req.body;
                if (!altText) {
                    altText = `imageProduct-${productName}-${uuidv4().substring(0, 8)}`;
                }

                // Sauvegarde en DB
                return prisma.productImage.create({
                    data: {
                        url: uploadResult.secure_url,
                        altText: altText,
                        productId: productId,
                    },
                });
            })
        );

        res.status(201).json({
            message: `${newProductImages.length} new product image(s) added!`,
            images: newProductImages.map((img) => ({
                url: img.url,
                altText: img.altText,
            })),
        });
    } catch (error) {
        console.error("Error during Cloudinary upload:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.delete_image_product = async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        const imageId = parseInt(req.params.imageId);

        if (isNaN(productId) || isNaN(imageId)) {
            return res.status(400).json({ message: 'Invalid product or image ID.' });
        }

        const imageProductToDelete = await prisma.productImage.findUnique({
            where: { id: imageId }
        });

        if (!imageProductToDelete || imageProductToDelete.productId !== productId) {
            return res.status(404).json({ error: "Image not found for this product." });
        }

        const imageUrl = imageProductToDelete.url;

        // Extraire le public_id depuis l'URL Cloudinary
        const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
        // ex: https://res.cloudinary.com/demo/image/upload/v1234567890/products/myfile_xxxx.png
        // publicId = "products/myfile_xxxx"

        // on supprime l'image sur Cloudinary dabord
        await cloudinary.uploader.destroy(publicId);

        // Supprime en db apres
        await prisma.productImage.delete({
            where: { id: imageId }
        });

        res.status(204).send();

    } catch (error) {
        console.error("Error deleting Cloudinary image:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.delete_product = async (req, res, next) => {
    try {
        const productId = parseInt(req.params.productId);

        if (isNaN(productId)) {
            return res.status(400).json({
                message: 'Invalid product ID. Please provide a valid number.'
            });
        }

        // Vérifier si le produit existe
        const productToDelete = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!productToDelete) {
            return res.status(404).json({ error: `Product with ID ${productId} not found.` });
        }

        // Récupérer toutes les images liées
        const imagesToDelete = await prisma.productImage.findMany({
            where: { productId }
        });

        // Supprimer les images de Cloudinary
        for (const image of imagesToDelete) {
            const imageUrl = image.url;
            // Extraire le public_id Cloudinary (ex: "products/myfile_xxxx")
            const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];

            try {
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error(`Erreur suppression Cloudinary image ${publicId}:`, err);
            }
        }

        await prisma.productImage.deleteMany({
            where: { productId }
        });

        await prisma.product.delete({
            where: { id: productId }
        });

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: error.message });
    }
};



exports.update_product = async (req, res, next) => {
    try {

        const productId = parseInt(req.params.productId)

        if (isNaN(productId)) {
            return res.status(400).json({
                message: 'Invalid product ID. Please provide a valid number.'
            });
        };

        const updateData = {};
        const allowFields = ['name', 'price', 'inStock'];
        for (const field of allowFields) {
            if (req.body[field] !== undefined) {
                if (field === 'price') {
                    const parsedPrice = parseFloat(req.body[field]);
                    if (isNaN(parsedPrice)) {
                        return res.status(400).json({ message: 'Price must be a valid number.' });
                    }
                    updateData[field] = parsedPrice;
                }
                else if (field === 'inStock') {
                    if (req.body[field] !== undefined && !['true', 'True', 'false', 'False'].includes(req.body[field].toString())) {
                        return res.status(400).json({ message: 'inStocke must be a boolean (true/false)' })
                    }
                    updateData[field] = req.body[field] || false
                }
                else {
                    updateData[field] = req.body[field];
                }

            };
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No field(s) or no valid field(s) provided for update." })
        }


        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: updateData
        })

        res.status(200).json({
            message: 'Product updated successfully.',
            product: updatedProduct,
            request: {
                type: 'GET',
                url: process.env.BASE_URL + `/products/${updatedProduct.id}`,
                comment: 'Get all info of this product!'
            }
        });


    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
};
