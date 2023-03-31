//@ts-ignore
import { dockStart } from '@nlpjs/basic';

import { AppModule } from "../types";
import { NLP } from './types';

export const setupNLP: AppModule = async (ctx) => {
  const log = ctx.logger('nlp')
  const logTrain = log.get('train')
  const dock = await dockStart({
    use: ['Basic', 'LangPt'],
    settings: {
      nlp: {
        nlu: {
          log: (status: string, time: number) => logTrain.debug('(%fms): %o', time, status)
        }
      }
    }
  });
  const nlp = dock.get('nlp');
  nlp.addLanguage('en');
  // Adds the utterances and intents for the NLP
  nlp.addDocument('en', 'goodbye for now', 'greetings.bye');
  nlp.addDocument('en', 'bye bye take care', 'greetings.bye');
  nlp.addDocument('en', 'okay see you later', 'greetings.bye');
  nlp.addDocument('en', 'bye for now', 'greetings.bye');
  nlp.addDocument('en', 'i must go', 'greetings.bye');
  nlp.addDocument('en', 'hello', 'greetings.hello');
  nlp.addDocument('en', 'hi', 'greetings.hello');
  nlp.addDocument('en', 'howdy', 'greetings.hello');

  // Train also the NLG
  nlp.addAnswer('en', 'greetings.bye', 'Till next time');
  nlp.addAnswer('en', 'greetings.bye', 'see you soon!');
  nlp.addAnswer('en', 'greetings.hello', 'Hey there!');
  nlp.addAnswer('en', 'greetings.hello', 'Greetings!');
  await nlp.train();
  ctx.inject('nlp', nlp as NLP)
  log.notice('NLP setup complete!')
}