export type Emotion = "happy" | "sad" | "angry" | "disgusted" | "surprised" | "neutral";
export type HeadGesture = "nod" | "shake";

export type ActionType = "take" | "chop" | "pack" | "weigh" | "bag";

export interface DialogLine {
  speaker: "customer" | "mom" | "narrator";
  text: string;
  requiredEmotion?: Emotion;
  holdDuration?: number;
  action?: ActionType;
  /** For action lines, list of wrong options to show alongside the correct one */
  wrongActions?: ActionType[];
  headGesture?: HeadGesture;
}

export interface ConversationSequence {
  id: string;
  difficulty: "easy" | "medium" | "hard" | "extreme";
  /** Tags for matching to character temperaments */
  tags: string[];
  lines: DialogLine[];
}

export interface CustomerData {
  id: string;
  name: string;
  sprite: string;
  difficulty: number;
  description: string;
  temperament: "friendly" | "neutral" | "impatient" | "demanding" | "chatty";
  ageGroup: "child" | "teen" | "adult" | "elder";
  gender: "male" | "female";
  greetings: string[];
  farewells: string[];
}

export interface LevelData {
  level: number;
  customerId: string;
  sequenceCount: number;
  holdDurationMultiplier: number;
  description: string;
}

// 18 total characters
export const CUSTOMERS: CustomerData[] = [
  // ===== EASY (difficulty 1) =====
  {
    id: "lola",
    name: "Lola Meding",
    sprite: "/customers/customer-lola.png",
    difficulty: 1,
    description: "A sweet grandmother who just wants her usual items.",
    temperament: "friendly",
    ageGroup: "elder",
    gender: "female",
    greetings: ["Anak, kamusta ka?", "Hello po, bata!", "Ay, ikaw pala ang bantay ngayon!"],
    farewells: ["Salamat, anak!", "God bless you, ha!", "Ingat ka dyan!"],
  },
  {
    id: "kid",
    name: "Little Mia",
    sprite: "/customers/customer-kid.png",
    difficulty: 1,
    description: "A shy little girl buying snacks with her coins.",
    temperament: "friendly",
    ageGroup: "child",
    gender: "female",
    greetings: ["U-um... kuya...", "May candy po ba kayo?", "Pabili po..."],
    farewells: ["Thank you po kuya!", "Salamat!", "Bye-bye po!"],
  },
  {
    id: "mang_pedro",
    name: "Mang Pedro",
    sprite: "/customers/customer-lolo.png",
    difficulty: 1,
    description: "A gentle old fisherman buying supplies for the day.",
    temperament: "friendly",
    ageGroup: "elder",
    gender: "male",
    greetings: ["Magandang umaga, anak.", "Uy, nandito ka pala.", "Kumusta ang nanay mo?"],
    farewells: ["Salamat ha, anak.", "Sige, babalik ako.", "Ingat ka!"],
  },
  // ===== EASY-MEDIUM (difficulty 2) =====
  {
    id: "student",
    name: "Miguel",
    sprite: "/customers/customer-student.png",
    difficulty: 2,
    description: "A college student in a rush between classes.",
    temperament: "neutral",
    ageGroup: "teen",
    gender: "male",
    greetings: ["Yo! Pabili!", "Boss, mabilis lang!", "Pre, may load ka ba?"],
    farewells: ["Thanks pre!", "Sige, una na ko!", "Salamat boss!"],
  },
  {
    id: "worker",
    name: "Mang Tonyo",
    sprite: "/customers/customer-worker.png",
    difficulty: 2,
    description: "A construction worker on his lunch break.",
    temperament: "neutral",
    ageGroup: "adult",
    gender: "male",
    greetings: ["Uy, pabili nga.", "Bata, nandyan ba nanay mo?", "Ano meryenda mo jan?"],
    farewells: ["Sige, balik ako mamaya.", "Salamat ha.", "Aalis na ko, maraming trabaho pa."],
  },
  {
    id: "ate_joy",
    name: "Ate Joy",
    sprite: "/customers/customer-pregnant.png",
    difficulty: 2,
    description: "A friendly young mother doing her daily shopping.",
    temperament: "friendly",
    ageGroup: "adult",
    gender: "female",
    greetings: ["Kuya, pabili naman.", "Hello! Nandito na ko ulit.", "Kumusta naman dyan?"],
    farewells: ["Thank you ha!", "Salamat, kuya!", "See you bukas!"],
  },
  // ===== MEDIUM (difficulty 3) =====
  {
    id: "tita",
    name: "Tita Baby",
    sprite: "/customers/customer-tita.png",
    difficulty: 3,
    description: "The neighborhood gossip queen who takes forever.",
    temperament: "chatty",
    ageGroup: "adult",
    gender: "female",
    greetings: ["Ay nako, alam mo ba yung nangyari?!", "Hala siya, ikaw na pala bantay!", "Anak, ang laki mo na!"],
    farewells: ["Sige, chika na lang tayo ulit!", "Ay nako, umalis na ko bago mag-traffic!", "Bye anak! Kumain ka na ba?"],
  },
  {
    id: "lolo",
    name: "Lolo Bert",
    sprite: "/customers/customer-lolo.png",
    difficulty: 3,
    description: "A patient old man who tells long stories.",
    temperament: "chatty",
    ageGroup: "elder",
    gender: "male",
    greetings: ["Noong araw kasi...", "Anak, mabuti at nandito ka.", "Kumusta ang pag-aaral mo?"],
    farewells: ["Sa uulitin, anak.", "Mag-aral ka mabuti ha.", "Ingat lagi."],
  },
  {
    id: "nanay_linda",
    name: "Nanay Linda",
    sprite: "/customers/customer-tita.png",
    difficulty: 3,
    description: "A strict but caring mother buying groceries.",
    temperament: "neutral",
    ageGroup: "adult",
    gender: "female",
    greetings: ["Anak, seryosohin mo ang pag-bantay ha.", "Nandito nanay mo?", "Pabili nga."],
    farewells: ["Salamat anak, masipag ka ha.", "Sige, tutulungan kita sa math mamaya.", "Ingat."],
  },
  // ===== HARD (difficulty 4) =====
  {
    id: "rider",
    name: "Kuya Flash",
    sprite: "/customers/customer-rider.png",
    difficulty: 4,
    description: "An impatient delivery rider always in a hurry.",
    temperament: "impatient",
    ageGroup: "adult",
    gender: "male",
    greetings: ["PABILI! Dali dali!", "Boss bilisan mo!", "Walang oras pre!"],
    farewells: ["Sige go na!", "Tenks!", "G na!"],
  },
  {
    id: "teen",
    name: "Jayson",
    sprite: "/customers/customer-teen.png",
    difficulty: 4,
    description: "A moody teenager who doesn't want to be here.",
    temperament: "neutral",
    ageGroup: "teen",
    gender: "male",
    greetings: ["*sigh* ...pabili.", "Whatever, pabili na lang.", "Pinapabili ako ni mama..."],
    farewells: ["K.", "Sige.", "*walks away silently*"],
  },
  {
    id: "kuya_mark",
    name: "Kuya Mark",
    sprite: "/customers/customer-rider.png",
    difficulty: 4,
    description: "A gym bro who needs everything weighed precisely.",
    temperament: "demanding",
    ageGroup: "adult",
    gender: "male",
    greetings: ["Bro, kailangan ko exact weight ha.", "Pre, may weighing scale ba kayo?", "Yo, pabili!"],
    farewells: ["Nice bro, salamat!", "Sige bro, gains!", "Thanks pare!"],
  },
  // ===== VERY HARD (difficulty 5) =====
  {
    id: "businessman",
    name: "Sir Reginald",
    sprite: "/customers/customer-businessman.png",
    difficulty: 5,
    description: "A demanding businessman who expects premium service.",
    temperament: "demanding",
    ageGroup: "adult",
    gender: "male",
    greetings: ["I need this done quickly and correctly.", "Where's the manager?", "Do you even know what you're doing?"],
    farewells: ["Acceptable.", "I suppose that will do.", "Finally."],
  },
  {
    id: "pregnant",
    name: "Ate Rina",
    sprite: "/customers/customer-pregnant.png",
    difficulty: 5,
    description: "A pregnant woman with very specific cravings.",
    temperament: "chatty",
    ageGroup: "adult",
    gender: "female",
    greetings: ["Kuya, may ganito ba kayo?", "Ang init naman...", "Pabili, pero specific ha."],
    farewells: ["Salamat kuya, ang bait mo!", "Thank you ha!", "Sana all ganyan ka-patient!"],
  },
  {
    id: "prof_garcia",
    name: "Prof. Garcia",
    sprite: "/customers/customer-businessman.png",
    difficulty: 5,
    description: "A strict professor who quizzes you on everything.",
    temperament: "demanding",
    ageGroup: "adult",
    gender: "male",
    greetings: ["Good afternoon. I have a few questions.", "So, you're the one running the store?", "Let's see if you're competent."],
    farewells: ["Hmm, passable.", "You could do better.", "Not bad... for a kid."],
  },
  // ===== EXTREME (difficulty 6) =====
  {
    id: "tita_cora",
    name: "Tita Cora",
    sprite: "/customers/customer-tita.png",
    difficulty: 6,
    description: "The ultimate Karen who complains about everything.",
    temperament: "demanding",
    ageGroup: "adult",
    gender: "female",
    greetings: ["ANO BA YAN?!", "Bat ang tagal?!", "Nasaan nanay mo? Ikaw na lang ba?!"],
    farewells: ["Hmph, finally!", "Sasabihin ko sa nanay mo ha!", "Hay nako talaga..."],
  },
  {
    id: "mayor",
    name: "Mayor Santos",
    sprite: "/customers/customer-businessman.png",
    difficulty: 6,
    description: "The town mayor who expects VIP treatment.",
    temperament: "demanding",
    ageGroup: "elder",
    gender: "male",
    greetings: ["Do you know who I am?", "I expect the best service.", "Where's your mother? I'll wait."],
    farewells: ["Hmph, you'll hear from me.", "Tell your mother I dropped by.", "This store needs improvement."],
  },
  {
    id: "influencer",
    name: "Ate Vlogger",
    sprite: "/customers/customer-teen.png",
    difficulty: 6,
    description: "A social media influencer filming everything for content.",
    temperament: "chatty",
    ageGroup: "teen",
    gender: "female",
    greetings: ["OMG guys look at this cute sari-sari store!", "Wait let me vlog this — hi kuya!", "Content na to! Pabili!"],
    farewells: ["Thanks for the content kuya!", "Subscribe to my channel!", "Viral na to!"],
  },
];

