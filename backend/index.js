require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { Configuration, OpenAIApi } = require ('openai')
const { OPENAI_API_KEY, PORT } = process.env


const configuration = new Configuration({
  apiKey: OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)
const app = express()

//aqui aplicamos um middleware e o cors (para permitir acessar diferentes fontes de dados nas requisições)
app.use(express.json())
app.use(cors())


// GET localhost:4000/teste -> {"mensagem": "Teste direto do Back End"}
app.get('/teste', (req, res) => {
  res.json({mensagem: "Teste direto do Back End"})  
})

// POST localhost:4000/sentimentos ({"texto": "Estou feliz"}) ->  {"sentimento": "Positivo" }
app.post('/sentimentos', (req, res) => {
  const { texto } = req.body
  openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Avalie o sentimento com apenas uma palavra: "Positivo","Negativo","Neutro", a frase a seguir, não modifique a frase original: ${texto}`,
    max_tokens: 150
  })
  .then(chatGPTResponse => {
    res.json({sentimento: chatGPTResponse.data.choices[0].text})
  })
  .catch(e => {
    console.log(e)
    res.status(500).end()
  })
})

const porta = PORT || 4000

app.listen(porta, () => console.log (`Servidor OK. Porta ${porta}`))