var BOTAI = [
  {
    tags: "exception",
    query: [],
    res: [
      "Sorry, could't find what you are looking",
      "Hi, how may I help you??",
    ],
  },
  {
    tags: "greetings",
    query: ["hi", "hello", "hey", "there?"],
    res: ["Hi, how may I help you???", "Hey"],
  },
  {
    tags: "url",
    query: ["what is url", "what is qa url", "url", "qa", "deploy"],
    multipleChoice: ["qa1", "qa2", "qa3", "qa4"],
  },
  {
    tags: "signoff",
    query: ["bye", "goodbye", "see you"],
    res: ["Goodbye", "Bye"],
  },
  { tags: "qa1 url", query: ["qa1"], res: ["qa1.com"] },
];
var userInput = document.querySelector("input");
var botResponses = document.querySelector(".bot-responses");
var mostMatch = { tag: 0, percentage: 0 };

function getMultipleChoiceTemplate(multipleChoice) {
  let htm = `<sup class="bot-ic">bot</sup><div class='cls-choice'>Please select option from below:`;
  multipleChoice.forEach((choices) => {
    htm += `
        <div class="bot-msg-choice" onClick="sendClick('${choices}')">
            ${choices}
        </div>`;
  });
  return htm + "</div>";
}
function getBotResponseTemplate(res) {
  return `
    <sup class="bot-ic">bot</sup>
    <div class="bot-msg">
        ${res}
    </div>`;
}
function getUserResponseTemplate(res) {
  return `
      <sup class="user-ic">you</sup>
      <div class="user-msg">
          ${res}
      </div>`;
}
function attachUserInput(res) {
  botResponses.innerHTML += getUserResponseTemplate(res);
}
function attachBotInput(choiceInput) {
  BOTAI.forEach((botai) => checkQuery(botai, choiceInput));
  const index = BOTAI.findIndex((element) => element.tags == mostMatch.tag);

  if (index == -1) {
    botResponses.innerHTML += getBotResponseTemplate(BOTAI[0].res[0]);
  } else if (
    BOTAI[index].multipleChoice &&
    BOTAI[index].multipleChoice.length > 0
  ) {
    botResponses.innerHTML += getMultipleChoiceTemplate(
      BOTAI[index].multipleChoice
    );
  } else {
    botResponses.innerHTML += getBotResponseTemplate(BOTAI[index].res[0]);
  }
}
function sendClick(choiceInput = null) {
  choiceInput = choiceInput != null ? choiceInput : userInput.value;
  attachUserInput(choiceInput);
  attachBotInput(choiceInput);
  //reset
  mostMatch = { tag: 0, percentage: 0 };
  userInput.value = "";
}
function checkQuery(botai, choiceInput) {
  const queries = botai.query;
  const userInp = choiceInput.toLocaleLowerCase().split(" ");

  for (let i = 0; i < queries.length; i++) {
    let found = 0;
    const singleQuery = queries[i].split(" ");
    for (let j = 0; j < singleQuery.length; j++) {
      userInp.forEach((ui) => (found += ui == singleQuery[j] ? 1 : 0));
    }
    const percent = (found / userInp.length) * 100;
    if (mostMatch.percentage < percent) {
      mostMatch.tag = botai.tags;
      mostMatch.percentage = percent;
    }
  }
}

(function () {
  attachBotInput("hi");
  mostMatch = { tag: 0, percentage: 0 };
})();
