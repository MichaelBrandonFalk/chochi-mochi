// Five connected scenes apply all 19 ideas. Creative choices change this afternoon.
export const partyActs=[
  {
    "title": "There is a place for you",
    "intro": [
      "The friends arrive beside the bluebell house. Glaloula comes out in her purple dress, with a blue feather in one pocket. “You came back!” she says.",
      "She looks at the art table. “I want to join in. I also feel unsure.” Chochi the Dinosaur remembers Tuck’s welcome flags. They can make room for both things."
    ],
    "mode": "collect",
    "prompt": "Set out four things that make a welcome.",
    "slots": [
      "A place",
      "Room for feelings",
      "Time to listen",
      "Words that understand"
    ],
    "cards": [
      [
        "A place for Glaloula now",
        0
      ],
      [
        "Room for glad and unsure together",
        1
      ],
      [
        "Time for her whole story",
        2
      ],
      [
        "I hear that choosing feels hard",
        3
      ],
      [
        "Wait for worry to leave before offering a seat",
        -1
      ]
    ],
    "ideas": [
      0,
      1,
      2,
      3
    ],
    "hint": "Welcome is here with the feeling. Listen first and name what you hear.",
    "success": "Glaloula puts her feather beside the cup. “Thank you for hearing both parts,” she says."
  },
  {
    "title": "Hang the two lanterns",
    "intro": [
      "Luma’s lanterns are in the basket. Chochi the Dinosaur hangs them where everyone can see. Their windows make gentle shapes on the picnic cloth.",
      "Glaloula asks, “Will every color I pick be just right?” Mochi the Unicorn can give trust without making a perfect promise."
    ],
    "mode": "compose",
    "prompt": "Build a reply for the care lantern and the trust lantern.",
    "slots": [
      "Care for the feeling",
      "Trust in coping"
    ],
    "cards": [
      [
        "I know it feels hard to feel unsure",
        0
      ],
      [
        "I believe you can cope",
        1
      ],
      [
        "Every color will be perfect",
        -1
      ],
      [
        "I can choose the colors so it feels easier",
        -1
      ]
    ],
    "ideas": [
      4,
      5
    ],
    "hint": "Hear the hard feeling and trust her ability to cope. No perfect promise is needed.",
    "success": "Both lanterns glow. Glaloula can be heard without being promised a perfect afternoon. “I still wish I knew which color to pick,” she says. Mochi the Unicorn listens. The kind reply need not make the wish leave."
  },
  {
    "title": "Fern’s little planning basket",
    "intro": [
      "Fern brings her notes from her trained helper. “I often pick the paint when Glaloula asks,” she says. “It helps for a moment. Then she asks me to pick the next one. I am planning my own response.”",
      "The low stool stays by the table so Glaloula can reach. Chochi the Dinosaur and Mochi the Unicorn can help arrange Fern’s story cards. The adults lead the real care plan."
    ],
    "mode": "collect",
    "prompt": "Help Fern choose what to do with her notes. Each small part tells you what is happening.",
    "slots": [
      "Adult action",
      "Needed support",
      "Notice a pattern",
      "One small target",
      "Clear details",
      "Tell ahead",
      "Keep the plan with care"
    ],
    "cards": [
      [
        "Plan Fern’s own response, rather than timing Glaloula",
        0
      ],
      [
        "Keep the stool so Glaloula can reach the paints",
        1
      ],
      [
        "Write: she asked me to pick, and I picked the color",
        2
      ],
      [
        "Work on choosing paint at this art time only",
        3
      ],
      [
        "After lunch tomorrow, Fern will not pick paint colors; help to reach them stays",
        4
      ],
      [
        "Prepare with the helper, then tell Glaloula before starting",
        5
      ],
      [
        "Hear her wish, keep needed help, and use the prepared response",
        6
      ],
      [
        "Ask Glaloula to choose faster",
        -1
      ],
      [
        "Write that Fern will try to help less",
        -1
      ]
    ],
    "rounds": [
      {
        "title": "Notice the pattern and keep care",
        "cardIds": [
          0,
          1,
          2,
          7
        ],
        "story": "Glaloula asks Fern to choose each color. Fern opens her notebook. Which notes help her look at her own part?"
      },
      {
        "title": "Choose one clear adult change",
        "cardIds": [
          3,
          4,
          8
        ],
        "story": "Fern and her helper choose one art-time pattern to work on. Which notes make the adult change clear?"
      },
      {
        "title": "Tell the plan and use care",
        "cardIds": [
          5,
          6,
          7
        ],
        "story": "Fern prepares before the change. Later, Glaloula says, “I still wish you would pick.” Which actions fit?"
      }
    ],
    "ideas": [
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "hint": "Look at what Fern does, keep needed access, prepare and explain the specific change, then use the response with care.",
    "success": "Fern packs her notes together. “This is my work to do with my helper,” she says. “You two can be friends.”"
  },
  {
    "title": "Tea while feelings are here",
    "intro": [
      "Glaloula holds a brush. “I still feel worried,” she says. The pot is on the table, with space for more than one color.",
      "Fern sets down her tea. There is no race to finish the pot or make a feeling leave. The friends remember the cloud garden, Brin’s pause card, and Nell’s song."
    ],
    "mode": "collect",
    "prompt": "Choose four things that belong at this table.",
    "slots": [
      "Care stays",
      "A grown-up’s pause",
      "Trust without a loop",
      "Adults lead care"
    ],
    "cards": [
      [
        "Care can stay while worry stays",
        0
      ],
      [
        "Fern can pause and use warm words",
        1
      ],
      [
        "Offer trust instead of endless perfect promises",
        2
      ],
      [
        "Caring adults lead treatment plans",
        3
      ],
      [
        "Ask Glaloula to look happy so Fern feels better",
        -1
      ],
      [
        "Wait for worry to leave before noticing her step",
        -1
      ]
    ],
    "ideas": [
      13,
      14,
      15,
      16
    ],
    "hint": "A worried feeling does not cancel a step. Adults care for their responses and lead the care plan.",
    "success": "They share the tea. Glaloula is still herself, with her art, her favorite stories, and whatever feelings are here."
  },
  {
    "title": "Room for another page",
    "intro": [
      "A few days later, the friends visit again. Some of the pot is painted. Some of it is plain. Glaloula has made a leaf boat to show them.",
      "Fern opens her book. “Twice, I used the response I planned. Once, I picked blue by habit. I wrote down all three times.” Mochi the Unicorn remembers Linn’s blank page. “There is room to learn from each one.”"
    ],
    "mode": "collect",
    "prompt": "Help Fern notice what happened and prepare for her review.",
    "slots": [
      "Notice a real step",
      "Keep learning"
    ],
    "cards": [
      [
        "Notice both the tries and the time Fern picked by habit",
        0
      ],
      [
        "Bring all three notes and questions about needed support to the helper",
        1
      ],
      [
        "Write down only the two times Fern remembered the plan",
        -1
      ],
      [
        "Make the change bigger tomorrow to make up for the missed step",
        -1
      ]
    ],
    "ideas": [
      17,
      18
    ],
    "hint": "Notice real actions, include the missed step without blame, and review needs and support with the helper.",
    "success": "Fern keeps all three notes. Her helper can help her look at what made the step hard and what support she needs. Glaloula opens the blank page. “Leave room for my next story, too,” she says.",
    "rounds": [
      {
        "title": "An honest look back",
        "story": "Fern remembered twice and picked once. What belongs in the book?",
        "cardIds": [
          0,
          2
        ]
      },
      {
        "title": "Room to learn again",
        "story": "Fern will meet her helper at the planned review. What should she bring?",
        "cardIds": [
          1,
          3
        ]
      }
    ]
  }
];
export function partyProject(act){return {mode:act.mode,title:act.title,prompt:act.prompt,slots:act.slots,cards:act.cards.map(([text,target])=>({text,target})),hint:act.hint,success:act.success,...(act.rounds?{rounds:act.rounds}:{})};}
