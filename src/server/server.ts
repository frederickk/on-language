import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv-safe';
import express, {Application, Request, Response} from 'express';
import fetch from 'node-fetch';
import nunjucks from 'nunjucks';
import path from 'path';
import {ChatGPTAPIBrowser} from 'chatgpt';
import {oraPromise} from 'ora';

import {NAME, VERSION} from '../globals';
import {ChatConfigure} from './chat-config';
import plugins from './chat-rules';
import {routeAbout} from './routes/about';
import {routeAsk} from './routes/ask';
import {routeDebug} from './routes/debug';
import {routeTrain} from './routes/train';
import * as log from '../globals/log';

const PORT = 3000;

dotenv.config({
  allowEmptyValues: true,
});

// Init ChatGPT API.
const openaiChat = new ChatGPTAPIBrowser({
  email: process.env.OPENAI_EMAIL!,
  password: process.env.OPENAI_PASSWORD!,
});

// ChatGPT API rules configuration.
const config = new ChatConfigure(plugins, openaiChat);

// Create Express app.
const app: Application = express()
  .engine('njk', nunjucks.render)
  .set('view engine', 'njk')
  .set('openai', openaiChat)
  .set('config', config)
  .use(cors())
  .use(bodyParser.json({
    limit: '50mb',
    type: 'application/json'
  }))
  .use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  }))
  // Routing
  .use('/v', (_req: Request, res: Response) => {
    res.status(200).send(`<pre>${NAME}\r\n${VERSION}</pre>`);
  })
  .use('/about', routeAbout)
  .use('/ask', routeAsk)
  .use('/debug', routeDebug)
  .use('/static', express.static(path.join(__dirname, '..', '..', 'static')))
  .use('/train', routeTrain)
  .use('/', (_req: Request, res: Response) => {
    res.status(200).render('index.njk', {});
  });

/** Configures Nunjucks rendering engine. */
nunjucks.configure(path.join(__dirname, '..', '..', 'src', 'client'), {
  autoescape: true,
  express: app,
  watch: true,
});

/** Initializes Express server. */
const init = () => {
  return new Promise<void>((resolve) => {
    app.listen(PORT, () => {
      log.log(`Server running at http://localhost:${PORT}/`);
      resolve();
    });
  });
};

// Starts server.
(async () => {
  await init();

  const auth = await oraPromise(openaiChat.getIsAuthenticated(), {
    text: '🔑 Confirming authentication status',
  });
  if (!auth) {
    await oraPromise(openaiChat.initSession(), {
      text: `☎️ Connecting to ChatGPT`,
    });
  }

  await fetch(`http://localhost:${PORT}/train`, {
    method: 'POST',
  });

  log.log('🤖👍');
})();
