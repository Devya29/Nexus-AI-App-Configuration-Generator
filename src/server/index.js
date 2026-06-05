
const express = require('express');
const path = require('path');
const { runPipeline } = require('../pipeline');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const result = await runPipeline(prompt);
    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Nexus server running on http://localhost:${PORT}`);
});
