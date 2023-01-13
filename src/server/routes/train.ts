import express, {Request, Response} from 'express';
import {oraPromise} from 'ora';
import * as log from '../../globals/log';

export const routeTrain = express.Router();

routeTrain.post('/', async (req: Request, res: Response) => {
  const config = req.app.get('config');

  const conversationId = config.conversationId;
  const messageId = config.messageId;
  log.log(`👩‍🏫 School:`);
  log.log(['conversationId:', conversationId]);
  log.log(['messageId', messageId]);

  await oraPromise(config.train(), {
    text: `👩‍🏫 Learning (${config.rules.length} rules, ${config.parsers.length} parsers)`,
  });

  log.log(`----------\n${JSON.stringify(config, null, 2)}\n----------`);
  return res.status(200).json(config);
});
