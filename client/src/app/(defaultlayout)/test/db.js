import { passage_0, passage_1 } from "./part7.db";

export const textOfTypeQues = {
  part1: "Part 1",
  part2: "Part 2",
  part3: "Part 3",
  part4: "Part 4",
  part5: "Part 5",
  part6: "Part 6",
  part7: "Part 7",
};
const passage1 = {
  type: "html",
  html: `<p><strong>Invoice </strong>Date: October 4<br />From: Oresund Graphics and Design<br /> 49 Rozenstraat, Arnhem, Netherlands<br />To: Kaiser Investment Services<br /> 1 Kornmarkt, Floor 4, Frankfurt, Germany</p>
  <table border="1" cellspacing="10" cellpadding="10">
  <tbody>
  <tr>
  <td>Services</td>
  <td>Charges</td>
  </tr>
  <tr>
  <td>Design, Layout, and Photography of Annual Shareholders Report</td>
  <td>&euro;745</td>
  </tr>
  <tr>
  <td>Design and Layout of<em>&nbsp;Investing with Kaiser Brochure</em></td>
  <td>&euro;545</td>
  </tr>
  <tr>
  <td>Design and Layout of Tearms and Conditions Booklet</td>
  <td>&euro;300</td>
  </tr>
  <tr>
  <td>TOTAL DUE</td>
  <td>&euro;2240</td>
  </tr>
  <tr>
  <td colspan="2">Payment is due in 15 days. Requests for additional changes will incur a &euro;100 surcharge per document. For rush printing, add &euro;250. Please note that we no longer accept checks. All payments must be made by direct bank transfer or electronically through www.friendpay.com. Thank you for your cooperation.</td>
  </tr>
  </tbody>
  </table>`,
};
const passage2 = {
  type: "image",
  img: "https://www.anhngumshoa.com/uploads/images/userfiles/notice2.jpg",
};
const part1 = {
  id: "1q2312",
  ids: "1q2312",
  text: ``, // empty
  type: "part1",
  audio: "/part1-1.mp3",
  tag: "",
  img: "https://picsum.photos/400/400",
  section: "Listening", // or reading
  options: [
    { id: "A", text: "The man is sitting at a desk." },
    { id: "B", text: "The woman is typing on a computer." },
    { id: "C", text: "The people are having a meeting." },
    { id: "D", text: "The dog is running under the rain" },
  ],
  answerKey: "A",
};
const part11 = {
  id: "1q23122",
  ids: "1q23312",
  text: ``, // empty
  type: "part1",
  audio: "/part1-1.mp3",
  tag: "",
  img: "https://picsum.photos/400/400",
  section: "Listening", // or reading
  options: [
    { id: "A", text: "The man is sitting at a desk." },
    { id: "B", text: "The woman is typing on a computer." },
    { id: "C", text: "The people are having a meeting." },
    { id: "D", text: "The dog is running under the rain" },
  ],
  answerKey: "A",
};
const part2 = {
  id: "1agdasgf",
  ids: "1agdasgf",
  type: "part2",
  text: ``, //empty
  audio: "/part1-1.mp3",
  tag: "",
  img: "https://picsum.photos/400/400", //empty
  section: "Listening",
  options: [
    { id: "A", text: "Options A" },
    { id: "B", text: "Options B" },
    { id: "C", text: "Options C" },
  ],
  answerKey: "A",
};
const part21 = {
  id: "1agdadsgf",
  ids: "1agdadsgf",
  type: "part2",
  text: ``, //empty
  audio: "/part1-1.mp3",
  tag: "",
  img: "https://picsum.photos/400/400", //empty
  section: "Listening",
  options: [
    { id: "A", text: "Options A" },
    { id: "B", text: "Options B" },
    { id: "C", text: "Options C" },
  ],
  answerKey: "A",
};
const part30 = {
  id: "1agda2sgf",
  ids: "11agda2s2gf",
  type: "part3",
  text: ``, //empty
  group: "1",
  audio: "/part1-1.mp3",
  tag: "",
  img: "", //empty
  section: "Listening",
  options: [
    { id: "A", text: "Options A5" },
    { id: "B", text: "Options B4" },
    { id: "C", text: "Options C3" },
    { id: "D", text: "Options D2" },
  ],
  answerKey: "A",
};
const part31 = {
  id: "1agda22gf",
  ids: "11agda2s2gf",
  type: "part3",
  text: ``, //empty
  audio: "/part1-1.mp3",
  tag: "",
  img: "", //empty
  section: "Listening",
  options: [
    { id: "A", text: "Options A1" },
    { id: "B", text: "Options B2" },
    { id: "C", text: "Options C3" },
    { id: "D", text: "Options D4" },
  ],
  answerKey: "A",
};
const part61 = {
  id: "6123",
  ids: "61232",
  type: "part6",
  passages: [
    {
      type: "html",
      html: `<div class="game-object-question-text">
    Pizza Chef Wanted<br>
    Papa Gino’s is hiring, and all <b> (1) </b> _____ applicants will be considered. 
    <b> (2) </b> _____ Even if you have no experience, training will be provided if you meet our requirements. 
    To meet our requirements, you must have a <b> (3) </b> _____ health card, reliable transportation, 
    and be able to work evenings and weekends. 
    Please apply in person at Papa Gino’s on state and Pine, <b> (4) </b> _____ look forward to meeting you.
</div>`,
    },
  ],
  transcript: "",
  translate: "",
  group: "123",
  text: `(1)`,
  audio: "", //empty
  tag: "",
  img: "", //empty
  section: "Listening",
  options: [
    { id: "A", text: "qualify" },
    { id: "B", text: "qualifying" },
    { id: "C", text: "qualified" },
    { id: "D", text: "to qualify" },
  ],
  answerKey: "C",
};
const part62 = {
  id: "asfgg",
  ids: "61232",
  type: "part6",
  passages: [
    {
      type: "html",
      html: `<div class="game-object-question-text">
    Pizza Chef Wanted<br>
    Papa Gino’s is hiring, and all <b> (1) </b> _____ applicants will be considered. 
    <b> (2) </b> _____ Even if you have no experience, training will be provided if you meet our requirements. 
    To meet our requirements, you must have a <b> (3) </b> _____ health card, reliable transportation, 
    and be able to work evenings and weekends. 
    Please apply in person at Papa Gino’s on state and Pine, <b> (4) </b> _____ look forward to meeting you.
</div>`,
    },
  ],
  group: "123",
  text: `(2)`,
  audio: "", //empty
  tag: "",
  img: "", //empty
  section: "Listening",
  options: [
    {
      id: "A",
      text: "We are looking for candidates that have some experience in Italian food.",
    },
    {
      id: "B",
      text: "We are looking for candidates that have experience fishing",
    },
    { id: "C", text: "We are looking for people who want to practice." },
    { id: "D", text: " We are looking for people who can fish." },
  ],
  answerKey: "A",
};
const part63 = {
  id: "adsf",
  ids: "61232",
  type: "part6",
  passages: [
    {
      type: "html",
      html: `<div class="game-object-question-text">
    Pizza Chef Wanted<br>
    Papa Gino’s is hiring, and all <b> (1) </b> _____ applicants will be considered. 
    <b> (2) </b> _____ Even if you have no experience, training will be provided if you meet our requirements. 
    To meet our requirements, you must have a <b> (3) </b> _____ health card, reliable transportation, 
    and be able to work evenings and weekends. 
    Please apply in person at Papa Gino’s on state and Pine, <b> (4) </b> _____ look forward to meeting you.
</div>`,
    },
  ],
  group: "123",
  text: `(3)`,
  audio: "", //empty
  tag: "",
  img: "", //empty
  section: "Listening",
  options: [
    { id: "A", text: "Options A1" },
    { id: "B", text: "Options B2" },
    { id: "C", text: "Options C3" },
    { id: "D", text: "Options D4" },
  ],
  answerKey: "A",
};
const part71 = {
  id: "123123",
  ids: "3123",
  type: "part7",
  passages: [passage2, passage1],
  group: "123",
  text: `(3)`,
  audio: "", //empty
  tag: "",
  img: "", //empty
  section: "Listening",
  options: [
    { id: "A", text: "Options A1" },
    { id: "B", text: "Options B2" },
    { id: "C", text: "Options C3" },
    { id: "D", text: "Options D4" },
  ],
  answerKey: "A",
};
const part72 = {
  id: "ads",
  ids: "3123",
  type: "part7",
  passages: [passage2, passage1],
  group: "123",
  text: `(3)`,
  audio: "", //empty
  tag: "",
  img: "", //empty
  section: "Listening",
  options: [
    { id: "A", text: "Options A1" },
    { id: "B", text: "Options B2" },
    { id: "C", text: "Options C3" },
    { id: "D", text: "Options D4" },
  ],
  answerKey: "A",
};
const part73 = {
  id: "bnsg",
  ids: "3123",
  type: "part7",
  passages: [passage2, passage1],
  group: "123",
  text: `(3)`,
  audio: "", //empty
  tag: "",
  img: "", //empty
  section: "Listening",
  options: [
    { id: "A", text: "Options A1" },
    { id: "B", text: "Options B2" },
    { id: "C", text: "Options C3" },
    { id: "D", text: "Options D4" },
  ],
  answerKey: "A",
};
const part74 = {
  id: "bns123g",
  ids: "ascas",
  type: "part7",
  passages: [passage_0, passage_1],
  group: "123",
  text: `(3)`,
  audio: "", //empty
  tag: "",
  img: "", //empty
  section: "Listening",
  options: [
    { id: "A", text: "Options A1" },
    { id: "B", text: "Options B2" },
    { id: "C", text: "Options C3" },
    { id: "D", text: "Options D4" },
  ],
  answerKey: "A",
};
const passage3 = {
  type: "html",
  html: "",
  translate: "",
};

export const questions = [
  part1,
  part11,
  part2,
  part21,

  part30,
  part31,
  part61,
  part62,
  part63,
  part71,
  part72,
  part73,
  part74,
];
