const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const dotenv=require("dotenv")
dotenv.config();
app.use(express.json());
const experienceData = [
  {
    company: "Mashal",
    position: "Sports Co-Cordinator",
    skills: ["Team Management", "Leadership"],
  },
  {
    company: "Science and Technology Council IIT BHU",
    position: "Frontend Developer",
    skills: ["React.js", "Node.js", "git", "github"],
  }
];

const educationData = [
  {
    institution: "IIT (BHU) Varanasi",
    degree: "BTech, Electronics and Communication",
    skills: ["Node.js", "DSA", "Matlab", "Back-End Development","Competitive Programming"],
  }
];

const API_KEY = process.env.GROQ_KEY
console.log(API_KEY)
app.post('/api/agent', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const SYSTEM_PROMPT = `
    You are Khushbu's personal assistant. Use these guidelines:
    1. Answer based on his experience (${JSON.stringify(experienceData)}) 
       and education (${JSON.stringify(educationData)})
    2. Keep responses concise (1-2 paragraphs max)
    3. Use friendly, professional tone
    4. For technical questions, highlight relevant skills
    5. If unsure, ask for clarification
    `;
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: 'deepseek-r1-distill-llama-70b',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: query },
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });
        const { choices } = await response.json();
        const answer = choices[0].message.content;
        const cleanAnswer = answer.replace(/<think>[\s\S]*?<\/think>/g, '');
        
        return res.json({ answer: cleanAnswer });
      } catch (error) {
        console.error(`Error with API key ...: ${error}`);
      }

    res.status(500).json({ error: "All API keys failed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(PORT, () => {
  console.log(`AI Agent server running on port ${PORT}`);
});