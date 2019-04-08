(function() {
  let inputArea = document.getElementById("text-area");
  let text = `How trope-y is your spec fic? Blue highlights your cliché hero, green indicates a trope-y quest, purple wields a classic item, yellow summons up a fairly well-known sentence, and red is just a complete cliché`;
  inputArea.value = text;

  let data = {
    paragraphs: 0,
    sentences: 0,
    words: 0,
    clicheSentences: 0,
    veryclicheSentences: 0,
    hero: 0,
    quest: 0,
    tool: 0
  };

  function format() {
    data = {
      paragraphs: 0,
      sentences: 0,
      words: 0,
      clicheSentences: 0,
      veryclicheSentences: 0,
      hero: 0,
      quest: 0,
      tool: 0
    };
    ("use strict");
    let inputArea = document.getElementById("text-area");
    let text = inputArea.value;
    let paragraphs = text.split("\n");
    let outputArea = document.getElementById("output");
    let clicheSentences = paragraphs.map(p => getClicheSentences(p));
    let inP = clicheSentences.map(para => `<p>${para}</p>`);
    data.paragraphs = paragraphs.length;
    console.log(data);
    counters();
    outputArea.innerHTML = inP.join(" ");
  }
  window.format = format;
  format();

  function counters() {
    document.querySelector("#hero").innerHTML = `You have ${
      data.hero
    } cliché hero${data.hero > 1 ? "s" : ""}.`;
    document.querySelector(
      "#quest").innerHTML = `You have used an oft-repeated quest-term ${data.quest} time${
      data.quest > 1 ? "s" : ""
    }. Perhaps switch up the trajectory of your story?`;
    document.querySelector("#tool").innerHTML = `${data.tool} item${
      data.tool > 1 ? "s" : ""
    } is a commonly found tool.`;
    document.querySelector("#clicheSentence").innerHTML = `${
      data.clicheSentences
    } of ${data.sentences} sentence${
      data.sentences > 1 ? "s are" : " is"
    } cliché as heck`;
    document.querySelector("#veryclicheSentence").innerHTML = `${
      data.veryclicheSentences
    } of ${data.sentences} sentence${
      data.sentences > 1 ? "s are" : " is"
    } perhaps a little toxically cliché`;
  }

  function getClicheSentences(p) {
    let sentences = getSentenceFromParagraph(p + " ");
    data.sentences += sentences.length;
    let hardOrNot = sentences.map(sent => {
      let cleanSentence = sent.replace(/[^a-z0-9. ]/gi, "") + ".";
      let words = cleanSentence.split(" ").length;
      let letters = cleanSentence.split(" ").join("").length;
      data.words += words;
      sent = gethero(sent);
      sent = gettool(sent);
      sent = getquest(sent);
      sent = getQualifier(sent);
      let level = calculateLevel(letters, words, 1);
      if (level < 14) {
        return sent;
      } else if (level >= 10 && level < 14) {
        data.clicheSentences += 1;
        return `<span class="clicheSentence">${sent}</span>`;
      } else if (level >= 14) {
        data.veryclicheSentences += 1;
        return `<span class="veryclicheSentence">${sent}</span>`;
      } else {
        return sent;
      }
    });

    return hardOrNot.join(" ");
  }

  function getquest(sentence) {
     let questWords = getQuestWords();
    return sentence
      .split(" ")
      .map(word => {
        if (
          word.replace(/[^a-z0-9. ]/gi, "").match(/quest$/) &&
          questWords[word.replace(/[^a-z0-9. ]/gi, "").toLowerCase()] === undefined
        ) {
          data.quest += 1;
          return `<span class="quest">${word}</span>`;
        } else {
          return word;
        }
      })
      .join(" ");
  }


  function getSentenceFromParagraph(p) {
    let sentences = p
      .split(". ")
      .filter(s => s.length > 0)
      .map(s => s + ".");
    return sentences;
  }

  function calculateLevel(letters, words, sentences) {
    if (words === 0 || sentences === 0) {
      return 0;
    }
    let level = Math.round(
      4.71 * (letters / words) + 0.5 * words / sentences - 21.43
    );
    return level <= 0 ? 0 : level;
  }

  function gethero(sentence) {
    let lyWords = getLyWords();
    return sentence
      .split(" ")
      .map(word => {
        if (
          word.replace(/[^a-z0-9. ]/gi, "").match(/ly$/) &&
          lyWords[word.replace(/[^a-z0-9. ]/gi, "").toLowerCase()] === undefined
        ) {
          data.hero += 1;
          return `<span class="hero">${word}</span>`;
        } else {
          return word;
        }
      })
      .join(" ");
  }

  function gettool(sentence) {
    let words = gettoolWords();
    let wordList = Object.keys(words);
    wordList.forEach(key => {
      sentence = findAndSpan(sentence, key, "tool");
    });
    return sentence;
  }

  function findAndSpan(sentence, string, type) {
    let index = sentence.toLowerCase().indexOf(string);
    let a = { tool: "tool", qualifier: "hero" };
    if (index >= 0) {
      data[a[type]] += 1;
      sentence =
        sentence.slice(0, index) +
        `<span class="${type}">` +
        sentence.slice(index, index + string.length) +
        "</span>" +
        findAndSpan(sentence.slice(index + string.length), string, type);
    }
    return sentence;
  }

  function getQualifier(sentence) {
    let qualifiers = getQualifyingWords();
    let wordList = Object.keys(qualifiers);
    wordList.forEach(key => {
      sentence = findAndSpan(sentence, key, "qualifier");
    });
    return sentence;
  }

  function getQualifyingWords() {
    return {
      "long time ago": 1,
      "once upon in a time": 1,
      "in a galaxy": 1, 
      "in a kingdom": 1,
      "in a dream": 1,
      "magic powers": 1,
      "saw a vision": 1,
      "had a prophecy": 1,
      "cast a curse": 1,
      "cast a spell": 1,
    };
  }

  function getLyWords() {
    return {
      wizard: 1,
      witch: 1,
      kingdom: 1,
      castle: 1,
      elves: 1,
      dragons: 1,
      serpents: 1,
      griffons: 1,
      alien: 1,
      prince: 1,
      princess: 1,
      hero: 1,
      king: 1,
      queen: 1,
      lord: 1,
      galactic: 1,
      monster: 1,
    };
  }

  function getQuestWords() {
    return {
      adventure: 1,
      quest: 1,
      prophecy: 1,
      odyssey: 1,
      voyage: 1,
      reclaim: 1,
    };
  }

  function gettoolWords() {
    return {
      "an heirloom": ["a relic", "a wish"],
      sword: ["blade", "eh"],
      "wand": ["staff"],
      axe: ["a dwarf?"],
      phaser: ["space guns are overrated"],
      federation: ["every space fantasy has a federation"],
      spaceship: ["Any ot"],
      accorded: ["given"],
      accrue: ["add", "gain"],
    };
  }

  function getJustifierWords() {
    return {
      "long time ago": 1,
      "once upon in a time": 1,
      "in a galaxy": 1, 
      "in a kingdom": 1,
      "in a dream": 1,
      "magic powers": 1,
      "saw a vision": 1,
      "had a prophecy": 1,
      "cast a curse": 1,
      "cast a spell": 1,
    };
  }
})();