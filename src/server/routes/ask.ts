import express, {Request, Response} from 'express';
import {oraPromise} from 'ora';
import * as log from '../../globals/log';

/** Duration to wait for response from ChatGPT server. */
const TIMEOUT = 2 * 60 * 1000;

export const routeAsk = express.Router();

// Sends request to persona instance of ChatGPT API for response.
routeAsk.post('/', async (req: Request, res: Response) => {
  const api = req.app.get('openai');
  const config = req.app.get('config');
  const message = req.body.message;

  try {
    const conversationId = config.conversationId;
    const parentMessageId = config.messageId;
    const reply: any = await oraPromise(api.sendMessage(message, {
      conversationId,
      parentMessageId,
      timeoutMs: TIMEOUT,
    }), {
      text: message,
    });

    log.log(`**********\n${JSON.stringify({...reply}, null, 2)}\n**********`);
    // const parsedReply = config.parse(reply);
    // log.log(`**********\n${JSON.stringify(parsedReply, null, 2)}\n**********`);

    return res.status(200).json({...reply});
  } catch (error) {
    return res.status(500).send({error});
  }
});
