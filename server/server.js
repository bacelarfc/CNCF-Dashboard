import express from 'express';
import bodyParser from 'body-parser';
import router from './routers/router.js';
import projectRouter from './routers/projectRouter.js';
import userRouter from "./routers/userRouter.js";
import loginRouter from "./routers/loginRouter.js";
import cors from 'cors';
import { createClient } from 'redis';

// Initialize Redis
const redisClient = createClient({
  host: 'localhost',
  port: 6379,
});
await redisClient.connect();
export { redisClient };

const app = express();
app.use(cors());
app.use(express.static("../client/dist"));
app.use(express.static("public"));
app.use(express.json()); 
app.use(bodyParser.json());
app.use(router);
app.use('/api/auth', loginRouter);
app.use(projectRouter);
app.use(userRouter);
app.use(loginRouter);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});