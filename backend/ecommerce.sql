CREATE DATABASE ecommerce;


\c ecommerce;

-- Crear tabla para los usuarios
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    second_name VARCHAR(255),
    lastname VARCHAR(255),
    second_lastname VARCHAR(255),
    phone VARCHAR(255)
);

-- Crear tabla para los artículos
CREATE TABLE Category(
    catID SERIAL PRIMARY KEY,
    catName VARCHAR(255) NOT NULL
);

-- Tabla principal de productos
CREATE TABLE Products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    cost DECIMAL(10, 2),
    currency CHAR(3),
    soldCount INT,
    image VARCHAR(255),
    catID INT,
    FOREIGN KEY (catID) REFERENCES Category(catID)
);

-- Tabla para los productos relacionados
CREATE TABLE Related_products (
    productId INT,
    relatedProductId INT,
    PRIMARY KEY (productId, relatedProductId),
    FOREIGN KEY (productId) REFERENCES Products(id),
    FOREIGN KEY (relatedProductId) REFERENCES Products(id)
);

-- Crear tabla intermedia para la relación carrito-artículos
CREATE TABLE Cart_items (
    email VARCHAR(255) NOT NULL REFERENCES Users(email),
    product_id INT NOT NULL REFERENCES Products(id),
    CONSTRAINT "PK_Cart_Item" PRIMARY KEY  (email, product_id),
    count INT NOT NULL
);

CREATE TABLE Products_comments (
    id SERIAL PRIMARY KEY,
    product INT NOT NULL REFERENCES Products(id),
    score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
    description TEXT,
    user VARCHAR(255) NOT NULL REFERENCES Users(email),
    dateTime TIMESTAMP NOT NULL
);
