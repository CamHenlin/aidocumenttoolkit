require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');



const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

let modelOptions = {
    // temperature: 0.2   
}

let modelName = `openhermes` //`mixtral:instruct` //`openhermes`// `alfred` //  //

const aiCall = async (prompt) => {
    try {
        console.log(`calling ai with prompt: ${prompt}`)
        const response = await axios.post(process.env.AI_ENDPOINT, {
            model: modelName,
            prompt,
            stream: false,
            options: modelOptions
        });

        console.log(`done calling ai, response:`, response.data.response);
        console.log(`prompt tokens: ${response.data.prompt_eval_count}`)
        return response.data.response
    } catch (error) {
        console.error(`error calling ai`, error);
        return `ERROR: ${error}`
    }
};

// POST route
app.post('/ai', async (req, res) => {
    const data = req.body.ai;
    console.log('Received data:', data);

    res.json({ message: await aiCall(data) });
});

// Start the server
const port = process.env.PORT;
app.listen(port, () => console.log(`Server is running on port ${port}`));