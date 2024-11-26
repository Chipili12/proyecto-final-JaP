const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ecommerce',
    password: 'postgres',
    port: 5432
});

// Leer archivos
async function populateTableFromJSON(folderPath, processFn) {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        if (path.extname(filePath) === '.json') {
            const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            await processFn(jsonData);
        }
    }
}

async function populateCategories() {
    console.log('Poblando tabla Category...');
    await populateTableFromJSON(
        path.join(__dirname, 'cats'),
        async (json) => {
            for (const category of json) {
                const query = `
                    INSERT INTO Category (catID, catName)
                    VALUES ($1, $2)
                    ON CONFLICT DO NOTHING
                `;
                await pool.query(query, [category.id, category.name]);
            }
        }
    );
}

async function populateProducts() {
    console.log('Poblando tabla Products...');
    await populateTableFromJSON(
        path.join(__dirname, 'cats_products'),
        async (json) => {
            const { catID, products } = json;
            for (const product of products) {
                const query = `
                    INSERT INTO Products (id, name, description, cost, currency, soldCount, image, catID)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT DO NOTHING
                `;
                await pool.query(query, [
                    product.id,
                    product.name,
                    product.description,
                    product.cost,
                    product.currency,
                    product.soldCount,
                    product.image,
                    catID,
                ]);
            }
        }
    );
}

async function populateRelatedProducts() {
    console.log('Poblando tabla Related_products...');
    await populateTableFromJSON(
        path.join(__dirname, 'products'),
        async (json) => {
            const { id, relatedProducts } = json;
            for (const related of relatedProducts) {
                const query = `
                    INSERT INTO Related_products (productId, relatedProductId)
                    VALUES ($1, $2)
                    ON CONFLICT DO NOTHING
                `;
                await pool.query(query, [id, related.id]);
            }
        }
    );
}

async function populateCartItems() {
    console.log('Poblando tabla Cart_items...');
    await populateTableFromJSON(
        path.join(__dirname, 'user_cart'),
        async (json) => {
            const { user, articles } = json;
            for (const article of articles) {
                const query = `
                    INSERT INTO Cart_items (email, product_id, count)
                    VALUES ($1, $2, $3)
                    ON CONFLICT DO NOTHING
                `;
                // Supongo que user es email en la tabla
                await pool.query(query, [user, article.id, article.count]);
            }
        }
    );
}

async function populateProductComments() {
    console.log('Poblando tabla Products_comments...');
    await populateTableFromJSON(
        path.join(__dirname, 'products_comments'),
        async (json) => {
            for (const comment of json) {
                const query = `
                    INSERT INTO Products_comments (product, score, description, user, dateTime)
                    VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT DO NOTHING
                `;
                await pool.query(query, [
                    comment.product,
                    comment.score,
                    comment.description,
                    comment.user,
                    comment.dateTime,
                ]);
            }
        }
    );
}

(async () => {
    try {
        await populateCategories();
        await populateProducts();
        await populateRelatedProducts();
        await populateCartItems();
        await populateProductComments();
        console.log('Población completada exitosamente.');
    } catch (err) {
        console.error('Error durante la población:', err);
    } finally {
        await pool.end();
    }
})();
