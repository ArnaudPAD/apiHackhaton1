// index.js
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Exemple de base de données temporaire
const users = [];
const properties = [];

// Route d'inscription d'un utilisateur
app.post('/users/register', (req, res) => {
    const { username, email, password } = req.body;
    const user = { id: uuid.v4(), username, email, password, properties: [] };
    users.push(user);
    res.status(201).json(user);
});

// Route de connexion d'un utilisateur
app.post('/users/login', (req, res) => {
    // Vérification des informations d'authentification (simulé pour cet exemple)
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Génération d'un token (simulé pour cet exemple)
    const token = generateToken(user.id)
    res.status(200).json({ token });
});

// Route pour récupérer toutes les annonces immobilières
app.get('/properties', (req, res) => {
    // Retourner la liste complète des annonces
    res.status(200).json(properties);
});




// Middleware pour vérifier l'authentification
function authenticateUser(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Vérification réelle du token avec la clé secrète (simulé pour cet exemple)
        const decoded = jwt.verify(token, 'secret_key');

        // Ajout de l'ID utilisateur à l'objet de la requête
        req.user = { id: decoded.userId };

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

// Fonction pour générer un JWT avec l'ID de l'utilisateur
function generateToken(userId) {
    // Utilisez une clé secrète forte et gardez-la confidentielle
    const secretKey = 'secret_key';

    // Options du token (vous pouvez personnaliser cela selon vos besoins)
    const options = {
        expiresIn: '1h', // La durée de validité du token
    };

    // Créez le token en utilisant l'ID de l'utilisateur et la clé secrète
    const token = jwt.sign({ userId }, secretKey, options);

    return token;
}

// Route de récupération du profil utilisateur
app.get('/users/profile', authenticateUser, (req, res) => {
    // Récupérer l'utilisateur à partir du token (simulé pour cet exemple)
    const userId = req.user.id; // Remplacez cela par la vraie logique de récupération de l'utilisateur
    const user = users.find(u => u.id === userId);

    if (!user) {
        res.status(404).send("User not found")
    } else {
        res.status(200).json({
            username: user.username,
            email: user.email,
            properties: user.properties,
        });
    }


});

// Route de récupération du profil utilisateur
app.get('/get-my-properties', authenticateUser, (req, res) => {
    // Récupérer l'utilisateur à partir du token (simulé pour cet exemple)
    const userId = req.user.id; // Remplacez cela par la vraie logique de récupération de l'utilisateur
    const myProperties = properties.filter(u => u.userId === userId);
    console.log("properties", properties);
    console.log(myProperties);

    if (!myProperties) {
        res.status(404).send("Properties not found")
    } else {
        res.status(200).json(
            myProperties
        );
    }


});

// ... Ajoutez les autres routes ici (annonces immobilières, etc.)

app.post('/create-properties', authenticateUser, (req, res) => {
    const { title, description, price, location, images } = req.body;

    // Génération d'un identifiant unique pour la propriété
    const propertyId = uuid.v4();

    // Récupération de l'utilisateur à partir du token (simulé pour cet exemple)
    const userId = req.user.id // Remplacez cela par la vraie logique de récupération de l'utilisateur
    const user = users.find(u => u.id === userId);

    // Création de la nouvelle propriété
    const newProperty = {
        id: propertyId,
        title,
        description,
        price,
        location,
        userId: req.user.id,
        images,
    };

    // Ajout de la propriété à la liste des propriétés de l'utilisateur
    user.properties.push(propertyId);

    // Ajout de la propriété à la liste globale des propriétés
    properties.push(newProperty);

    res.status(201).json(newProperty);
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
