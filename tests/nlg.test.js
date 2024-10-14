const { describe, test, expect } = require('@bokata/testing');
const { Nlg } = require('../lib');

describe('NLG Manager', () => {
  describe('constructor', () => {
    test('Should create an instance', () => {
      const nlg = new Nlg();
      expect(nlg).toBeDefined();
    });
  });

  describe('Add', () => {
    test('Should add an answer', () => {
      const nlg = new Nlg();
      nlg.add('en', 'greet', 'Hello');
      expect(nlg.responses.en.greet).toHaveLength(1);
      expect(nlg.responses.en.greet[0]).toEqual('Hello');
    });
    test('Should not add a duplicate entry', () => {
      const nlg = new Nlg();
      nlg.add('en', 'greet', 'Hello');
      nlg.add('en', 'greet', 'Hello');
      expect(nlg.responses.en.greet).toHaveLength(1);
    });
    test('Should add several answers for the same intent and locale', () => {
      const nlg = new Nlg();
      nlg.add('en', 'greet', 'Hello');
      nlg.add('en', 'greet', 'Greetings');
      nlg.add('en', 'greet', 'Hi');
      expect(nlg.responses.en.greet).toHaveLength(3);
    });
    test('Should be able to create responses for different intents of a locale', () => {
      const nlg = new Nlg();
      nlg.add('en', 'greet', 'Hello');
      nlg.add('en', 'greet', 'Greetings');
      nlg.add('en', 'greet', 'Hi');
      nlg.add('en', 'bye', 'Goodbye');
      nlg.add('en', 'bye', 'Bye');
      expect(nlg.responses.en.greet).toHaveLength(3);
      expect(nlg.responses.en.bye).toHaveLength(2);
    });
    test('Should be able to create responses for different intents and locales', () => {
      const nlg = new Nlg();
      nlg.add('en', 'greet', 'Hello');
      nlg.add('en', 'greet', 'Greetings');
      nlg.add('en', 'greet', 'Hi');
      nlg.add('en', 'bye', 'Goodbye');
      nlg.add('en', 'bye', 'Bye');
      nlg.add('es', 'greet', 'Hola');
      nlg.add('es', 'greet', 'Holi!');
      nlg.add('es', 'bye', 'Hasta luego');
      nlg.add('es', 'bye', 'Hasta otra');
      nlg.add('es', 'bye', 'Nos vemos!');
      expect(nlg.responses.en.greet).toHaveLength(3);
      expect(nlg.responses.en.bye).toHaveLength(2);
      expect(nlg.responses.es.greet).toHaveLength(2);
      expect(nlg.responses.es.bye).toHaveLength(3);
    });
  });

  describe('Remove', () => {
    test('Should remove an added response', () => {
      const nlg = new Nlg();
      nlg.add('en', 'greet', 'Hello');
      nlg.add('en', 'greet', 'Greetings');
      nlg.add('en', 'greet', 'Hi');
      nlg.add('en', 'bye', 'Goodbye');
      nlg.add('en', 'bye', 'Bye');
      nlg.add('es', 'greet', 'Hola');
      nlg.add('es', 'greet', 'Holi!');
      nlg.add('es', 'bye', 'Hasta luego');
      nlg.add('es', 'bye', 'Hasta otra');
      nlg.add('es', 'bye', 'Nos vemos!');
      nlg.remove('es', 'greet', 'Holi!');
      expect(nlg.responses.en.greet).toHaveLength(3);
      expect(nlg.responses.en.bye).toHaveLength(2);
      expect(nlg.responses.es.greet).toHaveLength(1);
      expect(nlg.responses.es.bye).toHaveLength(3);
    });
    test('Should not remove a non-existing response', () => {
      const nlg = new Nlg();
      nlg.add('en', 'greet', 'Hello');
      nlg.remove('en', 'greet', 'Hell');
      expect(nlg.responses.en.greet).toHaveLength(1);
    });

    describe('Find all answers', () => {
      test('It should return all answers from intent and locale', () => {
        const nlg = new Nlg();
        nlg.add('en', 'greet', 'Hello');
        nlg.add('en', 'greet', 'Greetings');
        nlg.add('en', 'greet', 'Hi');
        const result = nlg.findAllAnswers('en', 'greet');
        expect(result).toHaveLength(3);
      });
      test('It should return empty array if locale does not exist', () => {
        const nlg = new Nlg();
        nlg.add('en', 'greet', 'Hello');
        const result = nlg.findAllAnswers('es', 'greet');
        expect(result).toHaveLength(0);
      });
      test('It should return empty array if intent does not exist for locale', () => {
        const nlg = new Nlg();
        nlg.add('en', 'greet', 'Hello');
        const result = nlg.findAllAnswers('en', 'bye');
        expect(result).toHaveLength(0);
      });
    });
  });

  describe('Run', () => {
    test('It should return an answer', () => {
      const nlg = new Nlg();
      nlg.add('en', 'greet', 'Hello');
      const result = nlg.run('en', 'greet');
      expect(result).toBe('Hello');
    });
    test('It should render patterns', () => {
      const nlg = new Nlg();
      nlg.add('en', 'greet', '(Hi|Hello) user');
      const result = nlg.run('en', 'greet');
      expect(['Hi user', 'Hello user'].includes(result)).toBeTruthy();
    });
  });
});
