const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/api/classify', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    const USER_ID = 'qif8eapf2cai';
    const PAT = 'f103e19d7fa742ff9a5c922bcfc868d7';
    const APP_ID = 'Foodie';
    const WORKFLOW_ID = 'Food';

    const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
    const stub = ClarifaiStub.grpc();
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + PAT);

    // Read the uploaded image as base64
    const imagePath = path.join(__dirname, req.file.path);
    const imageBytes = fs.readFileSync(imagePath, { encoding: 'base64' });

    stub.PostWorkflowResults(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            workflow_id: WORKFLOW_ID,
            inputs: [
                { data: { image: { base64: imageBytes } } }
            ]
        },
        metadata,
        (err, response) => {
            // Clean up uploaded file
            fs.unlinkSync(imagePath);

            if (err) {
                return res.status(500).json({ error: err.toString() });
            }

            if (response.status.code !== 10000) {
                return res.status(500).json({ error: "Post workflow results failed, status: " + response.status.description });
            }

            // Return the concepts from the first output
            const results = response.results[0];
            const concepts = results.outputs[0].data.concepts;
            res.json({ concepts });
        }
    );
});

module.exports = router;