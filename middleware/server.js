
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger Middleware
const logger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;

        const log = `${new Date().toISOString()} ${req.method} ${req.url} ${res.statusCode} ${duration}ms\n`;

        fs.appendFile('server.log', log, (err) => {
            if (err) console.log("Failed to write log:", err);
        });
    });

    next();
};

app.use(logger);

// Validation Middleware
const validate = (req, res, next) => {
    if (!req.body) {
        const err = new Error("Patient details missing");
        err.statusCode = 400;
        throw err;
    }

    const { name, gender, ward } = req.body;

    if (!name || !gender || !ward) {
        const err = new Error("Patient details are missing");
        err.statusCode = 400;
        throw err;
    }

    next();
};

// POST - Create Patient
app.post('/api/v1/patients', validate, (req, res) => {
    res.status(200).send("Patient record created successfully");
});

// GET - Fetch All Patients or By UID
app.get('/api/v1/patient', (req, res) => {
    const { uid } = req.query;

    if (uid) {
        return res.status(200).send(
            `Patient of ${uid} fetched successfully`
        );
    } else {
        res.status(200).send("All patients fetched successfully");
    }
});

// GET - Fetch Patient By ID
app.get('/api/v1/patient/:id', (req, res) => {
    const id = req.params.id;

    res.status(200).send(
        `Patient with id ${id} fetched successfully`
    );
});

// PUT - Update Patient
app.put('/api/v1/patient/:id', validate, (req, res) => {
    const id = req.params.id;

    res.status(200).send(
        `Patient with id ${id} updated successfully`
    );
});

// DELETE - Delete Patient
app.delete('/api/v1/patient/:id', (req, res) => {
    const id = req.params.id;

    res.status(200).send(
        `Patient with id ${id} deleted successfully`
    );
});

// 404 Error Middleware
app.use((req, res) => {
    res.status(404).send("Resource not found");
});

// Common Error Middleware
app.use((err, req, res, next) => {
    const errorCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(errorCode).send(message);
});

// Start Server
const PORT = 7000;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
