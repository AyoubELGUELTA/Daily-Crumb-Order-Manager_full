const prisma = require('../../prismaClient.js');
const { fileTypeFromFile } = require('file-type/node');
const fs = require('fs/promises');
const { relative } = require('path');

const admin = require('../services/firebase-admin-config.js');



exports.get_product = async (req, res, next) => {
    const { name, priceGte, priceLt } = req.query;

    let whereClause = {};

    if (name && name.trim() !== '') {
        whereClause.name = {
            contains: name,
            mode: 'insensitive' // This makes the search case-insensitive

        }
    }



    if (priceGte) {

        const parsedPriceGte = parseInt(priceGte);


        if ((!Number.isInteger(parsedPriceGte))) {
            return res.status(400).json({ message: "Your lowest price constraint is not a valid number." })
        }
        else {
            if (!whereClause.price) {
                whereClause.price = {};
            }

            whereClause.price.gte = parsedPriceGte;
        }

    }

    if (priceLt) {

        const parsedPriceLt = parseInt(priceLt);

        if (!Number.isInteger(parsedPriceLt)) {
            return res.status(400).json({ message: "Your highest price constraint is not a valid number." })
        }
        else {
            if (!whereClause.price) {
                whereClause.price = {};
            }

            whereClause.price.lte = parsedPriceLt;

        }
    }






    try {

        const products = await prisma.product.findMany({

            where:
                whereClause
            ,
            include: {
                images: {
                    select: {
                        id: true,
                        url: true,
                        isMain: true,
                        altText: true
                    }
                }
            }
        });

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found matching the criteria (or no products in the DB)." });
        }

        const response = {
            total: products.length,
            products:
                products.map(product => ({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    inStock: product.inStock,
                    images: product.images.map(image => ({
                        id: image.id,
                        url: image.url
                    })),
                    request: {
                        type: 'GET',
                        url: process.env.BASE_URL + '/products/' + product.id
                    }
                })
                )

        };

        res.status(200).json(response)
    }

    catch (error) {
        console.log(error);
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
                        isMain: true,
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
                    isMain: image.isMain,
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

exports.post_new_image_product = async (req, res, next) => {

    const productId = parseInt(req.params.productId);

    const uploadedFiles = req.files;

    if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(400).json({ message: "Image files were not given." });
    }

    try {
        // Récupérer le nom du produit une seule fois pour tous les fichiers
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        const productName = product.name.replace(/\s+/g, '_');

        const numberOfImages = await prisma.productImage.count({
            where: { productId: productId }
        })

        if ((numberOfImages + uploadedFiles.length) > 5) {
            return res.status(404).json({ message: "Products can only display 5 different images, please delete some current images to not exceed that number." })
        }

        // Créer un tableau de promesses pour chaque upload
        const uploadPromises = uploadedFiles.map(async (uploadedFile) => {
            // Validation du type de fichier
            if (uploadedFile.mimetype !== 'image/jpeg' && uploadedFile.mimetype !== 'image/png') {
                // Pour une seule image, on pourrait retourner une erreur ici.
                // Pour plusieurs, on peut choisir d'ignorer le fichier ou de retourner une erreur pour tous.
                // Ici, nous lançons une exception pour interrompre l'opération.
                throw new Error('Type de fichier non supporté. Seules les images JPEG et PNG sont autorisées.');
            }

            const fileExtension = uploadedFile.mimetype.split('/')[1];
            const fileName = `${productName}_${uuidv4()}.${fileExtension}`;
            const bucket = getStorage().bucket();
            const file = bucket.file(`products/${fileName}`);

            // Utiliser un "writable stream" pour uploader le fichier depuis le buffer
            const fileStream = file.createWriteStream({
                metadata: {
                    contentType: uploadedFile.mimetype,
                },
            });

            // On peut aussi utiliser la méthode plus simple `file.save` si on a le buffer en mémoire.
            // await file.save(uploadedFile.buffer, { contentType: uploadedFile.mimetype });

            // On attend la fin de l'upload
            await new Promise((resolve, reject) => {
                fileStream.on('finish', resolve);
                fileStream.on('error', reject);
                fileStream.end(uploadedFile.buffer);
            });

            // Générer l'URL une fois l'upload terminé
            const [url] = await file.getSignedUrl({
                action: 'read',
                expires: '03-09-2491',
            });

            // Gérer le texte alternatif
            let { altText } = req.body;
            if (!altText) {
                altText = `imageProduct-${productName}-${uuidv4().substring(0, 8)}`; // Ajout d'un identifiant unique
            }

            // Créer une nouvelle entrée dans la base de données
            const newProductImage = await prisma.productImage.create({
                data: {
                    url: url,
                    altText: altText,
                    productId: productId
                },
            });

            return newProductImage;
        });

        // Exécuter toutes les promesses d'upload en parallèle
        const newProductImages = await Promise.all(uploadPromises);

        res.status(201).json({
            message: `${newProductImages.length} new product image(s) added!`,
            images: newProductImages.map(img => ({ url: img.url, altText: img.altText }))
        });

    } catch (error) {
        console.error("Error during image upload:", error);
        // Si une erreur se produit, nous renvoyons une seule erreur pour toutes les images
        res.status(500).json({ error: error.message });
    }
};

exports.delete_image_product = async (req, res, next) => {
    try {
        const productId = parseInt(req.params.productId);
        const imageId = parseInt(req.params.imageId);

        if (isNaN(productId) || isNaN(imageId)) {
            return res.status(400).json({ message: 'Les IDs de produit et d\'image doivent être des nombres valides.' });

        }

        const imageProductToDelete = await prisma.productImage.findUnique({
            where: {
                id: imageId,
                productId: productId
            }
        });

        if (!imageProductToDelete) {
            return res.status(404).json({ error: "Image not found for this product." })
        }

        const imageUrl = imageProductToDelete.url;

        const relativePath = imageUrl.split('api/uploads/')[1];
        await prisma.productImage.delete({
            where: { id: imageId }
        });

        console.log(relativePath);

        try {
            await fs.unlink(`api/uploads/${relativePath}`);
            res.status(204).send()
        } catch (fileError) {
            if (fileError.code !== 'ENOENT') {// si le code == ENOENT ça veut dire que le fichier/ la requête de l'objet n'a pas été trouvé
                throw fileError;
            }
            console.warn(`Could not delete file: ${relativePath}. It may not exist.`);
        }


    }

    catch (error) {
        res.status(500).json({ error: error.message })
    }

};

exports.delete_product = async (req, res, next) => {

    try {

        const productId = parseInt(req.params.productId)

        if (isNaN(productId)) {
            return res.status(400).json({
                message: 'Invalid product ID. Please provide a valid number.'
            });
        }

        const productToDelete = await prisma.product.findUnique({
            where: { id: productId }
        })

        if (!productToDelete) {
            return res.status(404).json({ error: `Product with ID ${productId} not found.` })
        };

        const imagesToDelete = await prisma.productImage.findMany({
            where: { productId: productId }
        });


        let imageUrl = null;

        let relativePath = null;

        for (image of imagesToDelete) {
            imageUrl = image.url;

            relativePath = imageUrl.split('api/uploads/')[1]

            await fs.unlink(`api/uploads/${relativePath}`)
        }

        await prisma.product.delete({
            where: {
                id: productId,
            },
        });



        res.status(204).send();

    }

    catch (error) {
        res.status(500).json({ error: error.message })
    };

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
