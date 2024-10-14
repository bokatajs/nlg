function render(answer) {
  if (!answer) {
    return answer;
  }
  let text = answer;
  let matchFound;
  do {
    const match = /\((?:[^()]+)\|(?:[^()]+)\)/g.exec(text);
    if (match) {
      for (let i = 0; i < match.length; i += 1) {
        const source = match[i];
        const options = source.substring(1, source.length - 1).split('|');
        text = text.replace(source, options[Math.floor(Math.random() * options.length)]);
      }
      matchFound = true;
    } else {
      matchFound = false;
    }
  } while (matchFound);
  return text;
}

class Nlg {
  constructor() {
    this.responses = {};
  }

  findAllAnswers(locale, intent) {
    return this.responses[locale]?.[intent] || [];
  }

  indexOfAnswer(locale, intent, answer) {
    const answers = this.findAllAnswers(locale, intent);
    for (let i = 0; i < answers.length; i += 1) {
      if (answers[i] === answer) {
        return i;
      }
    }
    return -1;
  }

  add(locale, intent, answer) {
    const index = this.indexOfAnswer(locale, intent, answer);
    if (index === -1) {
      if (!this.responses[locale]) {
        this.responses[locale] = {};
      }
      if (!this.responses[locale][intent]) {
        this.responses[locale][intent] = [];
      }
      this.responses[locale][intent].push(answer);
    }
  }

  remove(locale, intent, answer) {
    const index = this.indexOfAnswer(locale, intent, answer);
    if (index !== -1) {
      this.responses[locale][intent].splice(index, 1);
    }
  }

  run(locale, intent) {
    const answers = this.findAllAnswers(locale, intent);
    if (answers.length) {
      return render(answers[Math.floor(Math.random() * answers.length)]);
    }
    return undefined;
  }
}

module.exports = { Nlg };
