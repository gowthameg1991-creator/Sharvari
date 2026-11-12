// NCERT Class 11 Biology, Unit 1, Chapter 1: The Living World (kebo101.pdf)
// Single source of truth for carousels, videos and the revision page.
// Slide fields:
//   kind: cover | points | qa | mcq
//   points: on-screen bullets (HTML allowed: <b>, <i>)
//   say: one caption per video step (step i reveals points[0..i])
//   diagram: optional visual (see templates/slides.js renderDiagram)
//   extra: true marks content that goes beyond the NCERT text (NEET tips)

const I = (s) => `<i>${s}</i>`;

const SPREAD = [0, 3, 1, 2, 3, 0, 2, 1, 1, 3, 0, 2, 3, 1, 0, 2, 2, 0, 3, 1];
function balance(list) {
  return list.map((m, i) => {
    const o = m.o.slice(), t = SPREAD[i % SPREAD.length];
    [o[m.a], o[t]] = [o[t], o[m.a]];
    return { ...m, o, a: t };
  });
}

export default {
  chapter: "Chapter 1 · The Living World",
  book: "NCERT Biology · Class XI · Unit 1",
  source: "https://ncert.nic.in/textbook/pdf/kebo101.pdf",
  topics: [
    // ─────────────────────────────────────────────────────────────── 1
    {
      id: "01-unit-intro",
      short: "Unit intro & Ernst Mayr",
      title: "Unit 1: Diversity in the Living World",
      slides: [
        {
          kind: "cover",
          eyebrow: "Unit 1 · Opening pages",
          title: "Diversity in the Living World",
          sub: "How biology moved from awe and fear to naming, grouping and relating every living thing.",
          say: ["Welcome to Unit 1. Before Chapter 1 starts, NCERT gives a short unit introduction and a profile of Ernst Mayr. Both are fair game for NEET."],
        },
        {
          kind: "points",
          title: "Unit 1 has four chapters",
          points: [
            "Chapter 1 · <b>The Living World</b> (this pack)",
            "Chapter 2 · Biological Classification",
            "Chapter 3 · Plant Kingdom",
            "Chapter 4 · Animal Kingdom",
          ],
          say: [
            "Chapter 1 is the foundation: naming and ranking organisms.",
            "Chapter 2 builds on it with kingdoms of life.",
            "Chapter 3 classifies plants.",
            "Chapter 4 classifies animals. Everything uses the ideas from this chapter.",
          ],
        },
        {
          kind: "points",
          title: "Biology and early man",
          points: [
            "<b>Biology</b> is the science of life forms and living processes.",
            "The living world comprises an amazing diversity of living organisms.",
            "Early man could easily perceive the difference between <b>inanimate matter</b> and <b>living organisms</b>.",
            "Early man <b>deified</b> some inanimate matter (wind, sea, fire etc.) and some animals and plants.",
            "Common feature of all such inanimate and animate objects: the sense of <b>awe or fear</b> they evoked.",
          ],
          say: [
            "Start with the definition: biology is the science of life forms and living processes.",
            "And life comes in an amazing diversity.",
            "Even early humans could tell non-living matter from living things.",
            "They worshipped, or deified, wind, sea and fire, and some animals and plants.",
            "What these had in common was the awe or fear they caused.",
          ],
        },
        {
          kind: "points",
          title: "From awe to systematic study",
          points: [
            "The description of living organisms, including human beings, began much later in human history.",
            "Societies with an <b>anthropocentric</b> (human-centred) view of biology registered only limited progress.",
            "Systematic, monumental description of life forms brought in detailed systems of <b>identification, nomenclature and classification</b>.",
            "Biggest spin-off: recognising that living organisms share similarities both <b>horizontally and vertically</b>.",
            "All present-day organisms are related to each other and to all organisms that ever lived on earth.",
            "This revelation humbled man and led to cultural movements for <b>conservation of biodiversity</b>.",
          ],
          say: [
            "Describing organisms, ourselves included, came much later.",
            "Anthropocentric means human-centred. Societies that saw biology only through human use made limited progress.",
            "Describing huge numbers of life forms forced us to build systems to identify, name and classify them.",
            "The big result: organisms share similarities horizontally, among living groups, and vertically, through ancestry.",
            "Every living thing is related to every other, and to everything that ever lived.",
            "That humbling idea led to movements to conserve biodiversity. The unit then classifies plants and animals from a taxonomist's point of view.",
          ],
        },
        {
          kind: "points",
          title: "Ernst Mayr (1904 – 2004)",
          points: [
            "Born <b>5 July 1904</b> in <b>Kempten, Germany</b>; Harvard University evolutionary biologist.",
            "Called <b>‘The Darwin of the 20<sup>th</sup> century’</b>; one of the 100 greatest scientists of all time.",
            "Joined Harvard’s Faculty of Arts and Sciences in <b>1953</b>; retired in <b>1975</b> as " + I("Alexander Agassiz Professor of Zoology Emeritus") + ".",
            "Nearly 80-year career: ornithology, taxonomy, zoogeography, evolution, systematics, and the history and philosophy of biology.",
            "Almost single-handedly made the <b>origin of species diversity</b> the central question of evolutionary biology.",
            "Pioneered the currently accepted definition of a <b>biological species</b>.",
            "Won the <b>triple crown</b> of biology: " + I("Balzan Prize") + " 1983, " + I("International Prize for Biology") + " 1994, " + I("Crafoord Prize") + " 1999.",
            "Died in <b>2004</b> at the age of 100.",
          ],
          say: [
            "Ernst Mayr was born on 5 July 1904 in Kempten, Germany.",
            "He is called the Darwin of the twentieth century.",
            "Harvard from 1953 to 1975, retiring as Alexander Agassiz Professor of Zoology Emeritus.",
            "His research spanned birds, taxonomy, geography of animals, evolution, systematics and philosophy of biology.",
            "He made 'how did so many species arise?' the central question of evolutionary biology.",
            "Remember this one: he pioneered the biological species definition.",
            "Triple crown: Balzan 1983, International Prize for Biology 1994, Crafoord 1999.",
            "He died in 2004, aged 100.",
          ],
        },
        {
          kind: "points",
          title: "Mayr on a timeline",
          diagram: {
            type: "timeline",
            events: [
              ["1904", "Born, Kempten (Germany)"],
              ["1953", "Joins Harvard"],
              ["1975", "Retires, Agassiz Prof. Emeritus"],
              ["1983", "Balzan Prize"],
              ["1994", "International Prize for Biology"],
              ["1999", "Crafoord Prize"],
              ["2004", "Dies, aged 100"],
            ],
          },
          points: [],
          say: ["Seven dates in order. Pause here and read them once more."],
        },
        {
          kind: "points",
          extra: true,
          title: "NEET tip: how Mayr gets asked",
          points: [
            "‘Darwin of the 20<sup>th</sup> century’ → Ernst Mayr.",
            "Biological species concept → Ernst Mayr.",
            "Triple crown in date order: <b>B</b>alzan 1983 → <b>I</b>nternational Prize 1994 → <b>C</b>rafoord 1999. Remember <b>B-I-C</b>.",
            "Don’t confuse him with Linnaeus, who gave binomial nomenclature and wrote " + I("Systema Naturae") + ".",
          ],
          say: [
            "Statement-type questions often pair a title with a scientist.",
            "Biological species concept is Mayr.",
            "Use B-I-C for the prize order.",
            "And keep Mayr and Linnaeus separate.",
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────── 2
    {
      id: "02-what-is-living",
      short: "What is living?",
      title: "Chapter 1 opener: What is living?",
      slides: [
        {
          kind: "cover",
          eyebrow: "Chapter 1 · Opening",
          title: "What is living?",
          sub: "The chapter has two sections: 1.1 Diversity in the Living World and 1.2 Taxonomic Categories.",
          say: ["Chapter 1 opens with a big question, then splits into two sections: 1.1 Diversity, and 1.2 Taxonomic Categories."],
        },
        {
          kind: "points",
          title: "How wonderful is the living world!",
          points: [
            "The range of living types is amazing.",
            "Extraordinary habitats: <b>cold mountains, deciduous forests, oceans, fresh water lakes, deserts, hot springs</b>.",
            "A galloping horse, migrating birds, the valley of flowers, an attacking shark: they evoke <b>awe</b> and a deep sense of wonder.",
            "Ecological <b>conflict and cooperation</b> among members of a population, and among populations of a community, make us reflect.",
            "So does the <b>molecular traffic inside a cell</b>.",
          ],
          say: [
            "Life comes in an amazing range of types.",
            "It survives in six very different habitats NCERT lists: cold mountains, deciduous forests, oceans, fresh water lakes, deserts and hot springs.",
            "Its beauty fills us with wonder.",
            "Organisms compete and cooperate within populations and between populations of a community.",
            "Even inside one cell, molecules are constantly moving. All of this leads to one question: what is life?",
          ],
        },
        {
          kind: "points",
          title: "Two questions hidden in ‘What is life?’",
          diagram: {
            type: "compare",
            left: { h: "Technical question", items: ["What is <b>living</b>, as opposed to non-living?", "Scientists <b>try to answer</b> this."] },
            right: { h: "Philosophical question", items: ["What is the <b>purpose</b> of life?", "As scientists, we do <b>not</b> attempt this."] },
          },
          points: ["So this chapter reflects on one thing: <b>what is living?</b>"],
          say: ["The technical question asks what makes something living. The philosophical one asks why life exists. Biology answers only the first."],
        },
        {
          kind: "points",
          extra: true,
          title: "Beyond current NCERT: features of living things",
          points: [
            "Older NCERT editions listed: <b>growth, reproduction, metabolism, cellular organisation, consciousness</b>.",
            "<b>Defining</b> properties (no exception): metabolism, cellular organisation, consciousness (ability to sense the environment).",
            "Growth and reproduction are <b>not</b> defining: crystals and mountains grow by accumulation; mules, worker bees and infertile couples do not reproduce.",
            "This part was removed in the rationalised textbook, but older-pattern NEET questions still use it.",
          ],
          say: [
            "This slide is extra. Older books listed five features of living organisms.",
            "Only three are defining: metabolism, cellular organisation and consciousness.",
            "Growth and reproduction have exceptions, so they are not defining.",
            "Know it for older question banks, but your current textbook skips it.",
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────── 3
    {
      id: "03-naming",
      short: "1.1 Biodiversity & naming",
      title: "1.1 Diversity in the Living World: naming organisms",
      slides: [
        {
          kind: "cover",
          eyebrow: "Section 1.1 · Part A",
          title: "Biodiversity, identification & naming",
          sub: "Species, biodiversity, nomenclature, ICBN and ICZN, binomial names and their four rules.",
          say: ["Section 1.1, part A. Here's how we count life and how every organism gets one name used worldwide."],
        },
        {
          kind: "points",
          title: "Biodiversity",
          points: [
            "Look around: potted plants, insects, birds, pets, other animals and plants, plus many organisms you <b>cannot see with the naked eye</b>.",
            "Increase the area of observation, and the range and variety of organisms increases. A dense forest has far more kinds.",
            "Each different kind of plant, animal or organism represents a <b>species</b>.",
            "Known and described species: <b>1.7 – 1.8 million</b>.",
            "<b>Biodiversity</b> = the number and types of organisms present on earth.",
            "New organisms are continuously being identified as we explore new areas, and even old ones.",
          ],
          say: [
            "Organisms are everywhere, including many microscopic ones.",
            "The bigger the area you observe, the more variety you find.",
            "Each different kind is a species.",
            "The number to memorise: 1.7 to 1.8 million known and described species.",
            "Biodiversity means the number and types of organisms on earth.",
            "And this number keeps growing as new organisms are discovered.",
          ],
        },
        {
          kind: "points",
          title: "Why do we need scientific names?",
          points: [
            "We know plants and animals of our own area by <b>local names</b>.",
            "Local names vary from place to place, even within a country, which creates confusion.",
            "So naming is standardised so that an organism is known by the <b>same name all over the world</b>. This process is <b>nomenclature</b>.",
            "Naming is possible only when the organism is <b>described correctly</b> and we know which organism the name is attached to. This is <b>identification</b>.",
          ],
          say: [
            "Every region has its own names for organisms.",
            "The same plant can have many names across one country.",
            "Nomenclature means giving one standard name used worldwide.",
            "But you can only name something correctly once it is described and identified. Identification comes first.",
          ],
        },
        {
          kind: "points",
          title: "International codes of nomenclature",
          diagram: {
            type: "compare",
            left: { h: "Plants · ICBN", items: ["<b>I</b>nternational <b>C</b>ode for <b>B</b>otanical <b>N</b>omenclature", "Agreed principles and criteria for plant names"] },
            right: { h: "Animals · ICZN", items: ["<b>I</b>nternational <b>C</b>ode of <b>Z</b>oological <b>N</b>omenclature", "Evolved by animal taxonomists"] },
          },
          points: [
            "Scientific names ensure each organism has <b>only one name</b>.",
            "The description of an organism lets people anywhere in the world arrive at the <b>same name</b>.",
            "They ensure the name has <b>not been used for any other</b> known organism.",
          ],
          say: [
            "Plants follow ICBN and animals follow ICZN. Each organism gets exactly one name.",
            "Anyone, anywhere, describing the organism reaches the same name.",
            "And no two known organisms share a name.",
          ],
        },
        {
          kind: "points",
          title: "Binomial nomenclature",
          diagram: { type: "binomial", author: false },
          points: [
            "Each scientific name has two components: the <b>generic name</b> and the <b>specific epithet</b>.",
            "This two-component system is called <b>binomial nomenclature</b>.",
            "Given by <b>Carolus Linnaeus</b>; practised by biologists all over the world. The two-word format was found convenient.",
            "Mango = " + I("Mangifera indica") + ": " + I("Mangifera") + " is the <b>genus</b>, " + I("indica") + " is the particular species, the <b>specific epithet</b>.",
          ],
          say: [
            "Two names: genus first, then specific epithet.",
            "Bi-nomial means two names.",
            "Carolus Linnaeus gave this system.",
            "In Mangifera indica, Mangifera is the genus and indica is the specific epithet.",
          ],
        },
        {
          kind: "points",
          title: "Universal rules of nomenclature",
          numbered: true,
          points: [
            "Biological names are generally in <b>Latin</b> and written in <b>italics</b>. They are Latinised or derived from Latin irrespective of their origin.",
            "The <b>first word</b> represents the <b>genus</b>; the <b>second</b> denotes the <b>specific epithet</b>.",
            "Both words, when <b>handwritten</b>, are <b>separately underlined</b>, or <b>printed in italics</b>, to indicate their Latin origin.",
            "The genus starts with a <b>capital letter</b>; the specific epithet starts with a <b>small letter</b>: " + I("Mangifera indica") + ".",
          ],
          say: [
            "Rule 1: Latin, or Latinised, and in italics.",
            "Rule 2: genus first, specific epithet second.",
            "Rule 3: handwritten names get two separate underlines, printed names use italics.",
            "Rule 4: capital letter for the genus, small letter for the epithet.",
          ],
        },
        {
          kind: "points",
          title: "Where the author’s name goes",
          diagram: { type: "binomial", author: true },
          points: [
            "The <b>author’s name</b> appears <b>after the specific epithet</b>, at the end of the biological name.",
            "It is written in an <b>abbreviated</b> form, e.g. " + I("Mangifera indica") + " Linn.",
            "‘Linn.’ indicates this species was <b>first described by Linnaeus</b>.",
          ],
          say: [
            "The author's name comes last.",
            "It is abbreviated, like Linn.",
            "Linn. tells you Linnaeus was the first to describe this species.",
          ],
        },
        {
          kind: "points",
          extra: true,
          title: "NEET traps on scientific names",
          points: [
            "✗ " + I("Mangifera Indica") + ": the epithet must start with a small letter. ✓ " + I("Mangifera indica") + ".",
            "Handwritten: underline <b>each word separately</b>, not one continuous line.",
            "Author citation is usually printed in roman (not italic): " + I("Mangifera indica") + " Linn.",
            "Beyond NCERT: ICBN is now called <b>ICN</b> (International Code of Nomenclature for algae, fungi and plants). Bacteria use ICNB and viruses use ICVN.",
            "Linnaeus is the ‘Father of Taxonomy’; his " + I("Species Plantarum") + " (1753) is the starting point of plant names.",
          ],
          say: [
            "The capital I in Indica is the classic trap. It is wrong.",
            "Two separate underlines when handwritten.",
            "The author's name isn't italicised.",
            "Know that ICBN was renamed ICN, but NCERT still says ICBN.",
            "Linnaeus is the father of taxonomy.",
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────── 4
    {
      id: "04-taxonomy",
      short: "1.1 Classification & taxonomy",
      title: "1.1 Diversity in the Living World: classification, taxonomy, systematics",
      slides: [
        {
          kind: "cover",
          eyebrow: "Section 1.1 · Part B",
          title: "Classification, taxa, taxonomy & systematics",
          sub: "How we group organisms, what a taxon is, and how taxonomy differs from systematics.",
          say: ["Section 1.1, part B. Once organisms are named, we need to group them."],
        },
        {
          kind: "points",
          title: "Classification",
          points: [
            "It is nearly impossible to study all living organisms, so we need a way to make it possible.",
            "<b>Classification</b>: the process by which anything is grouped into convenient categories based on some <b>easily observable characters</b>.",
            "We easily recognise groups like plants, animals, dogs, cats or insects. Each term brings certain characters to mind.",
            "Think ‘dog’: you picture dogs, not cats. Think ‘Alsatians’: we know exactly what we mean.",
            "Say ‘mammals’: you picture animals with <b>external ears and body hair</b>.",
            "In plants, ‘Wheat’ brings up wheat plants, not rice or any other plant.",
          ],
          say: [
            "There are too many organisms to study one by one.",
            "Classification groups them by characters that are easy to see.",
            "Group names instantly carry a picture of features.",
            "Dog means dogs, and Alsatians is even more specific.",
            "NCERT's example of mammal features: external ears and body hair.",
            "Same for plants: wheat is wheat, not rice.",
          ],
        },
        {
          kind: "points",
          title: "Taxa: categories at different levels",
          diagram: { type: "nested", rings: ["Animals", "Mammals", "Dogs"] },
          points: [
            "‘Dogs’, ‘Cats’, ‘Mammals’, ‘Wheat’, ‘Rice’, ‘Plants’, ‘Animals’ are convenient categories. The scientific term is <b>taxa</b>.",
            "Taxa can indicate categories at <b>very different levels</b>. ‘Plants’ is a taxon, and so is ‘Wheat’.",
            "A dog is a mammal and mammals are animals, so ‘animals’, ‘mammals’ and ‘dogs’ are taxa at <b>different levels</b>.",
            "Based on characteristics, all living organisms can be classified into different taxa. This process of classification is <b>taxonomy</b>.",
          ],
          say: [
            "Each of these groups is a taxon. The plural is taxa.",
            "A taxon can be big, like plants, or small, like wheat.",
            "Dogs sit inside mammals, which sit inside animals: three levels.",
            "Sorting organisms into taxa by their characteristics is called taxonomy.",
          ],
        },
        {
          kind: "points",
          title: "Taxonomy: its basis and processes",
          diagram: { type: "chips", items: ["Characterisation", "Identification", "Classification", "Nomenclature"] },
          points: [
            "Basis of modern taxonomic studies: <b>external and internal structure</b>, <b>structure of cell</b>, <b>development process</b> and <b>ecological information</b>.",
            "<b>Characterisation, identification, classification and nomenclature</b> are the processes basic to taxonomy.",
          ],
          say: [
            "Modern taxonomy uses four kinds of information: external and internal structure, cell structure, development, and ecology.",
            "And it rests on four processes: characterise, identify, classify, name.",
          ],
        },
        {
          kind: "points",
          title: "Taxonomy is not new",
          points: [
            "Human beings have always wanted to know more about organisms, particularly for <b>their own use</b>.",
            "In early days, humans needed sources for basic needs: <b>food, clothing and shelter</b>.",
            "So the <b>earliest classifications were based on the ‘uses’</b> of various organisms.",
          ],
          say: [
            "People have always been curious about organisms, mostly for practical reasons.",
            "Food, clothing and shelter came first.",
            "So the first classifications sorted organisms by their uses.",
          ],
        },
        {
          kind: "points",
          title: "Systematics",
          points: [
            "Humans were interested in kinds of organisms and their diversity, and also in the <b>relationships among them</b>. This study is <b>systematics</b>.",
            "From the Latin word <b>‘systema’</b>: systematic arrangement of organisms.",
            "Linnaeus used " + I("Systema Naturae") + " as the title of his publication.",
            "Its scope was later enlarged to include <b>identification, nomenclature and classification</b>.",
            "Systematics takes into account <b>evolutionary relationships</b> between organisms.",
          ],
          say: [
            "Systematics studies diversity and the relationships among organisms.",
            "The word comes from Latin systema, meaning systematic arrangement.",
            "Linnaeus named his book Systema Naturae.",
            "Later, systematics also took in identification, naming and classification.",
            "Its key feature is evolutionary relationships.",
          ],
        },
        {
          kind: "points",
          extra: true,
          title: "NEET tip: taxonomy vs systematics",
          diagram: {
            type: "compare",
            left: { h: "Taxonomy", items: ["Characterisation, identification, classification, nomenclature", "Classifying organisms into taxa by characteristics"] },
            right: { h: "Systematics", items: ["All of taxonomy <b>plus</b> relationships", "Includes <b>evolutionary relationships</b>, so it is the broader term"] },
          },
          points: [
            "Beyond NCERT: the term ‘taxonomy’ was coined by A. P. de Candolle (1813).",
            "Earliest classifications were based on <b>uses</b>, not on evolution.",
          ],
          say: ["If a question mentions evolutionary relationships, the answer is systematics.", "De Candolle coined the word taxonomy.", "Earliest classification was use-based."],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────── 5
    {
      id: "05-categories-species-family",
      short: "1.2 Species, genus, family",
      title: "1.2 Taxonomic Categories: hierarchy, species, genus, family",
      slides: [
        {
          kind: "cover",
          eyebrow: "Section 1.2 · Part A",
          title: "Taxonomic hierarchy: species, genus, family",
          sub: "Category, rank, taxon, and the three lowest categories with their NCERT examples.",
          say: ["Section 1.2, part A. Classification happens in ranked steps."],
        },
        {
          kind: "points",
          title: "Classification is a hierarchy",
          points: [
            "Classification is <b>not a single-step process</b>. It is a hierarchy of steps, each step a <b>rank or category</b>.",
            "Since the category is part of the overall taxonomic arrangement, it is called the <b>taxonomic category</b>.",
            "All categories together constitute the <b>taxonomic hierarchy</b>.",
            "Each category, a <b>unit of classification</b>, represents a rank and is commonly termed a <b>taxon</b> (pl.: taxa).",
          ],
          say: [
            "Classification goes step by step, and each step is a rank.",
            "Each rank is a taxonomic category.",
            "All the categories stacked together form the taxonomic hierarchy.",
            "A unit of classification at any rank is a taxon.",
          ],
        },
        {
          kind: "points",
          title: "Example: insects as a category",
          points: [
            "Insects share common features like <b>three pairs of jointed legs</b>.",
            "So insects are recognisable, concrete objects that can be classified, and were given a <b>rank or category</b>.",
            "Groups represent category; category denotes rank; each rank or taxon is a unit of classification.",
            "Taxonomic groups/categories are <b>distinct biological entities</b>, not merely morphological aggregates.",
          ],
          say: [
            "All insects have three pairs of jointed legs.",
            "That shared feature makes insects a real group with a rank.",
            "Group, category, rank and taxon are linked ideas.",
            "These groups are real biological entities, not just look-alike piles.",
          ],
        },
        {
          kind: "points",
          title: "The common categories",
          diagram: { type: "ladder" },
          points: [
            "Common categories: <b>kingdom, phylum or division (for plants), class, order, family, genus, species</b>.",
            "For all organisms, in both plant and animal kingdoms, <b>species is the lowest category</b>.",
            "To place an organism in categories, you need <b>knowledge of its characters</b>.",
            "Characters reveal similarities and dissimilarities among individuals of the same kind, and with other kinds.",
          ],
          say: [
            "Seven categories. Plants use 'division' where animals use 'phylum'.",
            "Species is always the lowest.",
            "Placement depends on knowing the organism's characters.",
            "Characters show what is similar and what differs, within a kind and across kinds.",
          ],
        },
        {
          kind: "points",
          title: "1.2.1 Species",
          points: [
            "A group of individual organisms with <b>fundamental similarities</b> is a <b>species</b>.",
            "One species can be distinguished from closely related species by <b>distinct morphological differences</b>.",
            I("Mangifera indica") + " (mango), " + I("Solanum tuberosum") + " (potato), " + I("Panthera leo") + " (lion): " + I("indica, tuberosum, leo") + " are <b>specific epithets</b>.",
            I("Mangifera, Solanum, Panthera") + " are <b>genera</b>, a higher level of taxon.",
            "Each genus may have one or more specific epithets for different organisms with morphological similarities: " + I("Panthera tigris") + "; " + I("Solanum nigrum") + " and " + I("S. melongena") + ".",
            "Human beings: species " + I("sapiens") + " in genus " + I("Homo") + " → " + I("Homo sapiens") + ".",
          ],
          say: [
            "A species is a group of individuals with fundamental similarities.",
            "It differs from close relatives in distinct body form.",
            "The second word of each name is the specific epithet.",
            "The first word is the genus, which is one level higher.",
            "One genus can hold several species: Panthera tigris, Solanum nigrum, Solanum melongena.",
            "And we are Homo sapiens.",
          ],
        },
        {
          kind: "points",
          title: "1.2.2 Genus",
          diagram: {
            type: "tree",
            root: {
              label: "Two genera compared",
              children: [
                { label: "Panthera", italic: true, children: [{ label: "P. leo", italic: true, sub: "lion" }, { label: "P. pardus", italic: true, sub: "leopard" }, { label: "P. tigris", italic: true, sub: "tiger" }] },
                { label: "Solanum", italic: true, children: [{ label: "S. tuberosum", italic: true, sub: "potato" }, { label: "S. melongena", italic: true, sub: "brinjal" }, { label: "S. nigrum", italic: true }] },
              ],
            },
          },
          points: [
            "<b>Genus</b>: a group of related species with <b>more characters in common</b> than species of other genera.",
            "Genera are <b>aggregates of closely related species</b>.",
            "Potato and brinjal are different species but both belong to genus " + I("Solanum") + ".",
            "Lion (" + I("Panthera leo") + "), leopard (" + I("P. pardus") + ") and tiger (" + I("P. tigris") + ") share several features, so all belong to genus " + I("Panthera") + ".",
            I("Panthera") + " differs from another genus, " + I("Felis") + ", which includes <b>cats</b>.",
          ],
          say: [
            "A genus groups related species that share more characters with each other than with other genera.",
            "Genera are aggregates of closely related species.",
            "Potato and brinjal are both Solanum.",
            "Lion, leopard and tiger are all Panthera.",
            "Cats are in a different genus, Felis.",
          ],
        },
        {
          kind: "points",
          title: "1.2.3 Family",
          diagram: {
            type: "tree",
            root: {
              label: "Families",
              children: [
                { label: "Solanaceae", children: [{ label: "Solanum", italic: true }, { label: "Petunia", italic: true }, { label: "Datura", italic: true }] },
                { label: "Felidae", children: [{ label: "Panthera", italic: true, sub: "lion, tiger, leopard" }, { label: "Felis", italic: true, sub: "cats" }] },
                { label: "Canidae", children: [{ label: "dog", sub: "separate family" }] },
              ],
            },
          },
          points: [
            "<b>Family</b>: a group of related genera with <b>still fewer similarities</b> than genus and species.",
            "Plant families are characterised on both <b>vegetative and reproductive features</b>.",
            "Plants: " + I("Solanum, Petunia") + " and " + I("Datura") + " are placed in family <b>Solanaceae</b>.",
            "Animals: genus " + I("Panthera") + " (lion, tiger, leopard) is put with genus " + I("Felis") + " (cats) in family <b>Felidae</b>.",
            "A cat and a dog share some similarities and some differences, so they are in separate families: <b>Felidae and Canidae</b>.",
          ],
          say: [
            "A family groups related genera. They share fewer features than members of one genus do.",
            "For plants, families use both vegetative and reproductive features.",
            "Solanum, Petunia and Datura are all Solanaceae.",
            "Panthera and Felis are both Felidae.",
            "Cats are Felidae, and dogs are Canidae.",
          ],
        },
        {
          kind: "points",
          extra: true,
          title: "NEET traps: species to family",
          points: [
            "Brinjal is " + I("Solanum melongena") + ". It is in the same genus as potato and the same family as " + I("Datura") + " and " + I("Petunia") + ".",
            "Leopard is " + I("Panthera pardus") + ", not " + I("Felis") + ".",
            "Family names end in <b>-aceae</b> in plants (Solanaceae) and <b>-idae</b> in animals (Felidae, Canidae, Hominidae, Muscidae).",
            "Abbreviating the genus (" + I("P. tigris") + ") is allowed once the full name has appeared.",
          ],
          say: [
            "Brinjal, potato, Datura and Petunia all share family Solanaceae.",
            "Leopard belongs to Panthera.",
            "Use the endings: -aceae is a plant family, -idae is an animal family.",
            "Abbreviate the genus only after it has been written in full.",
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────── 6
    {
      id: "06-order-to-kingdom",
      short: "1.2 Order to kingdom & Table 1.1",
      title: "1.2 Taxonomic Categories: order, class, phylum, kingdom",
      slides: [
        {
          kind: "cover",
          eyebrow: "Section 1.2 · Part B",
          title: "Order, class, phylum, kingdom & Table 1.1",
          sub: "Higher categories, Figure 1.1, and the full classification of man, housefly, mango and wheat.",
          say: ["Section 1.2, part B. Now the higher categories, and the table NEET loves."],
        },
        {
          kind: "points",
          title: "1.2.4 Order",
          diagram: {
            type: "tree",
            root: {
              label: "Orders",
              children: [
                { label: "Polymoniales", sub: "floral characters", children: [{ label: "Convolvulaceae" }, { label: "Solanaceae" }] },
                { label: "Carnivora", children: [{ label: "Felidae" }, { label: "Canidae" }] },
              ],
            },
          },
          points: [
            "Species, genus and family are based on a <b>number of similar characters</b>.",
            "Order and other higher categories are identified based on the <b>aggregates of characters</b>.",
            "<b>Order</b>: an assemblage of families that show <b>a few similar characters</b>, fewer than among the genera of one family.",
            "Plant families <b>Convolvulaceae</b> and <b>Solanaceae</b> are in order <b>Polymoniales</b>, mainly based on <b>floral characters</b>.",
            "Animal order <b>Carnivora</b> includes families <b>Felidae</b> and <b>Canidae</b>.",
          ],
          say: [
            "Lower categories use many similar characters.",
            "Higher categories look at aggregates, or combinations, of characters.",
            "An order groups families that share only a few characters.",
            "Convolvulaceae and Solanaceae are in Polymoniales, grouped mainly by their flowers.",
            "Cats and dogs meet again in order Carnivora.",
          ],
        },
        {
          kind: "points",
          title: "1.2.5 Class",
          diagram: {
            type: "tree",
            root: {
              label: "Class Mammalia",
              children: [
                { label: "Order Primata", children: [{ label: "monkey" }, { label: "gorilla" }, { label: "gibbon" }] },
                { label: "Order Carnivora", children: [{ label: "tiger" }, { label: "cat" }, { label: "dog" }] },
                { label: "Other orders", sub: "Mammalia has more" },
              ],
            },
          },
          points: [
            "<b>Class</b>: includes related orders.",
            "Order <b>Primata</b> (monkey, gorilla, gibbon) is placed in class <b>Mammalia</b>.",
            "It sits there along with order <b>Carnivora</b> (tiger, cat, dog).",
            "Class Mammalia has <b>other orders</b> also.",
          ],
          say: [
            "A class groups related orders.",
            "Monkeys, gorillas and gibbons are order Primata, in class Mammalia.",
            "Carnivora is in Mammalia too.",
            "Mammalia has more orders than these two.",
          ],
        },
        {
          kind: "points",
          title: "1.2.6 Phylum",
          diagram: {
            type: "tree",
            root: {
              label: "Chordata",
              sub: "notochord + dorsal hollow neural system",
              children: [
                { label: "Fishes" },
                { label: "Amphibians" },
                { label: "Reptiles" },
                { label: "Birds" },
                { label: "Mammalia", children: [{ label: "Primata", sub: "monkey, gorilla, gibbon" }, { label: "Carnivora", sub: "tiger, cat, dog" }] },
              ],
            },
          },
          points: [
            "Classes of <b>fishes, amphibians, reptiles, birds and mammals</b> form the next higher category, the <b>phylum</b>.",
            "Their common features are the presence of a <b>notochord</b> and a <b>dorsal hollow neural system</b>, so they are in phylum <b>Chordata</b>.",
            "In plants, classes with a few similar characters are assigned to a higher category called <b>Division</b>.",
          ],
          say: [
            "Fishes, amphibians, reptiles, birds and mammals are classes in one phylum.",
            "They all have a notochord and a dorsal hollow neural system: phylum Chordata.",
            "In plants, the same level is called division.",
          ],
        },
        {
          kind: "points",
          title: "1.2.7 Kingdom",
          points: [
            "All animals belonging to various phyla are assigned to the highest category, <b>Kingdom Animalia</b>.",
            "<b>Kingdom Plantae</b> is distinct and comprises all plants from various divisions.",
            "These two are referred to as the <b>animal and plant kingdoms</b>.",
            "Figure 1.1 shows the categories from species to kingdom in <b>ascending order</b>.",
            "These are broad categories. Taxonomists have also developed <b>sub-categories</b> for more sound and scientific placement of taxa.",
          ],
          say: [
            "Kingdom is the highest category. All animal phyla make Kingdom Animalia.",
            "All plant divisions make Kingdom Plantae.",
            "We call them the animal and plant kingdoms.",
            "Figure 1.1 lists the ranks bottom-up, from species to kingdom.",
            "Sub-categories also exist between the main ranks.",
          ],
        },
        {
          kind: "points",
          title: "Figure 1.1: what changes as you go up",
          diagram: { type: "ladder", trend: true },
          points: [
            "From species up to kingdom, the number of <b>common characteristics decreases</b>.",
            "The <b>lower</b> the taxon, the <b>more</b> characteristics its members share.",
            "The <b>higher</b> the category, the <b>greater the difficulty</b> of determining its relationship to other taxa at the same level.",
            "So the problem of classification becomes <b>more complex</b> at higher levels.",
          ],
          say: [
            "Going up the ladder, fewer characteristics are shared.",
            "Members of a species share the most.",
            "At high levels, relating one taxon to another is hard.",
            "That's why classification gets more complex as you go up.",
          ],
        },
        {
          kind: "points",
          title: "Table 1.1: organisms with their taxonomic categories",
          diagram: { type: "table11" },
          points: [],
          say: ["Table 1.1 in full. Read each column from top to bottom: man, housefly, mango, wheat. Pause the video and memorise it."],
        },
        {
          kind: "points",
          extra: true,
          title: "NEET traps from Table 1.1",
          points: [
            "Housefly: order <b>Diptera</b>, family <b>Muscidae</b>, class <b>Insecta</b>, phylum <b>Arthropoda</b>.",
            "Mango: family <b>Anacardiaceae</b>, order <b>Sapindales</b> (not Polymoniales).",
            "Wheat: family <b>Poaceae</b>, order <b>Poales</b>, class <b>Monocotyledonae</b>.",
            "Mango and wheat share only the division <b>Angiospermae</b> (a division, since they are plants).",
            "Man: family <b>Hominidae</b>, order <b>Primata</b>, class <b>Mammalia</b>, phylum <b>Chordata</b>.",
            "Mnemonic, top-down: <b>K</b>ing <b>P</b>hilip <b>C</b>ame <b>O</b>ver <b>F</b>or <b>G</b>ood <b>S</b>oup. Read it backwards for Figure 1.1’s ascending order.",
          ],
          say: [
            "Housefly: Diptera, Muscidae, Insecta, Arthropoda.",
            "Mango is in order Sapindales. Polymoniales is the order of Solanaceae, a common mix-up.",
            "Wheat is a monocot in Poaceae and Poales.",
            "Mango and wheat meet only at Angiospermae.",
            "Man: Hominidae, Primata, Mammalia, Chordata.",
            "Use King Philip Came Over For Good Soup.",
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────── 7
    {
      id: "07-summary-exercises",
      short: "Summary, exercises & MCQs",
      title: "Summary, NCERT exercises and NEET practice",
      slides: [
        {
          kind: "cover",
          eyebrow: "Revision",
          title: "Summary, exercises & practice",
          sub: "The NCERT summary, all 10 end-of-chapter exercises with model answers, and NEET-style MCQs.",
          say: ["Time to revise. First the NCERT summary, then all ten exercises, then practice questions."],
        },
        {
          kind: "points",
          title: "Summary (NCERT)",
          points: [
            "The living world is rich in variety. Millions of plants and animals have been identified and described, but a large number <b>still remain unknown</b>.",
            "The range of organisms in size, colour, habitat, physiological and morphological features makes us seek the <b>defining characteristics</b> of living organisms.",
            "Biologists have evolved rules and principles for <b>identification, nomenclature and classification</b>. This branch is <b>taxonomy</b>.",
            "Taxonomic studies are useful in <b>agriculture, forestry, industry</b>, and for knowing our <b>bio-resources</b> and their diversity.",
          ],
          say: [
            "Many organisms are known, and many more are not.",
            "Their variety pushes us to define what living means.",
            "Rules for identifying, naming and classifying make up taxonomy.",
            "Taxonomy helps agriculture, forestry, industry, and our understanding of bio-resources.",
          ],
        },
        {
          kind: "points",
          title: "Summary (NCERT), continued",
          points: [
            "Identification, naming and classification are universally evolved under <b>international codes</b>.",
            "Based on resemblances and distinct differences, each organism gets a correct two-word name under the <b>binomial system</b>.",
            "An organism occupies a place in the system of classification. The many categories/ranks are <b>taxonomic categories or taxa</b>, and together they form the <b>taxonomic hierarchy</b>.",
          ],
          say: [
            "International codes govern it.",
            "Every organism gets a binomial name.",
            "And each organism has a place in the taxonomic hierarchy.",
          ],
        },
        {
          kind: "qa", q: "Ex 1. Why are living organisms classified?",
          a: [
            "It is nearly impossible to study all organisms (1.7–1.8 million known species) one by one.",
            "Classification groups them into convenient categories based on easily observable characters, so studying them becomes possible.",
            "It brings out similarities, differences and relationships, helps identification, and helps us use bio-resources in agriculture, forestry and industry.",
          ],
        },
        {
          kind: "qa", q: "Ex 2. Why are the classification systems changing every now and then?",
          a: [
            "New organisms are continuously being identified, in new areas and even old ones.",
            "New information keeps arriving on external and internal structure, cell structure, development and ecology, which are the basis of modern taxonomy.",
            "Systematics also considers evolutionary relationships. As understanding improves, groups are revised and sub-categories added for sounder placement.",
          ],
        },
        {
          kind: "qa", q: "Ex 3. What different criteria would you choose to classify people that you meet often?",
          a: [
            "Use easily observable characters, as in classification: age group, gender, height, language spoken.",
            "Or relationship and role: family, friends, classmates, teachers, neighbours; profession; where they live.",
            "Criteria can be nested into a hierarchy, e.g. school → class → section → students.",
          ],
        },
        {
          kind: "qa", q: "Ex 4. What do we learn from identification of individuals and populations?",
          a: [
            "Correct description and identification come first; only then can the correct scientific name be attached.",
            "We learn similarities and dissimilarities within a kind and with other kinds, which lets us place the organism in the right taxonomic category.",
            "It reveals biodiversity: which species exist, new species, and our bio-resources.",
          ],
        },
        {
          kind: "qa", q: "Ex 5. Identify the correctly written scientific name of mango: <i>Mangifera Indica</i> or <i>Mangifera indica</i>?",
          a: [
            "<b><i>Mangifera indica</i></b> is correct.",
            "The genus starts with a capital letter and the specific epithet with a small letter, both in italics (or each underlined separately when handwritten).",
          ],
        },
        {
          kind: "qa", q: "Ex 6. Define a taxon. Give some examples of taxa at different hierarchical levels.",
          a: [
            "A <b>taxon</b> is a unit of classification. Each category represents a rank and is termed a taxon (pl. taxa).",
            "Examples for the lion: Kingdom Animalia → Phylum Chordata → Class Mammalia → Order Carnivora → Family Felidae → Genus <i>Panthera</i> → Species <i>Panthera leo</i>.",
            "Everyday taxa from NCERT: ‘plants’, ‘animals’, ‘mammals’, ‘dogs’, ‘wheat’.",
          ],
        },
        {
          kind: "qa", q: "Ex 7. Identify the correct sequence of taxonomical categories: (a) Species Order Phylum Kingdom (b) Genus Species Order Kingdom (c) Species Genus Order Phylum",
          a: [
            "(b) is wrong: genus cannot come before species in ascending order.",
            "(a) and (c) both follow the correct ascending order (each skips some ranks).",
            "(c) is the usual textbook answer: Species → Genus → Order → Phylum.",
          ],
        },
        {
          kind: "qa", q: "Ex 8. Collect the accepted meanings of ‘species’. How does it differ for higher plants and animals versus bacteria?",
          a: [
            "NCERT (taxonomic/morphological): a group of individuals with fundamental similarities, distinguished from related species by distinct morphological differences.",
            "Biological species (pioneered by Ernst Mayr): a group of populations that can interbreed and produce fertile offspring, reproductively isolated from others. This works for sexually reproducing plants and animals.",
            "Bacteria reproduce asexually, so interbreeding cannot define them. Species are defined by shape, biochemistry and genetic (DNA) similarity instead. [Beyond NCERT detail]",
          ],
        },
        {
          kind: "qa", q: "Ex 9. Define: (i) Phylum (ii) Class (iii) Family (iv) Order (v) Genus",
          a: [
            "<b>Phylum</b>: classes sharing common features, e.g. Chordata (notochord, dorsal hollow neural system). Called <b>Division</b> in plants.",
            "<b>Class</b>: a group of related orders, e.g. Mammalia (Primata + Carnivora).",
            "<b>Order</b>: an assemblage of families with a few similar characters, e.g. Carnivora (Felidae + Canidae); Polymoniales.",
            "<b>Family</b>: a group of related genera, e.g. Solanaceae (<i>Solanum, Petunia, Datura</i>); Felidae.",
            "<b>Genus</b>: a group of related species with more characters in common, e.g. <i>Panthera</i> (lion, tiger, leopard).",
          ],
        },
        {
          kind: "qa", q: "Ex 10. Illustrate the taxonomical hierarchy with suitable examples of a plant and an animal.",
          a: [
            "<b>Mango</b>: Plantae → Angiospermae → Dicotyledonae → Sapindales → Anacardiaceae → <i>Mangifera</i> → <i>Mangifera indica</i>.",
            "<b>Man</b>: Animalia → Chordata → Mammalia → Primata → Hominidae → <i>Homo</i> → <i>Homo sapiens</i>.",
          ],
        },
      ],
    },
  ],

  // NEET-style MCQs (Beyond NCERT format; facts from the chapter).
  // balance() moves each correct option to a fixed A/B/C/D spread so letters can't be guessed.
  mcq: balance([
    { q: "The number of species that are known and described ranges between", o: ["1.7–1.8 million", "17–18 million", "1.7–1.8 thousand", "7–8 million"], a: 0, why: "NCERT: 1.7–1.8 million known and described species." },
    { q: "Which is the correctly written scientific name of mango?", o: ["<i>Mangifera Indica</i>", "<i>Mangifera indica</i>", "<i>mangifera indica</i>", "Mangifera indica (not italicised, not underlined)"], a: 1, why: "Genus capitalised, epithet lower-case, italics in print." },
    { q: "Scientific names of plants are based on principles provided in", o: ["ICZN", "ICBN", "Systema Naturae", "Table 1.1"], a: 1, why: "International Code for Botanical Nomenclature is for plants; ICZN is for animals." },
    { q: "Binomial nomenclature was given by", o: ["Ernst Mayr", "Charles Darwin", "Carolus Linnaeus", "A. P. de Candolle"], a: 2, why: "Linnaeus gave the two-word naming system." },
    { q: "In <i>Mangifera indica</i> Linn., ‘Linn.’ indicates that", o: ["the plant grows in Linnaeus’s garden", "the species was first described by Linnaeus", "it is the genus name", "it is the family name"], a: 1, why: "The abbreviated author name after the epithet shows who first described the species." },
    { q: "The lowest taxonomic category for all organisms is", o: ["Genus", "Family", "Species", "Variety"], a: 2, why: "Species is the lowest category in both plant and animal kingdoms." },
    { q: "<i>Solanum</i>, <i>Petunia</i> and <i>Datura</i> are placed in the family", o: ["Convolvulaceae", "Solanaceae", "Anacardiaceae", "Poaceae"], a: 1, why: "NCERT 1.2.3." },
    { q: "Convolvulaceae and Solanaceae are included in order Polymoniales mainly on the basis of", o: ["Vegetative characters", "Root characters", "Floral characters", "Seed colour"], a: 2, why: "NCERT 1.2.4: mainly floral characters." },
    { q: "Leopard is scientifically named", o: ["<i>Felis pardus</i>", "<i>Panthera pardus</i>", "<i>Panthera tigris</i>", "<i>Panthera leo</i>"], a: 1, why: "Lion, leopard and tiger are all <i>Panthera</i>." },
    { q: "Order Primata includes", o: ["Tiger, cat, dog", "Monkey, gorilla, gibbon", "Lion, leopard, tiger", "Housefly"], a: 1, why: "NCERT 1.2.5. Tiger, cat and dog are Carnivora." },
    { q: "According to NCERT, phylum Chordata is characterised by", o: ["Three pairs of jointed legs", "External ears and body hair", "Notochord and dorsal hollow neural system", "Floral characters"], a: 2, why: "NCERT 1.2.6." },
    { q: "In plants, the category equivalent to phylum is", o: ["Class", "Division", "Order", "Kingdom"], a: 1, why: "Classes with a few similar characters are assigned to a division." },
    { q: "Housefly belongs to order", o: ["Muscidae", "Insecta", "Diptera", "Arthropoda"], a: 2, why: "Muscidae is the family, Insecta the class, Arthropoda the phylum." },
    { q: "Mango belongs to family", o: ["Anacardiaceae", "Poaceae", "Solanaceae", "Hominidae"], a: 0, why: "Table 1.1: Mango → Anacardiaceae, order Sapindales." },
    { q: "Wheat belongs to class", o: ["Dicotyledonae", "Monocotyledonae", "Poales", "Angiospermae"], a: 1, why: "Poales is the order and Angiospermae the division." },
    { q: "Going from species to kingdom, the number of common characteristics", o: ["Increases", "Decreases", "Remains the same", "First increases, then decreases"], a: 1, why: "Lower the taxon, more the shared characteristics." },
    { q: "Which branch takes evolutionary relationships between organisms into account?", o: ["Nomenclature", "Identification", "Systematics", "Characterisation"], a: 2, why: "Systematics (from ‘systema’) includes evolutionary relationships." },
    { q: "Earliest classifications by human beings were based on", o: ["Evolutionary relationships", "Uses of organisms", "Cell structure", "Floral characters"], a: 1, why: "Food, clothing and shelter needs led to use-based classification." },
    { q: "‘The Darwin of the 20th century’ who pioneered the biological species definition is", o: ["Carolus Linnaeus", "Ernst Mayr", "R. H. Whittaker", "Charles Darwin"], a: 1, why: "Ernst Mayr, 1904–2004." },
    { q: "Which is NOT a basic process of taxonomy per NCERT?", o: ["Characterisation", "Identification", "Hybridisation", "Nomenclature"], a: 2, why: "The four processes are characterisation, identification, classification and nomenclature." },
  ]),

  glossary: [
    ["Biology", "Science of life forms and living processes."],
    ["Biodiversity", "Number and types of organisms present on earth."],
    ["Species", "Group of individual organisms with fundamental similarities; the lowest category."],
    ["Nomenclature", "Standardised naming so an organism has the same name all over the world."],
    ["Identification", "Describing an organism correctly so we know which organism a name is attached to."],
    ["ICBN", "International Code for Botanical Nomenclature (plants)."],
    ["ICZN", "International Code of Zoological Nomenclature (animals)."],
    ["Binomial nomenclature", "Two-component name: generic name + specific epithet (Linnaeus)."],
    ["Classification", "Grouping into convenient categories based on easily observable characters."],
    ["Taxon (taxa)", "Unit of classification; a category representing a rank."],
    ["Taxonomy", "Classifying organisms into taxa based on characteristics; involves characterisation, identification, classification, nomenclature."],
    ["Systematics", "From Latin ‘systema’. Study of diversity and relationships, including evolutionary relationships."],
    ["Taxonomic category", "A rank that is part of the overall taxonomic arrangement."],
    ["Taxonomic hierarchy", "All taxonomic categories together."],
    ["Genus", "Group of related species with more characters in common than species of other genera."],
    ["Family", "Group of related genera, based on vegetative and reproductive features in plants."],
    ["Order", "Assemblage of families showing a few similar characters."],
    ["Class", "Group of related orders."],
    ["Phylum", "Group of classes with common features (Division in plants)."],
    ["Kingdom", "Highest category: Animalia, Plantae."],
    ["Anthropocentric", "Human-centred view of biology; led to limited progress."],
  ],
};
