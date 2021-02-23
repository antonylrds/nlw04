import express from 'express';

const app = express();

app.get('/', (request, response) => {
  return response.json({msg:'Hello World NLW04!'});
})

app.post('/', (request, response) => {
  return response.json({msg: 'Os dados foram salvos com sucesso'});
})

app.listen(3333, () => {
  console.log('Server started on port 3333');
})