export const ITEMS = [
  "Yelo (Ice)", "Mantika (Cooking Oil)", "Bigas (Rice)", "Asin (Salt)",
  "Asukal (Sugar)", "Kape (Coffee)", "Gatas (Milk)", "Itlog (Eggs)",
  "Sardinas (Sardines)", "Lucky Me Noodles", "Skyflakes", "Boy Bawang",
  "Chicharon", "Banana Cue", "Tubig (Water)", "Soft Drinks",
  "Shampoo Sachet", "Sabon (Soap)", "Toyo (Soy Sauce)", "Suka (Vinegar)",
];

export const CONVERSATION_SEQUENCES: ConversationSequence[] = [
  // ===== EASY =====
  {
    id: "easy_1",
    difficulty: "easy",
    tags: ["friendly", "elder", "child"],
    lines: [
      { speaker: "customer", text: "Hello! Kamusta ka naman?" },
      { speaker: "narrator", text: "The customer is smiling. Smile back!", requiredEmotion: "happy", holdDuration: 3 },
      { speaker: "customer", text: "Pabili nga ng isang Lucky Me." },
      { speaker: "narrator", text: "Take the item from the shelf.", action: "take", wrongActions: ["chop", "weigh"] },
      { speaker: "customer", text: "Salamat anak!" },
      { speaker: "narrator", text: "Give a friendly smile as they leave.", requiredEmotion: "happy", holdDuration: 2 },
    ],
  },
  {
    id: "easy_2",
    difficulty: "easy",
    tags: ["friendly", "elder"],
    lines: [
      { speaker: "customer", text: "Uy, bata! Pabili!" },
      { speaker: "narrator", text: "Look friendly and neutral.", requiredEmotion: "neutral", holdDuration: 3 },
      { speaker: "customer", text: "Bigyan mo ko ng dalawang itlog." },
      { speaker: "narrator", text: "Carefully take the eggs.", action: "take", wrongActions: ["chop", "bag"] },
      { speaker: "narrator", text: "Pack them gently.", action: "pack", wrongActions: ["chop", "weigh"] },
      { speaker: "customer", text: "Ang bait mo naman!" },
    ],
  },
  {
    id: "easy_3",
    difficulty: "easy",
    tags: ["friendly", "child"],
    lines: [
      { speaker: "customer", text: "Nandito ba nanay mo?" },
      { speaker: "narrator", text: "Stay calm and neutral.", requiredEmotion: "neutral", holdDuration: 2.5 },
      { speaker: "customer", text: "Ah sige, pabili na lang ng tubig." },
      { speaker: "narrator", text: "Grab the water bottle.", action: "take", wrongActions: ["weigh", "chop"] },
      { speaker: "customer", text: "Thank you!" },
    ],
  },
  {
    id: "easy_4",
    difficulty: "easy",
    tags: ["friendly", "adult"],
    lines: [
      { speaker: "customer", text: "Ang cute mo naman! First time mo ba dito?" },
      { speaker: "narrator", text: "Smile shyly.", requiredEmotion: "happy", holdDuration: 3 },
      { speaker: "customer", text: "Pabili ng shampoo sachet." },
      { speaker: "narrator", text: "Take the sachet from the display.", action: "take", wrongActions: ["chop", "weigh"] },
      { speaker: "narrator", text: "Put it in a small bag.", action: "bag", wrongActions: ["chop", "pack"] },
      { speaker: "customer", text: "Salamat!" },
    ],
  },
  {
    id: "easy_5",
    difficulty: "easy",
    tags: ["friendly", "neutral"],
    lines: [
      { speaker: "customer", text: "Pssst! Pabili!" },
      { speaker: "narrator", text: "Stay attentive with a neutral face.", requiredEmotion: "neutral", holdDuration: 3 },
      { speaker: "customer", text: "Isang soft drinks nga." },
      { speaker: "narrator", text: "Grab the drink.", action: "take", wrongActions: ["chop", "weigh"] },
      { speaker: "customer", text: "Keep the change!" },
      { speaker: "narrator", text: "Smile thankfully!", requiredEmotion: "happy", holdDuration: 2 },
    ],
  },
  {
    id: "easy_6",
    difficulty: "easy",
    tags: ["friendly", "elder"],
    lines: [
      { speaker: "customer", text: "Anak, may bigas pa ba kayo?" },
      { speaker: "narrator", text: "Nod yes to the customer.", headGesture: "nod" },
      { speaker: "customer", text: "Ah mabuti naman. Isang kilo nga." },
      { speaker: "narrator", text: "Weigh the rice.", action: "weigh", wrongActions: ["chop", "take"] },
      { speaker: "narrator", text: "Bag the rice.", action: "bag", wrongActions: ["chop", "pack"] },
      { speaker: "customer", text: "Salamat, anak!" },
      { speaker: "narrator", text: "Smile warmly.", requiredEmotion: "happy", holdDuration: 2 },
    ],
  },
  // ===== MEDIUM =====
  {
    id: "med_1",
    difficulty: "medium",
    tags: ["neutral", "chatty", "adult"],
    lines: [
      { speaker: "customer", text: "Hay nako, ang init! Pabili nga..." },
      { speaker: "narrator", text: "Show concern on your face.", requiredEmotion: "sad", holdDuration: 3 },
      { speaker: "customer", text: "Ah salamat, napansin mo. Pabili ng yelo." },
      { speaker: "narrator", text: "Chop the ice block.", action: "chop", wrongActions: ["take", "bag"] },
      { speaker: "narrator", text: "Pack it quickly before it melts!", action: "pack", wrongActions: ["weigh", "chop"] },
      { speaker: "customer", text: "Hmmm, mukhang maliit yata to..." },
      { speaker: "narrator", text: "Look surprised — show them it's the right size!", requiredEmotion: "surprised", holdDuration: 3 },
      { speaker: "customer", text: "Ah sige, okay na pala. Salamat!" },
    ],
  },
  {
    id: "med_2",
    difficulty: "medium",
    tags: ["chatty", "elder"],
    lines: [
      { speaker: "customer", text: "Alam mo ba anak, noong araw..." },
      { speaker: "narrator", text: "Look interested! Show a surprised/curious face.", requiredEmotion: "surprised", holdDuration: 4 },
      { speaker: "customer", text: "...ang mura pa ng bigas noon! Pabili nga." },
      { speaker: "narrator", text: "Weigh the rice.", action: "weigh", wrongActions: ["chop", "take"] },
      { speaker: "narrator", text: "Pack it in a bag.", action: "bag", wrongActions: ["chop", "weigh"] },
      { speaker: "customer", text: "Ang mahal na talaga..." },
      { speaker: "narrator", text: "Look sympathetic — show a sad face.", requiredEmotion: "sad", holdDuration: 3 },
      { speaker: "customer", text: "Pero ganyan talaga buhay. Salamat anak." },
    ],
  },
  {
    id: "med_3",
    difficulty: "medium",
    tags: ["impatient", "adult"],
    lines: [
      { speaker: "customer", text: "DALI DALI! May delivery pa ko!" },
      { speaker: "narrator", text: "Stay neutral and professional — don't look scared!", requiredEmotion: "neutral", holdDuration: 3 },
      { speaker: "customer", text: "Tatlong softdrinks at dalawang Lucky Me!" },
      { speaker: "narrator", text: "Grab the drinks!", action: "take", wrongActions: ["chop", "weigh"] },
      { speaker: "narrator", text: "Grab the noodles!", action: "take", wrongActions: ["chop", "bag"] },
      { speaker: "narrator", text: "Bag them all up!", action: "bag", wrongActions: ["weigh", "chop"] },
      { speaker: "customer", text: "Sige go! Thanks!" },
      { speaker: "narrator", text: "Smile and wave goodbye!", requiredEmotion: "happy", holdDuration: 2 },
    ],
  },
  {
    id: "med_4",
    difficulty: "medium",
    tags: ["neutral", "teen"],
    lines: [
      { speaker: "customer", text: "*sigh* Pinapabili ako ni mama..." },
      { speaker: "narrator", text: "Show a neutral understanding face.", requiredEmotion: "neutral", holdDuration: 3 },
      { speaker: "customer", text: "Toyo, suka, at mantika." },
      { speaker: "narrator", text: "Take the soy sauce.", action: "take", wrongActions: ["chop", "weigh"] },
      { speaker: "narrator", text: "Take the vinegar.", action: "take", wrongActions: ["chop", "bag"] },
      { speaker: "narrator", text: "Take the cooking oil.", action: "take", wrongActions: ["weigh", "chop"] },
      { speaker: "narrator", text: "Pack everything carefully.", action: "pack", wrongActions: ["chop", "weigh"] },
      { speaker: "customer", text: "...thanks I guess." },
    ],
  },
  {
    id: "med_5",
    difficulty: "medium",
    tags: ["chatty", "adult"],
    lines: [
      { speaker: "customer", text: "AY NAKO! Alam mo ba ang nangyari kay Aling Nena?!" },
      { speaker: "narrator", text: "Look surprised — she wants a reaction!", requiredEmotion: "surprised", holdDuration: 3 },
      { speaker: "customer", text: "...Nakita ko kasi kanina sa palengke..." },
      { speaker: "narrator", text: "Keep looking interested!", requiredEmotion: "surprised", holdDuration: 3 },
      { speaker: "customer", text: "Anyway! Pabili ng kape at gatas." },
      { speaker: "narrator", text: "Take the coffee.", action: "take", wrongActions: ["chop", "weigh"] },
      { speaker: "narrator", text: "Take the milk.", action: "take", wrongActions: ["chop", "bag"] },
      { speaker: "customer", text: "Sige, kwento ko sa'yo next time!" },
      { speaker: "narrator", text: "Smile and nod!", requiredEmotion: "happy", holdDuration: 2 },
    ],
  },
  {
    id: "med_6",
    difficulty: "medium",
    tags: ["neutral", "adult"],
    lines: [
      { speaker: "customer", text: "Pre, may protein bar ba kayo dyan?" },
      { speaker: "narrator", text: "Shake your head no.", headGesture: "shake" },
      { speaker: "customer", text: "Ah sayang. Boy Bawang na lang at itlog." },
      { speaker: "narrator", text: "Take the snack.", action: "take", wrongActions: ["chop", "weigh"] },
      { speaker: "narrator", text: "Take the eggs.", action: "take", wrongActions: ["chop", "bag"] },
      { speaker: "customer", text: "Exact ba timbang nyan?" },
      { speaker: "narrator", text: "Nod confidently.", headGesture: "nod" },
      { speaker: "narrator", text: "Pack them.", action: "pack", wrongActions: ["chop", "weigh"] },
      { speaker: "customer", text: "Nice, salamat bro!" },
    ],
  },
  // ===== HARD =====
  {
    id: "hard_1",
    difficulty: "hard",
    tags: ["demanding", "adult"],
    lines: [
      { speaker: "customer", text: "Where's the manager? I need to speak with them." },
      { speaker: "narrator", text: "Stay calm. Keep a neutral professional face.", requiredEmotion: "neutral", holdDuration: 4 },
      { speaker: "customer", text: "You're just a kid. Can you even handle this?" },
      { speaker: "narrator", text: "Don't get angry! Stay neutral!", requiredEmotion: "neutral", holdDuration: 4 },
      { speaker: "customer", text: "Fine. Get me sardines. The GOOD ones." },
      { speaker: "narrator", text: "Take the best sardines.", action: "take", wrongActions: ["chop", "weigh", "bag"] },
      { speaker: "customer", text: "Hmm. And rice. One kilo, weighed properly." },
      { speaker: "narrator", text: "Weigh the rice carefully.", action: "weigh", wrongActions: ["take", "chop", "bag"] },
      { speaker: "narrator", text: "Pack it neatly.", action: "pack", wrongActions: ["chop", "weigh", "bag"] },
      { speaker: "customer", text: "I suppose that's... acceptable." },
      { speaker: "narrator", text: "Smile politely!", requiredEmotion: "happy", holdDuration: 3 },
    ],
  },
  {
    id: "hard_2",
    difficulty: "hard",
    tags: ["chatty", "adult", "friendly"],
    lines: [
      { speaker: "customer", text: "Kuya, I really really want banana cue..." },
      { speaker: "narrator", text: "Smile warmly at her.", requiredEmotion: "happy", holdDuration: 3 },
      { speaker: "customer", text: "Wait, actually I want chicharon instead." },
      { speaker: "narrator", text: "Stay patient — don't look annoyed!", requiredEmotion: "neutral", holdDuration: 3 },
      { speaker: "customer", text: "Hmm, actually... do you have both?" },
      { speaker: "narrator", text: "Nod yes!", headGesture: "nod" },
      { speaker: "customer", text: "YES! Both please!" },
      { speaker: "narrator", text: "Take the banana cue.", action: "take", wrongActions: ["chop", "weigh", "bag"] },
      { speaker: "narrator", text: "Take the chicharon.", action: "take", wrongActions: ["chop", "weigh", "pack"] },
      { speaker: "narrator", text: "Pack both items.", action: "pack", wrongActions: ["chop", "weigh", "bag"] },
      { speaker: "customer", text: "YAY! Thank you so much kuya!" },
      { speaker: "narrator", text: "Smile back happily!", requiredEmotion: "happy", holdDuration: 2 },
    ],
  },
  {
    id: "hard_3",
    difficulty: "hard",
    tags: ["demanding", "adult"],
    lines: [
      { speaker: "customer", text: "ANO BA YAN? Ang tagal ko nang naghihintay!" },
      { speaker: "narrator", text: "Show sympathy — look sad/sorry.", requiredEmotion: "sad", holdDuration: 4 },
      { speaker: "customer", text: "Hmph! Pabili ng asin, asukal, at mantika." },
      { speaker: "narrator", text: "Take the salt.", action: "take", wrongActions: ["chop", "weigh", "bag"] },
      { speaker: "narrator", text: "Take the sugar.", action: "take", wrongActions: ["chop", "weigh", "pack"] },
      { speaker: "narrator", text: "Take the cooking oil.", action: "take", wrongActions: ["chop", "bag", "pack"] },
      { speaker: "customer", text: "Tama ba yang timbang?!" },
      { speaker: "narrator", text: "Weigh it to show her.", action: "weigh", wrongActions: ["take", "chop", "bag"] },
      { speaker: "narrator", text: "Stay calm and neutral!", requiredEmotion: "neutral", holdDuration: 3 },
      { speaker: "customer", text: "Sige na nga. Pack mo na." },
      { speaker: "narrator", text: "Pack everything.", action: "pack", wrongActions: ["chop", "weigh", "take"] },
      { speaker: "narrator", text: "Put it all in a bag.", action: "bag", wrongActions: ["chop", "weigh", "take"] },
      { speaker: "customer", text: "Hmph!" },
      { speaker: "narrator", text: "Smile politely as she leaves.", requiredEmotion: "happy", holdDuration: 2 },
    ],
  },
  {
    id: "hard_4",
    difficulty: "hard",
    tags: ["friendly", "adult"],
    lines: [
      { speaker: "customer", text: "Kuya... ang sakit ng paa ko." },
      { speaker: "narrator", text: "Look concerned — show a sad face.", requiredEmotion: "sad", holdDuration: 3 },
      { speaker: "customer", text: "Pabili nga ng tubig, at yung malamig ha." },
      { speaker: "narrator", text: "Take the cold water.", action: "take", wrongActions: ["chop", "weigh", "bag"] },
      { speaker: "customer", text: "Kumusta ka naman sa school? Okay ba grades mo?" },
      { speaker: "narrator", text: "Look surprised by the question!", requiredEmotion: "surprised", holdDuration: 3 },
      { speaker: "customer", text: "May Skyflakes din ba kayo?" },
      { speaker: "narrator", text: "Nod yes.", headGesture: "nod" },
      { speaker: "narrator", text: "Take the Skyflakes.", action: "take", wrongActions: ["chop", "weigh", "bag"] },
      { speaker: "narrator", text: "Pack everything carefully.", action: "pack", wrongActions: ["chop", "weigh", "take"] },
      { speaker: "narrator", text: "Put it all in a sturdy bag.", action: "bag", wrongActions: ["chop", "weigh", "take"] },
      { speaker: "customer", text: "Ang sweet mo naman kuya. Salamat ha!" },
      { speaker: "narrator", text: "Smile happily!", requiredEmotion: "happy", holdDuration: 2 },
    ],
  },
  {
    id: "hard_5",
    difficulty: "hard",
    tags: ["chatty", "elder"],
    lines: [
      { speaker: "customer", text: "Anak, pakinggan mo muna to ha..." },
      { speaker: "narrator", text: "Look curious — raise your eyebrows!", requiredEmotion: "surprised", holdDuration: 3 },
      { speaker: "customer", text: "Noong bata pa ko, wala kaming ganito..." },
      { speaker: "narrator", text: "Look sad and empathetic.", requiredEmotion: "sad", holdDuration: 4 },
      { speaker: "customer", text: "Pero okay lang! Masaya naman kami noon." },
      { speaker: "narrator", text: "Smile to show you understand.", requiredEmotion: "happy", holdDuration: 3 },
      { speaker: "customer", text: "Pabili ng kape, dalawang sachet." },
      { speaker: "narrator", text: "Take the coffee sachets.", action: "take", wrongActions: ["chop", "weigh", "bag"] },
      { speaker: "customer", text: "At yung Boy Bawang, pampulutan ko mamaya." },
      { speaker: "narrator", text: "Take the Boy Bawang.", action: "take", wrongActions: ["chop", "weigh", "pack"] },
      { speaker: "narrator", text: "Bag everything.", action: "bag", wrongActions: ["chop", "weigh", "take"] },
      { speaker: "customer", text: "Mag-aral ka mabuti ha, anak." },
      { speaker: "narrator", text: "Smile and nod respectfully.", requiredEmotion: "happy", holdDuration: 2 },
    ],
  },
  // ===== EXTREME =====
  {
    id: "extreme_1",
    difficulty: "extreme",
    tags: ["demanding", "adult"],
    lines: [
      { speaker: "customer", text: "OMG guys, look at this cute little store!" },
      { speaker: "narrator", text: "Smile for the camera!", requiredEmotion: "happy", holdDuration: 4 },
      { speaker: "customer", text: "Wait — can you look surprised for the thumbnail?" },
      { speaker: "narrator", text: "Make a surprised face!", requiredEmotion: "surprised", holdDuration: 4 },
      { speaker: "customer", text: "Now look sad like I'm leaving forever!" },
      { speaker: "narrator", text: "Make a sad face for the video.", requiredEmotion: "sad", holdDuration: 3 },
      { speaker: "customer", text: "HAHA ok ok — pabili na lang ng Boy Bawang and Chicharon!" },
      { speaker: "narrator", text: "Take the Boy Bawang.", action: "take", wrongActions: ["chop", "weigh", "bag"] },
      { speaker: "narrator", text: "Take the Chicharon.", action: "take", wrongActions: ["chop", "weigh", "pack"] },
      { speaker: "customer", text: "Wait is that even fresh? Look disgusted and sniff it!" },
      { speaker: "narrator", text: "Make a disgusted face.", requiredEmotion: "disgusted", holdDuration: 3 },
      { speaker: "customer", text: "LOL just kidding! Pack it all!" },
      { speaker: "narrator", text: "Pack everything.", action: "pack", wrongActions: ["chop", "weigh", "take"] },
      { speaker: "narrator", text: "Bag it.", action: "bag", wrongActions: ["chop", "weigh", "take"] },
      { speaker: "customer", text: "Subscribe to my channel! Bye!" },
      { speaker: "narrator", text: "Smile and wave for the outro!", requiredEmotion: "happy", holdDuration: 3 },
    ],
  },
  {
    id: "extreme_2",
    difficulty: "extreme",
    tags: ["demanding", "elder"],
    lines: [
      { speaker: "customer", text: "Do you know who I am, young man?" },
      { speaker: "narrator", text: "Stay neutral and respectful.", requiredEmotion: "neutral", holdDuration: 4 },
      { speaker: "customer", text: "I want the BEST rice you have. Weigh it perfectly." },
      { speaker: "narrator", text: "Weigh the rice.", action: "weigh", wrongActions: ["take", "chop", "bag"] },
      { speaker: "customer", text: "Is that accurate? Show me the scale." },
      { speaker: "narrator", text: "Look confident — stay neutral!", requiredEmotion: "neutral", holdDuration: 3 },
      { speaker: "customer", text: "And sardines. Premium." },
      { speaker: "narrator", text: "Take the sardines.", action: "take", wrongActions: ["chop", "weigh", "bag"] },
      { speaker: "customer", text: "Your school grades — are they good?" },
      { speaker: "narrator", text: "Nod yes confidently!", headGesture: "nod" },
      { speaker: "customer", text: "Hmph. Pack it. Don't crush anything." },
      { speaker: "narrator", text: "Pack carefully.", action: "pack", wrongActions: ["chop", "weigh", "take"] },
      { speaker: "narrator", text: "Double bag it.", action: "bag", wrongActions: ["chop", "weigh", "take"] },
      { speaker: "customer", text: "Acceptable. Barely." },
      { speaker: "narrator", text: "Smile politely!", requiredEmotion: "happy", holdDuration: 2 },
    ],
  },
  {
    id: "extreme_3",
    difficulty: "extreme",
    tags: ["demanding", "adult"],
    lines: [
      { speaker: "customer", text: "Pop quiz! What's 12 × 13?" },
      { speaker: "narrator", text: "Look surprised!", requiredEmotion: "surprised", holdDuration: 3 },
      { speaker: "customer", text: "Just kidding. But you should know that — 156." },
      { speaker: "narrator", text: "Smile nervously.", requiredEmotion: "happy", holdDuration: 3 },
      { speaker: "customer", text: "I need exactly 500g of sugar. Can you weigh it?" },
      { speaker: "narrator", text: "Weigh the sugar.", action: "weigh", wrongActions: ["take", "chop", "bag"] },
      { speaker: "customer", text: "And salt. Not too much. Moderation is key." },
      { speaker: "narrator", text: "Take the salt.", action: "take", wrongActions: ["chop", "weigh", "bag"] },
      { speaker: "customer", text: "Do you study every day?" },
      { speaker: "narrator", text: "Nod yes.", headGesture: "nod" },
      { speaker: "customer", text: "Good. Education is important." },
      { speaker: "narrator", text: "Look neutral and attentive.", requiredEmotion: "neutral", holdDuration: 3 },
      { speaker: "narrator", text: "Pack everything.", action: "pack", wrongActions: ["chop", "weigh", "take"] },
      { speaker: "narrator", text: "Bag it.", action: "bag", wrongActions: ["chop", "weigh", "take"] },
      { speaker: "customer", text: "Not bad. B+ for effort." },
      { speaker: "narrator", text: "Smile respectfully.", requiredEmotion: "happy", holdDuration: 2 },
    ],
  },
];

