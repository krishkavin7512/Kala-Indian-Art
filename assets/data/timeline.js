/* Kāla — timeline content. Eras → artifacts.
   img: file stem in assets/img/t/ (full: <id>.jpg, card: <id>-sm.jpg)
   sketchfab: optional museum 3D scan (embedded, needs internet). */
window.KALA_TIMELINE = {
  eras: [
    {
      id: "indus", num: "I", name: "The Indus Cities", native: "सिन्धु", span: "c. 3300 – 1300 BCE", start: -3300, end: -1300,
      intro: "On the floodplains of the Indus and the Ghaggar-Hakra rose planned cities of baked brick — Harappa, Mohenjo-daro, Dholavira, Lothal. Their art is intimate in scale: carved seals, lost-wax bronzes, terracotta figurines and beads, made with a precision that still astonishes.",
    },
    {
      id: "maurya", num: "II", name: "The Mauryan Empire", native: "मौर्य", span: "c. 322 – 185 BCE", start: -322, end: -185,
      intro: "India's first great empire gave stone a voice. Under Ashoka, polished sandstone pillars carried edicts of dharma across the subcontinent, crowned by animal capitals of breathtaking assurance — a court art that absorbed Persian and Hellenistic ideas and made them Indian.",
    },
    {
      id: "stupa", num: "III", name: "The Age of the Stupa", native: "स्तूप", span: "c. 200 BCE – 100 CE", start: -200, end: 100,
      intro: "Under Shunga and Satavahana rule, lay devotees, guilds and ivory-carvers paid for gateways and railings around Buddhist stupas. The Buddha himself is never shown — only his footprints, an empty throne, a tree — while yakshis, elephants and crowded cities spill across the stone.",
    },
    {
      id: "kushan", num: "IV", name: "Gandhara & Mathura", native: "गन्धार · मथुरा", span: "c. 1st – 3rd century CE", start: 30, end: 300,
      intro: "The Kushan empire bridged Central Asia and the Gangetic plain, and in two workshops at once — Greco-Roman Gandhara and indigenous Mathura — the Buddha was given a human body for the first time.",
    },
    {
      id: "gupta", num: "V", name: "The Classical Age", native: "गुप्त", span: "c. 320 – 550 CE", start: 320, end: 550,
      intro: "Gupta and Vakataka India defined the classical ideal: bodies of calm, inward grace; drapery so fine it seems wet; murals of luminous compassion. The iconography of Hindu, Buddhist and Jain art was set down for the next thousand years.",
    },
    {
      id: "rock", num: "VI", name: "Carved From the Mountain", native: "गुहा · शिला", span: "c. 550 – 900 CE", start: 550, end: 900,
      intro: "Pallavas, Chalukyas, Rashtrakutas and their contemporaries turned whole cliffs into sculpture. Temples were not built but carved — from the top down — out of living rock at Mahabalipuram, Elephanta and Ellora.",
    },
    {
      id: "temple", num: "VII", name: "The Temple Kingdoms", native: "கோயில்", span: "c. 850 – 1300 CE", start: 850, end: 1300,
      intro: "Cholas in the south, Chandelas in central India and the Eastern Gangas of Odisha raised temple towers to the sky and cast gods in bronze. The temple became a cosmos in stone — city, court, school and theatre at once.",
    },
    {
      id: "mughal", num: "VIII", name: "The Mughal Atelier", native: "मुग़ल", span: "c. 1560 – 1720 CE", start: 1560, end: 1720,
      intro: "Akbar's imperial workshop gathered Persian masters and Indian painters around one table. From that collaboration came manuscripts of epic energy and, under Jahangir and Shah Jahan, portraits and natural studies of jewel-like precision.",
    },
    {
      id: "rajput", num: "IX", name: "Courts of the Hills & Deserts", native: "राजपूत · पहाड़ी", span: "c. 1600 – 1850 CE", start: 1600, end: 1850,
      intro: "In the palaces of Rajasthan and the Punjab Hills, painters turned devotion into colour. Krishna and Radha, the ragas of music and the seasons of love were painted in styles as distinct as the kingdoms that made them.",
    },
    {
      id: "modern", num: "X", name: "Towards the Modern", native: "আধুনিক", span: "c. 1850 – 1950 CE", start: 1850, end: 1950,
      intro: "Colonial rule brought oil paint, lithography and art schools — and a fierce debate about what Indian art should be. Bazaar painters, academic realists, the Santiniketan school and the first modernists each gave a different answer.",
    },
  ],

  artifacts: [
    /* ---------- I. INDUS ---------- */
    {
      id: "t-dancing-girl", era: "indus", title: "The Dancing Girl", native: "नर्तकी", date: "c. 2300 – 1750 BCE",
      medium: "Bronze, lost-wax casting", category: "Sculpture", dims: "Height 10.5 cm",
      found: "Mohenjo-daro, Sindh — excavated 1926", now: "National Museum, New Delhi",
      summary: "A ten-centimetre bronze that carries the confidence of a whole civilisation.",
      body: [
        "Barely taller than a hand, this young woman stands with one hand on her hip and her weight thrown onto one leg — a pose of ease and self-possession that feels startlingly modern. Her left arm is almost entirely sheathed in bangles; a necklace with three pendants hangs at her throat and her hair is gathered into a heavy bun.",
        "She is one of the earliest known lost-wax castings in the world. A model was shaped in wax, coated in clay, heated so the wax ran out, and filled with molten metal — the same method still practised by bronze-casters at Swamimalai in Tamil Nadu today, some 4,000 years later.",
      ],
      look: ["The stack of bangles climbing her left arm to the shoulder", "The relaxed tilt of the hips — an early contrapposto", "Elongated limbs, modelled for rhythm rather than realism"],
      sketchfab: null,
    },
    {
      id: "t-priest-king", era: "indus", title: "The 'Priest-King'", native: "पुरोहित-राजा", date: "c. 2200 – 1900 BCE",
      medium: "Steatite, fired", category: "Sculpture", dims: "Height 17.5 cm",
      found: "Mohenjo-daro, Sindh — excavated 1927", now: "National Museum of Pakistan, Karachi",
      summary: "The most famous face of the Indus — and a name that may be entirely wrong.",
      body: [
        "A bearded man with half-closed eyes wears a cloak patterned with trefoils — three-lobed motifs once filled with red pigment. A fillet with a circular ornament binds his forehead, and a matching band circles his upper arm.",
        "Excavators called him a 'priest-king', yet the Indus cities have given us no palaces, no royal tombs and no certain temples. Who he was remains one of archaeology's open questions — a reminder that we still cannot read the Indus script.",
      ],
      look: ["The trefoil motif — found also on Mesopotamian objects of the period", "Drilled holes behind the ears, perhaps for a necklace or headdress", "Narrow, meditative eyes that were once inlaid"],
      sketchfab: null,
    },
    {
      id: "t-pashupati", era: "indus", title: "Unicorn Seal & its Impression", native: "मुद्रा", date: "c. 2500 – 1900 BCE",
      medium: "Carved steatite; clay impression", category: "Seal", dims: "Seal c. 3 cm square",
      found: "Indus cities (Mohenjo-daro, Harappa)", now: "Indian Museum, Kolkata",
      summary: "Thumb-sized masterpieces of carving — and the only writing the Indus left us.",
      body: [
        "Thousands of square seals were cut in intaglio so that, pressed into clay, they left a raised image. The most common subject is the one-horned 'unicorn' standing before a ritual stand, always crowned by a line of the undeciphered Indus script. The enlarged impression beside the tiny seal shows how much a carver could fit into three centimetres.",
        "Other seals show bulls, elephants, rhinoceros and the famous 'Pashupati' seal in the National Museum, New Delhi — a horned figure seated in a yogic posture among animals, which John Marshall read as a 'proto-Shiva'. Seals like these travelled with goods traded as far as Mesopotamia.",
      ],
      look: ["The script running along the top, read right to left", "The 'unicorn' and the ritual stand beneath its head", "Muscles and folds of skin cut into an animal under 3 cm long"],
      sketchfab: null,
    },

    /* ---------- II. MAURYA ---------- */
    {
      id: "t-lion-capital", era: "maurya", title: "Lion Capital of Ashoka", native: "अशोक स्तम्भ", date: "c. 250 BCE",
      medium: "Polished Chunar sandstone", category: "Sculpture", dims: "Height 2.15 m",
      found: "Sarnath, Uttar Pradesh — excavated 1905", now: "Sarnath Museum",
      summary: "Four lions facing the four directions — adopted as the State Emblem of India in 1950.",
      body: [
        "Ashoka raised this pillar at Sarnath, where the Buddha preached his first sermon. Four Asiatic lions sit back to back above a drum carved with an elephant, a bull, a horse and a lion, each separated by a wheel of dharma with 24 spokes. Beneath, a bell-shaped inverted lotus joins it to the shaft.",
        "The stone glows with the famous 'Mauryan polish', a mirror finish that has survived more than two thousand years. A great stone wheel once crowned the lions. Independent India took the capital as its State Emblem, and its wheel became the chakra on the national flag.",
      ],
      look: ["The mirror-like Mauryan polish on the lions' manes", "The 24-spoked wheels — the same Ashoka Chakra as on the flag", "Animals shown in motion around the drum, circling like the wheel of time"],
      sketchfab: null,
    },
    {
      id: "t-didarganj", era: "maurya", title: "Didarganj Yakshi", native: "दीदारगंज यक्षी", date: "c. 3rd century BCE (debated)",
      medium: "Polished Chunar sandstone", category: "Sculpture", dims: "Height c. 1.6 m",
      found: "Didarganj, Patna, on the bank of the Ganga — 1917", now: "Bihar Museum, Patna",
      summary: "A life-size attendant with a fly-whisk — ancient India's ideal of beauty and abundance.",
      body: [
        "Found half-buried on the Ganga's bank by villagers in 1917, this yakshi — a nature spirit linked to fertility and wealth — holds a chauri (fly-whisk) over her right shoulder, the sign of an attendant to royalty or the divine. Her heavy jewellery, full form and finely pleated garment set the canon of feminine beauty for centuries.",
        "Its surface carries the same high polish as Ashoka's pillars, which is why it is often called Mauryan. Others date it to the Kushan period on grounds of style. Either way, it is among the greatest freestanding sculptures of early India.",
      ],
      look: ["The chauri resting on her right shoulder", "Layered girdles and anklets carved with jeweller's precision", "The deep polish that turns sandstone almost to marble"],
      sketchfab: { uid: "393e8b873bcf426baa62c5d5b475b1bb", label: "3D scan of the Didarganj Yakshi" },
    },

    /* ---------- III. STUPA ---------- */
    {
      id: "t-sanchi-gate", era: "stupa", title: "Northern Gateway, Great Stupa of Sanchi", native: "साँची तोरण", date: "c. 1st century BCE – 1st century CE",
      medium: "Sandstone", category: "Architecture", dims: "Gateway c. 8.5 m high",
      found: "Sanchi, Madhya Pradesh", now: "In situ — UNESCO World Heritage Site (1989)",
      summary: "A picture-book in stone, where the Buddha is present only as an absence.",
      body: [
        "Ashoka built the first brick stupa at Sanchi; later it was doubled in size and fenced with a stone railing. Four gateways, or toranas, were then added at the cardinal points — an inscription credits the ivory-carvers of nearby Vidisha, which explains the jewel-box density of the carving.",
        "The crossbeams of the northern gateway tell Jataka tales and scenes from the Buddha's life, yet he never appears in human form: a Bodhi tree, an empty seat, a wheel or a pair of footprints stands in his place. Voluptuous tree-spirits (shalabhanjikas) lean out from the brackets as if the stone itself were in bloom.",
      ],
      look: ["The dharma-wheel crowning the gateway, flanked by trident symbols", "Elephant capitals supporting the lowest beam", "Shalabhanjika figures swinging from the bracket at each corner"],
      sketchfab: null,
    },
    {
      id: "t-bharhut", era: "stupa", title: "Bharhut Stupa Railing", native: "भरहुत", date: "c. 2nd – 1st century BCE",
      medium: "Red sandstone", category: "Sculpture", dims: "Railing pillars c. 2 m",
      found: "Bharhut, Madhya Pradesh — excavated by Alexander Cunningham, 1873", now: "Indian Museum, Kolkata",
      summary: "The first Indian narrative art to label its own stories — here, Lakshmi bathed by elephants.",
      body: [
        "Bharhut's railing is covered with medallions of Jataka stories, scenes of worship and tall standing yakshas and yakshis — each identified by an inscription carved beside it. For art historians these labels are gold: they let us read early Buddhist iconography with certainty.",
        "The figures are frontal, flat and decorative, the carving shallow as if drawn onto stone — the vigorous beginnings of a narrative tradition that would mature a century later at Sanchi.",
      ],
      look: ["Gajalakshmi: the goddess on a lotus, showered by two elephants", "Lotus stems rising from an overflowing vase (purna-ghata)", "Brahmi inscriptions elsewhere on the railing naming figures and stories"],
      sketchfab: null,
    },

    /* ---------- IV. KUSHAN ---------- */
    {
      id: "t-gandhara-buddha", era: "kushan", title: "Standing Buddha, Gandhara", native: "गन्धार बुद्ध", date: "c. 1st – 3rd century CE",
      medium: "Grey schist", category: "Sculpture", dims: "Life-size and under",
      found: "Gandhara (present-day north-west Pakistan & eastern Afghanistan)", now: "Tokyo National Museum",
      summary: "The Buddha as a Greco-Roman philosopher — East and West in a single figure.",
      body: [
        "Where Alexander's successors and Roman traders had passed, Gandharan sculptors carved the Buddha with wavy hair, a straight classical nose and a heavy monastic robe falling in deep, rope-like folds like a Roman toga. A halo frames the head; the ushnisha (cranial protuberance) and urna (tuft between the brows) mark his enlightenment.",
        "Gandhara and Mathura produced the first human images of the Buddha in the same era — two answers, one Hellenistic and one Indian, to the same question.",
      ],
      look: ["Deep, regular drapery folds borrowed from Roman sculpture", "Wavy hair gathered into a topknot over the ushnisha", "The weight resting on one leg, the other knee bending through the robe"],
      sketchfab: { uid: "1cd1470645334a76ae23b755b53fb736", label: "3D scan · Gandhara Buddha, Minneapolis Institute of Art (CC0)" },
    },
    {
      id: "t-mathura", era: "kushan", title: "Seated Buddha, Mathura School", native: "मथुरा", date: "c. 1st – 2nd century CE",
      medium: "Mottled red sandstone", category: "Sculpture", dims: "c. 70 cm",
      found: "Mathura region, Uttar Pradesh", now: "Government Museum, Mathura and others",
      summary: "An Indian answer to Gandhara — robust, smiling, radiant.",
      body: [
        "Mathura's sculptors drew on the tradition of the massive yaksha figures. Their Buddha sits upright on a lion throne, right hand raised in abhaya mudra (fear not), his robe clinging so thinly that it almost disappears. The face is broad and open, the eyes wide, the smile gentle.",
        "Carved from Mathura's distinctive red sandstone flecked with cream, these images travelled across north India and shaped the Gupta ideal that followed.",
      ],
      look: ["The spotted red sandstone unique to Mathura", "A shaven head with a spiral topknot (kapardin type)", "The hand raised in abhaya mudra"],
      sketchfab: null,
    },

    /* ---------- V. GUPTA ---------- */
    {
      id: "t-gupta-buddha", era: "gupta", title: "Standing Buddha, Mathura", native: "मथुरा बुद्ध", date: "c. 5th century CE",
      medium: "Mottled red sandstone", category: "Sculpture", dims: "Height c. 2.2 m",
      found: "Jamalpur mound, Mathura — dedicated by the monk Yashadinna", now: "Government Museum, Mathura",
      summary: "The Gupta ideal in full: serene, weightless, crowned by a halo of lotus and vine.",
      body: [
        "An inscription on the base records that the monk Yashadinna dedicated this image. The Buddha stands with his weight shifting gently to one side, his right hand once raised in blessing, his robe clinging to the body in rows of fine, string-like folds that ripple like water.",
        "Behind the head blooms one of the most magnificent haloes in Indian art — bands of lotus petals, scrolling vines and beads. Together with the seated Buddha of Sarnath, this figure defined how the Buddha would be imagined from Nepal to Java.",
      ],
      look: ["The great halo carved in concentric bands of ornament", "Parallel 'string' folds of the transparent robe", "Downcast eyes and a gentle inward smile"],
      sketchfab: { uid: "539350435cbb4ada9bae412f5b8858b0", label: "3D scan · Gupta-period Buddha from Sarnath, British Museum" },
    },
    {
      id: "t-padmapani", era: "gupta", title: "Bodhisattva Padmapani, Ajanta Cave 1", native: "पद्मपाणि", date: "c. late 5th century CE",
      medium: "Mineral pigments on lime plaster", category: "Painting", dims: "Wall mural",
      found: "Ajanta, Maharashtra (Vakataka period)", now: "In situ — UNESCO World Heritage Site (1983)",
      summary: "The most famous painted figure in Indian art: compassion itself.",
      body: [
        "Beside the entrance to the shrine of Cave 1, the bodhisattva Padmapani ('lotus-in-hand') bends gracefully in a tribhanga pose, holding a blue lotus, eyes lowered in infinite compassion. Around him crowds a court of attendants, musicians and lovers.",
        "Painters laid a coat of mud, straw and cow-dung onto the rock, finished it with lime, then built up colour with red and yellow ochre, lamp-black, green earth and precious lapis lazuli. Ajanta's caves were abandoned, overgrown and forgotten until a British hunting party stumbled on them in 1819.",
      ],
      look: ["The blue lotus held lightly between his fingers", "Highlights on the nose and brow that model the face in light", "A tall jewelled crown catching the lamplight of the cave"],
      sketchfab: null,
    },
    {
      id: "t-varaha", era: "gupta", title: "Varaha Rescuing the Earth, Udayagiri", native: "वराह", date: "c. 401 CE",
      medium: "Rock-cut sandstone relief", category: "Sculpture", dims: "Nearly 4 m high",
      found: "Udayagiri Caves, near Vidisha, Madhya Pradesh", now: "In situ",
      summary: "A god, a goddess and an empire — carved into a cliff.",
      body: [
        "Vishnu in his boar avatar, Varaha, rises from the cosmic ocean with the Earth goddess Bhudevi resting on his tusk. Rows of sages and gods look on; rippling lines of water and the serpent king below complete the scene.",
        "Carved in the reign of Chandragupta II, the relief is often read as royal allegory: as Varaha restores the world, so the Gupta king restores order to the land.",
      ],
      look: ["Bhudevi hanging from the boar's tusk", "Tiers of tiny sages across the rock face", "The naga king bowing in the water at Varaha's feet"],
      sketchfab: null,
    },

    /* ---------- VI. ROCK ---------- */
    {
      id: "t-descent", era: "rock", title: "Descent of the Ganges", native: "அர்ஜுனன் தபசு", date: "mid-7th century CE",
      medium: "Granite, open-air relief", category: "Sculpture", dims: "c. 27 × 9 m",
      found: "Mahabalipuram, Tamil Nadu (Pallava)", now: "In situ — UNESCO World Heritage Site (1984)",
      summary: "The largest open-air relief in the world — once washed by a real waterfall.",
      body: [
        "Across two enormous boulders the Pallava sculptors assembled gods, sages, hunters, life-size elephants and a cat mimicking an ascetic, all turned towards a natural cleft in the rock. There, serpent deities swim upward; water was once channelled from above to pour down the cleft as the river Ganga descending to earth.",
        "It is read either as the penance of Bhagiratha, who brought the Ganga down from heaven, or as Arjuna's penance to win Shiva's weapon. Its humour and tenderness make it one of the most human monuments in India.",
      ],
      look: ["The naga and nagini swimming up the central cleft", "A mother elephant sheltering her calves", "The 'ascetic cat' on its hind legs, surrounded by mice"],
      sketchfab: null,
    },
    {
      id: "t-trimurti", era: "rock", title: "Sadashiva (Trimurti), Elephanta", native: "त्रिमूर्ति", date: "c. mid-6th century CE",
      medium: "Basalt, rock-cut", category: "Sculpture", dims: "c. 6 m high",
      found: "Elephanta Island, Mumbai harbour", now: "In situ — UNESCO World Heritage Site (1987)",
      summary: "Three faces of Shiva emerging from the dark of the mountain.",
      body: [
        "Deep in the main cave of Elephanta, three colossal heads emerge from a recess: in the centre, calm and self-contained; to one side the fierce Aghora-Bhairava with serpents; to the other, gentle and feminine Vamadeva. Together they express Shiva as creator, preserver and destroyer.",
        "The Portuguese named the island after a stone elephant they found near the landing — it now stands in Mumbai's Jijamata Udyan.",
      ],
      look: ["Snakes coiling from the angry face on the left", "The jewelled high crown of the central head", "Light from the cave mouth falling across the faces"],
      sketchfab: null,
    },
    {
      id: "t-kailasa", era: "rock", title: "Kailasa Temple, Ellora Cave 16", native: "कैलास मंदिर", date: "c. 756 – 773 CE",
      medium: "Basalt, carved from a single rock", category: "Architecture", dims: "c. 60 × 30 m, 30 m high",
      found: "Ellora, Maharashtra (Rashtrakuta, Krishna I)", now: "In situ — UNESCO World Heritage Site (1983)",
      summary: "A complete temple carved downward out of a hillside — the largest monolith of its kind.",
      body: [
        "Instead of building upward, the Rashtrakuta masons cut trenches into the basalt cliff and then carved a whole temple from the isolated block — shrine, pillared hall, bridges, life-size elephants and towers — working from the top down. There was no room for error.",
        "The temple embodies Mount Kailasa, Shiva's Himalayan home. At Ellora it shares the escarpment with Buddhist and Jain caves, a monument to centuries of coexistence.",
      ],
      look: ["The relief of Ravana shaking Mount Kailasa", "Free-standing stone elephants around the base", "Pillars and bridges left standing inside the excavated courtyard"],
      sketchfab: null,
    },

    /* ---------- VII. TEMPLE KINGDOMS ---------- */
    {
      id: "t-nataraja", era: "temple", title: "Shiva Nataraja, Lord of the Dance", native: "நடராஜர்", date: "Chola period, 11th century",
      medium: "Bronze (copper alloy), lost-wax casting", category: "Bronze", dims: "113 × 102 × 30 cm",
      found: "Tamil Nadu", now: "The Cleveland Museum of Art",
      summary: "Creation and destruction held in perfect balance — the icon of Chola genius.",
      body: [
        "Shiva dances the ananda tandava, the dance of bliss, inside a ring of fire that stands for the cosmos. In one upper hand he holds the damaru, the drum whose beat creates the universe; in the other, the flame that destroys it. A lower hand says 'fear not'; the other points to his raised foot, the promise of release. Beneath him lies Apasmara, the dwarf of ignorance.",
        "Chola bronzes were cast by the lost-wax method and made to be carried in temple processions — note the lugs on the base for poles. They were dressed, garlanded and seen by torchlight, moving through the streets.",
      ],
      look: ["The river goddess Ganga caught in Shiva's flying locks", "Apasmara crushed beneath the right foot", "The flame-tipped ring of fire (prabhamandala)"],
      sketchfab: { uid: "6862a3c673d4434a8dc39ced2a5b5720", label: "3D scan of this Nataraja · The Cleveland Museum of Art (CC0)" },
    },
    {
      id: "t-brihadisvara", era: "temple", title: "Brihadisvara Temple, Thanjavur", native: "பெரிய கோயில்", date: "completed 1010 CE",
      medium: "Granite", category: "Architecture", dims: "Vimana c. 66 m high",
      found: "Thanjavur, Tamil Nadu (Chola, Rajaraja I)", now: "In situ — Great Living Chola Temples, UNESCO (1987)",
      summary: "The Big Temple — an emperor's statement written in granite.",
      body: [
        "Rajaraja I built the Brihadisvara as the symbol of Chola power. Its pyramidal vimana rises in thirteen tiers to a single enormous capstone, dwarfing every temple before it. Inscriptions on its walls list the gold, jewels, lands, dancers and musicians the king gave to the god.",
        "Inside the dark circumambulatory passage, Chola murals were found in 1931 beneath later Nayaka paintings — among the finest surviving paintings of medieval India.",
      ],
      look: ["The domed octagonal capstone at the summit", "The monolithic Nandi facing the sanctum", "Wall inscriptions in Tamil running around the base"],
      sketchfab: null,
    },
    {
      id: "t-konark", era: "temple", title: "Wheel of the Sun Temple, Konark", native: "କୋଣାର୍କ", date: "c. 1250 CE",
      medium: "Khondalite stone", category: "Architecture", dims: "Each wheel c. 3 m across",
      found: "Konark, Odisha (Eastern Ganga, Narasimhadeva I)", now: "In situ — UNESCO World Heritage Site (1984)",
      summary: "A temple built as the chariot of the Sun — with 24 wheels that tell the time.",
      body: [
        "The whole temple is imagined as Surya's colossal chariot, drawn by seven horses on 24 carved wheels. Each wheel has eight major and eight minor spokes, and every surface — hub, rim, spoke — is dense with carving of deities, dancers, animals and daily life.",
        "The wheels are often said to act as sundials, the shadow of the spokes marking the hours. The Sun Temple appears on the reverse of India's ₹10 note.",
      ],
      look: ["Medallions on the spokes filled with tiny figures", "The axle-hub projecting like a lotus", "Scrolling foliage along the rim"],
      sketchfab: null,
    },
    {
      id: "t-khajuraho", era: "temple", title: "Kandariya Mahadeva Temple, Khajuraho", native: "कंदारिया महादेव", date: "c. 1030 CE",
      medium: "Sandstone", category: "Architecture", dims: "Tower c. 31 m high",
      found: "Khajuraho, Madhya Pradesh (Chandela)", now: "In situ — UNESCO World Heritage Site (1986)",
      summary: "A mountain of towers — the most perfect expression of the Nagara temple.",
      body: [
        "Built by the Chandela kings, the Kandariya Mahadeva rises in a cluster of ever-larger spires to its main shikhara, like the peaks of a Himalayan range climbing towards Mount Kailasa. Its walls carry hundreds of sculptures: gods, celestial women, guardians and loving couples.",
        "Of the roughly 85 temples once at Khajuraho, around 25 survive — protected, perhaps, by the forest that hid them for centuries.",
      ],
      look: ["Miniature spires (urushringas) clustered on the tower", "Three bands of sculpture circling the walls", "Balconied windows lighting the halls inside"],
      sketchfab: null,
    },

    /* ---------- VIII. MUGHAL ---------- */
    {
      id: "t-hamzanama", era: "mughal", title: "Folio from the Hamzanama", native: "हम्ज़ानामा", date: "c. 1562 – 1577",
      medium: "Opaque watercolour and gold on cotton cloth", category: "Painting", dims: "c. 68 × 54 cm",
      found: "Imperial atelier of Akbar", now: "Scattered — museums worldwide",
      summary: "The epic commission that forged the Mughal style.",
      body: [
        "Young Akbar ordered the adventures of Amir Hamza painted in some 1,400 large illustrations — a project that took about fifteen years. Two Persian masters, Mir Sayyid Ali and Abd al-Samad, led a studio of Indian painters, and together they created something new: Persian refinement fused with Indian energy, crowded compositions, and bold, dramatic colour.",
        "Only around 200 folios survive. The pictures were held up and shown while the story was recited aloud — a kind of imperial cinema.",
      ],
      look: ["Painted on cloth, not paper — unusually large and durable", "Dense Indian vegetation within Persian-style architecture", "Figures in violent, twisting motion"],
      sketchfab: null,
    },
    {
      id: "t-jahangir-sufi", era: "mughal", title: "Jahangir Preferring a Sufi Shaikh to Kings", native: "जहाँगीर", date: "c. 1615 – 1618",
      medium: "Opaque watercolour, gold and ink on paper", category: "Painting", dims: "25.3 × 18.1 cm",
      found: "By Bichitr, for the album of Emperor Jahangir", now: "Freer Gallery of Art, Smithsonian, Washington DC",
      summary: "Political allegory, European borrowings and a painter's self-portrait in one page.",
      body: [
        "Jahangir sits on an hourglass throne, haloed by a sun and moon, and hands a book to a Sufi shaikh — ignoring an Ottoman sultan and King James I of England, who wait below. The painter Bichitr includes himself at the lower left, offering a picture.",
        "Cupids borrowed from European prints turn away in despair; the English king is copied from a portrait brought by the English ambassador. The Persian inscription praises the emperor who, though kings stand before him, looks only towards dervishes.",
      ],
      look: ["The sands running out in the hourglass throne", "King James I, copied from an English portrait", "Bichitr's self-portrait holding his own painting"],
      sketchfab: null,
    },
    {
      id: "t-squirrels", era: "mughal", title: "Squirrels in a Plane Tree", native: "अबुल हसन", date: "c. 1610",
      medium: "Opaque watercolour and gold on paper", category: "Painting", dims: "Album page",
      found: "Court of Jahangir — attributed to Abu'l Hasan (with Ustad Mansur)", now: "British Library, London (India Office collection)",
      summary: "A chinar tree alive with squirrels — the naturalist's eye of Jahangir's studio.",
      body: [
        "Jahangir was a passionate naturalist who recorded animals and birds in his memoirs and ordered his painters to document them. In this page a hunter climbs a great chinar (plane) tree whose autumn leaves blaze orange and green, while squirrels scamper, leap and chatter through the branches and birds perch among them.",
        "It is attributed to Abu'l Hasan, whom Jahangir titled Nadir al-Zaman ('Wonder of the Age'), working with the animal specialist Ustad Mansur. Every squirrel is observed from life — fur, tails and poses — a century before European natural-history painting reached such precision.",
      ],
      look: ["Squirrels caught mid-leap on the trunk", "Chinar leaves turning from green to flame orange", "The climbing hunter half-hidden at the foot of the tree"],
      sketchfab: null,
    },

    /* ---------- IX. RAJPUT & PAHARI ---------- */
    {
      id: "t-boat-of-love", era: "rajput", title: "Radha and Krishna in the Boat of Love", native: "बणी-ठणी", date: "c. 1750",
      medium: "Opaque watercolour and gold on paper", category: "Painting", dims: "Miniature",
      found: "Kishangarh, Rajasthan — attributed to Nihal Chand", now: "National Museum, New Delhi",
      summary: "Kishangarh's dream of love — with Bani Thani as Radha.",
      body: [
        "Raja Sawant Singh of Kishangarh, a poet devoted to Krishna under the name Nagari Das, loved the court singer known as Bani Thani ('the elegantly attired one'). His painter Nihal Chand cast the pair as Krishna and Radha, gliding across a lake in a pleasure boat beneath a vast evening sky.",
        "Kishangarh faces are unmistakable: an elongated profile, lotus-petal eyes curving up to the temple, arched brows, a sharp nose and a serpentine curl before the ear. Nihal Chand's portrait of Bani Thani became so famous that India Post issued it as a stamp in 1973 — the 'Mona Lisa of India'.",
      ],
      look: ["Tiny figures set within an immense lake and palace landscape", "Lotus-petal eyes reaching almost to the ear", "The golden canopy of the boat glowing against dark water"],
      sketchfab: null,
    },
    {
      id: "t-kangra", era: "rajput", title: "Krishna's Longing for Radha — the Lambagraon Gita Govinda", native: "गीत गोविन्द", date: "c. 1820 – 1825",
      medium: "Opaque watercolour on paper", category: "Painting", dims: "Miniature",
      found: "Kangra school, Punjab Hills (Himachal Pradesh)", now: "The Cleveland Museum of Art",
      summary: "Jayadeva's poem of divine love, painted in the cool greens of the hills.",
      body: [
        "The Pahari (hill) painters — above all the descendants of Pandit Seu, Manaku and Nainsukh of Guler — absorbed Mughal naturalism and softened it into lyric poetry. This page belongs to a Gita Govinda series made for the Lambagraon branch of Kangra's royal family.",
        "In Jayadeva's 12th-century poem, Krishna wanders the forest longing for Radha. The painter makes the landscape carry the emotion: flowering trees lean towards each other, the grove closes in like an embrace, and Radha's companions move between the lovers as messengers.",
      ],
      look: ["Dense, jewel-like trees framing each episode", "Krishna shown more than once within the same scene", "Fine, unbroken outlines drawn with a single-hair brush"],
      sketchfab: null,
    },

    /* ---------- X. MODERN ---------- */
    {
      id: "t-kalighat", era: "modern", title: "Trivikrama — Kalighat Painting", native: "কালীঘাট পট", date: "19th century",
      medium: "Watercolour and tin-alloy highlights on mill-made paper", category: "Painting", dims: "c. 45 × 28 cm",
      found: "Kalighat temple bazaar, Kolkata", now: "The Cleveland Museum of Art",
      summary: "Bazaar art that sold gods and gossip — and taught modernists a new line.",
      body: [
        "Scroll-painters (patuas) from rural Bengal settled around the Kali temple and began selling single sheets to pilgrims. Working fast with cheap paper and bright colour, they developed sweeping, rhythmic outlines and shading that suggests volume in a single brushstroke. Here Vishnu as Trivikrama lifts his leg to take the cosmic stride that wins back the three worlds from the demon king Bali.",
        "Besides gods and goddesses, Kalighat painters satirised dandyish babus, scandals and modern Kolkata life. Their economy of line inspired modern artists such as Jamini Roy.",
      ],
      look: ["One confident, swelling brushline for each contour", "Vishnu's leg raised for the stride across the heavens", "Blank backgrounds — nothing distracts from the figure"],
      sketchfab: null,
    },
    {
      id: "t-ravi-varma", era: "modern", title: "There Comes Papa — Raja Ravi Varma", native: "രാജാ രവിവർമ്മ", date: "1893",
      medium: "Oil on canvas", category: "Painting", dims: "Easel painting",
      found: "Painted by Raja Ravi Varma (1848–1906) of Kilimanoor, Travancore", now: "Kerala",
      summary: "The painter who gave India's gods a face — and printed it for every home.",
      body: [
        "Ravi Varma mastered European oil painting and academic realism and turned them to Indian subjects. In this intimate scene his daughter Mahaprabha holds her infant son, who points towards someone approaching — the 'Papa' of the title — while the family dog looks up. The white Kerala mundu glows against a dark interior.",
        "Beyond portraits he painted heroines of Kalidasa and the epics, gods and goddesses. In 1894 he opened a lithographic press near Bombay; cheap oleographs of his work reached ordinary homes, shaped calendar art and early Indian cinema — the young Dadasaheb Phalke worked at the press.",
      ],
      look: ["Oil glazes modelling skin and fabric in soft light", "The child's pointing gesture that turns a portrait into a story", "The dog at her feet — a touch of European genre painting"],
      sketchfab: null,
    },
    {
      id: "t-sher-gil", era: "modern", title: "Amrita Sher-Gil", native: "अमृता शेरगिल", date: "1930s",
      medium: "Oil on canvas", category: "Painting", dims: "Various",
      found: "Paris, Shimla, Saraya", now: "National Gallery of Modern Art, New Delhi",
      summary: "Paris-trained, Ajanta-inspired — the first great Indian modernist.",
      body: [
        "Born in Budapest to a Sikh father and a Hungarian mother, Amrita Sher-Gil trained in Paris and returned to India in 1934 determined to paint Indian life. After seeing Ajanta and the Mughal and Pahari miniatures, she fused Post-Impressionist colour with their flat planes and quiet melancholy.",
        "She died at 28, yet her work is declared a National Art Treasure by the Government of India. Her monumental, contemplative women remain some of the most powerful images of 20th-century Indian art.",
      ],
      look: ["Broad, flattened areas of earthy colour", "Downcast, introspective faces", "Compositions echoing Ajanta murals"],
      sketchfab: null,
    },
    {
      id: "t-santhal", era: "modern", title: "Santhal Family — Ramkinkar Baij", native: "সাঁওতাল পরিবার", date: "1938",
      medium: "Cement concrete with laterite pebbles", category: "Sculpture", dims: "Monumental, open-air",
      found: "Kala Bhavana, Santiniketan, West Bengal", now: "In situ, Santiniketan",
      summary: "India's first great modern public sculpture — made of cement, for the open air.",
      body: [
        "Ramkinkar Baij, a student and teacher at Tagore's Kala Bhavana, modelled a Santhal man, woman, child and dog striding across the land, carrying their belongings — a family of the Adivasi community that lived around Santiniketan.",
        "Instead of marble or bronze he used cheap cement mixed with local laterite, built directly on site. It was a radical choice: modern in form, rooted in place, and dedicated to ordinary working people rather than gods or kings.",
      ],
      look: ["Rough laterite texture left visible in the cement", "The forward stride of the whole family", "The dog trotting at the family's heels"],
      sketchfab: null,
    },
  ],
};
