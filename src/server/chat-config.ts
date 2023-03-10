import {ChatGPTAPI, ChatGPTAPIBrowser} from 'chatgpt';
import {IConfig} from './chat-rules';
import * as log from '../globals/log';

/**
 * Configures ChatGPTAPI with given parameters.
 */
export class ChatConfigure {
  private api_!: ChatGPTAPI | ChatGPTAPIBrowser;

  /**
   * Conversation ID assigned to this particular persona, allows for
   * conversation continuity
   */
  public conversationId: string = '';

  /** Message ID of parent messages. */
  public messageId: string = '';

  /** Parses content as defined in rules. */
  public parsers: any[] = [];

  /** Rules that are sent to ChatGPT to clarify expectations. */
  public rules: any[] = [];

  constructor({plugins}: IConfig, api: ChatGPTAPI | ChatGPTAPIBrowser) {
    this.api_ = api;

    // Collect rules and parsers from all plugins
    for (const plugin of plugins) {
      if (plugin.rules) {
        this.rules = this.rules.concat(plugin.rules);
      }
      if (plugin.parse) {
        this.parsers.push(plugin.parse);
      }
    }
  }

  /** Runs the ChatGPT response through all plugin parsers. */
  public async parse(reply: any) {
    for (const parser of this.parsers) {
      reply = await parser(reply);
    }

    return reply;
  };

  /** Sends ChatGPT a training message that includes all plugin rules. */
  public async train() {
    if (!this.rules.length) return;

    const message = `
      Please follow these rules when replying to me:
      ${this.rules.map((rule) => `\n- ${rule}`)}
    `;
    log.log('📚 Training Rules');
    log.log(message);

    const reply = await this.api_.sendMessage(message);
    log.log(['🤓', reply]);

    try {
      this.conversationId = reply.conversationId;
      this.messageId = reply.messageId;
    } catch(err) {
      log.log('Couldn\'t find "conversationId" or "messageId".');
    }

    return reply;
  };
}