// 6 levels, but customer is randomly selected from pool by difficulty
export const LEVELS: LevelData[] = [
  { level: 1, customerId: "auto", sequenceCount: 1, holdDurationMultiplier: 1.0, description: "Your First Customer — Take it Easy!" },
  { level: 2, customerId: "auto", sequenceCount: 1, holdDurationMultiplier: 1.0, description: "Getting the Hang of It" },
  { level: 3, customerId: "auto", sequenceCount: 2, holdDurationMultiplier: 1.2, description: "The Chatty Ones" },
  { level: 4, customerId: "auto", sequenceCount: 2, holdDurationMultiplier: 1.3, description: "Speed Service!" },
  { level: 5, customerId: "auto", sequenceCount: 2, holdDurationMultiplier: 1.5, description: "The Demanding Ones" },
  { level: 6, customerId: "auto", sequenceCount: 3, holdDurationMultiplier: 1.8, description: "The Ultimate Challenge" },
];

export const MOM_REACTIONS = {
  fail: [
    "Ay nako anak! Ano ba yang mukha mo?!",
    "Anak, hindi ganyan ang service face!",
    "Hay... pasensya na po sa anak ko.",
    "Anak! Mag-practice ka pa!",
    "Ayyy... sorry po ha, bata pa kasi.",
  ],
  wrongAction: [
    "Anak! Mali yan! Be more careful!",
    "Hay nako, hindi ganyan!",
    "Anak, mag-focus ka naman!",
  ],
  success: [
    "Ay ang galing ng anak ko!",
    "Ayan! Ganyan dapat!",
    "Very good anak!",
    "Nakita mo? Kaya mo naman pala!",
    "Proud si mama sa'yo!",
  ],
  gameOver: [
    "Anak... sige, magpahinga ka muna ha. Practice pa tayo.",
    "Hay nako... bukas na lang ulit. Mag-practice ka pa.",
  ],
  victory: [
    "ANG GALING NG ANAK KO! Sari-sari store champion!",
    "Anak, proud na proud si mama! Ikaw na ang best helper!",
  ],
};

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Pick a customer by difficulty range for a given level */
export function getCustomerForLevel(level: number, usedIds: string[]): CustomerData {
  let difficultyRange: [number, number];
  if (level === 1) difficultyRange = [1, 1];
  else if (level === 2) difficultyRange = [1, 2];
  else if (level === 3) difficultyRange = [2, 3];
  else if (level === 4) difficultyRange = [3, 4];
  else if (level === 5) difficultyRange = [4, 5];
  else difficultyRange = [5, 6];

  const pool = CUSTOMERS.filter(
    c => c.difficulty >= difficultyRange[0] && c.difficulty <= difficultyRange[1] && !usedIds.includes(c.id)
  );

  if (pool.length === 0) {
    // Fallback: allow reuse
    const fallback = CUSTOMERS.filter(
      c => c.difficulty >= difficultyRange[0] && c.difficulty <= difficultyRange[1]
    );
    return pickRandom(fallback);
  }
  return pickRandom(pool);
}

export function getSequencesForLevel(level: LevelData, customer: CustomerData): ConversationSequence[] {
  let diffFilter: string[];
  if (customer.difficulty <= 2) diffFilter = ["easy"];
  else if (customer.difficulty <= 4) diffFilter = ["medium"];
  else diffFilter = ["hard", "extreme"];

  // Prefer sequences that match customer tags (temperament or age group)
  const tagged = CONVERSATION_SEQUENCES.filter(
    s => diffFilter.includes(s.difficulty) && s.tags.some(t => t === customer.temperament || t === customer.ageGroup)
  );

  // If we don't have enough tagged sequences, add more from the difficulty pool
  const pool = tagged.length >= level.sequenceCount
    ? tagged
    : [
        ...tagged,
        ...CONVERSATION_SEQUENCES.filter(s => diffFilter.includes(s.difficulty) && !tagged.includes(s))
      ];

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.max(1, level.sequenceCount)); // Ensure at least 1 sequence
}
