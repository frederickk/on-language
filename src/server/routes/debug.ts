import express, {Request, Response} from 'express';
import * as log from '../../globals/log';

export const routeDebug = express.Router();

const debugHandler_ = (api: any, res: Response) => {
  try {
    log.log(`----------\n${JSON.stringify(api, null, 2)}\n----------`);
    return res.status(200).json(api);
  } catch (error) {
    return res.status(500).send({error});
  }
}

// Retrieves ChatGPT API instantiation and prints it to console.
routeDebug.all('/openai', async (req: Request, res: Response) => {
  const api = req.app.get('openai');
  return debugHandler_(api, res);
});
