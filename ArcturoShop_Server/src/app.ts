import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

// Configurações de Segurança
app.use(helmet());
app.use(cors());

// Parsing de Requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de health check
app.get('/', (_req, res) => {
  res.json({ message: 'ArcturoShop API 🚀', status: 'online' });
});

// Todas as rotas da API sob o prefixo /api
app.use('/api', router);

// Handler de erros global (deve ser sempre o último)
app.use(errorHandler);

export default app;
