// NCERT Class 11 Biology, Chapter 10: Cell Cycle and Cell Division (kebo110.pdf)
// Same schema as ch01.mjs, plus:
//   say[]   spoken narration per video step (also the on-screen captions)
//   anim    { scene, states[] } animated diagram; states[i] is shown at step i
// Scenes and state names live in templates/cellanim.js.

const G = (n) => `G<sub>${n}</sub>`;

const SPREAD = [2, 0, 3, 1, 0, 2, 1, 3, 3, 1, 2, 0, 1, 3, 0, 2, 0, 3, 2, 1];
function balance(list) {
  return list.map((m, i) => {
    const o = m.o.slice(), t = SPREAD[i % SPREAD.length];
    [o[m.a], o[t]] = [o[t], o[m.a]];
    return { ...m, o, a: t };
  });
}

export default {
  chapter: "Chapter 10 · Cell Cycle and Cell Division",
  short: "Cell Cycle and Cell Division",
  book: "NCERT Biology · Class XI · Unit 3",
  source: "https://ncert.nic.in/textbook/pdf/kebo110.pdf",
  specimen: "STAGE <i>Metaphase</i> · Ch 10",
  topics: [
    // ─────────────────────────────────────────────── 1
    {
      id: "01-cell-cycle-intro",
      short: "10.1 What is the cell cycle?",
      slides: [
        {
          kind: "cover",
          eyebrow: "Chapter 10 · Opening",
          title: "Cell Cycle and Cell Division",
          sub: "How one cell becomes millions: the cell cycle, mitosis and meiosis.",
          say: ["Welcome to Chapter 10, Cell Cycle and Cell Division. The chapter has five sections: the cell cycle, M phase, the significance of mitosis, meiosis, and the significance of meiosis. Let's begin with a simple question: how does one cell become a whole organism?"],
        },
        {
          kind: "points",
          title: "One cell to millions",
          anim: { scene: "cell", states: ["interphase", "interphase", "cyto-animal", "cyto-animal", "syncytium4"], still: "cyto-animal" },
          points: [
            "All organisms, even the largest, start their life from a <b>single cell</b>.",
            "<b>Growth and reproduction</b> are characteristics of cells, indeed of all living organisms.",
            "All cells reproduce by <b>dividing into two</b>: each parental cell gives rise to <b>two daughter cells</b> each time it divides.",
            "Daughter cells can themselves grow and divide, forming a new <b>cell population</b> from a single parental cell and its progeny.",
            "Such cycles of <b>growth and division</b> let a single cell form a structure of millions of cells.",
          ],
          say: [
            "Every organism, even the largest, starts life as a single cell.",
            "Growth and reproduction are characteristics of cells, and of all living organisms.",
            "Cells reproduce by dividing into two. Each parent cell gives rise to two daughter cells every time it divides.",
            "These daughter cells can grow and divide again, so one parent cell and its progeny build a whole new cell population.",
            "Repeat these cycles of growth and division, and a single cell becomes a structure of millions of cells.",
          ],
        },
        {
          kind: "points",
          title: "10.1 Cell cycle: definition",
          anim: { scene: "wheel", states: ["all", "all", "all", "S", "M"], still: "all" },
          points: [
            "Cell division is a very important process in all living organisms.",
            "During division, <b>DNA replication</b> and <b>cell growth</b> also take place. All three must be <b>coordinated</b> so progeny cells get <b>intact genomes</b>.",
            "<b>Cell cycle</b>: the sequence of events by which a cell <b>duplicates its genome</b>, <b>synthesises</b> the other constituents of the cell and eventually <b>divides into two daughter cells</b>.",
            "Cell growth (cytoplasmic increase) is <b>continuous</b>, but <b>DNA synthesis occurs only during one specific stage</b> of the cell cycle.",
            "Replicated chromosomes (DNA) are distributed to daughter nuclei by a complex series of events during cell division. These events are under <b>genetic control</b>.",
          ],
          say: [
            "Cell division is a very important process in every living organism.",
            "While a cell divides, it also replicates its DNA and grows. These three processes must be coordinated, so that each daughter cell receives an intact genome.",
            "So here is the definition. The cell cycle is the sequence of events by which a cell duplicates its genome, synthesises its other constituents, and finally divides into two daughter cells.",
            "Notice the contrast. Cell growth, meaning increase in cytoplasm, is continuous. But DNA synthesis happens only in one specific stage of the cycle.",
            "The replicated chromosomes are then shared between the daughter nuclei through a complex series of events, and all of these events are under genetic control.",
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────── 2
    {
      id: "02-phases-of-cell-cycle",
      short: "10.1.1 Phases: interphase & M phase",
      slides: [
        {
          kind: "cover",
          eyebrow: "Section 10.1.1",
          title: "Phases of the cell cycle",
          sub: "Interphase and M phase, G1, S and G2, and how DNA content changes.",
          say: ["Section 10.1.1, the phases of the cell cycle. We'll see how long the cycle takes, what interphase really does, and how DNA content changes."],
        },
        {
          kind: "points",
          title: "How long is one cell cycle?",
          anim: { scene: "wheel", states: ["all", "all", "all"] },
          points: [
            "A typical eukaryotic cell cycle is illustrated by <b>human cells in culture</b>. They divide about <b>once every 24 hours</b> (Figure 10.1).",
            "This duration varies from <b>organism to organism</b> and from <b>cell type to cell type</b>.",
            "<b>Yeast</b> can progress through the cell cycle in only about <b>90 minutes</b>.",
          ],
          say: [
            "A typical eukaryotic cell cycle is shown by human cells growing in culture. They divide roughly once every twenty-four hours.",
            "But this duration is not fixed. It varies between organisms, and between cell types.",
            "Yeast, for example, can complete its cell cycle in only about ninety minutes.",
          ],
        },
        {
          kind: "points",
          title: "Two basic phases",
          anim: { scene: "wheel", states: ["interphase", "M", "M", "interphase", "M"], still: "interphase" },
          points: [
            "The cell cycle has two basic phases: <b>Interphase</b> and <b>M phase (Mitosis phase)</b>.",
            "<b>M phase</b>: when the actual cell division or mitosis occurs.",
            "<b>Interphase</b>: the phase <b>between two successive M phases</b>.",
            "In a 24-hour human cell cycle, cell division proper lasts only <b>about an hour</b>. Interphase lasts <b>more than 95%</b> of the cycle.",
            "M phase starts with <b>karyokinesis</b> (nuclear division, separation of daughter chromosomes) and usually ends with <b>cytokinesis</b> (division of cytoplasm).",
          ],
          say: [
            "The cycle has just two basic phases: interphase and M phase, the mitosis phase.",
            "M phase is when the actual division, mitosis, takes place.",
            "Interphase is everything between two successive M phases.",
            "And here's a number NEET loves. In a twenty-four hour human cell cycle, division itself lasts only about one hour. Interphase takes more than ninety-five percent of the time.",
            "M phase begins with karyokinesis, the division of the nucleus where daughter chromosomes separate, and usually ends with cytokinesis, the division of the cytoplasm.",
          ],
        },
        {
          kind: "points",
          title: "Interphase is not really ‘resting’",
          anim: { scene: "wheel", states: ["interphase", "G1", "S", "G2"] },
          points: [
            "Interphase is called the <b>resting phase</b>, but the cell is <b>preparing for division</b>: cell growth and DNA replication happen in an orderly manner.",
            "It has three phases: " + G(1) + " phase (<b>Gap 1</b>),",
            "<b>S phase</b> (<b>Synthesis</b>),",
            "and " + G(2) + " phase (<b>Gap 2</b>).",
          ],
          say: [
            "Interphase is often called the resting phase, but the cell is anything but resting. It is preparing for division, growing and replicating its DNA in an orderly way.",
            "Interphase has three parts. First, G one, which stands for gap one.",
            "Then S phase, which stands for synthesis.",
            "And finally G two, gap two.",
          ],
        },
        {
          kind: "points",
          title: G(1) + ", S and " + G(2) + " in detail",
          anim: { scene: "graph", states: ["dna-G1", "dna-S", "dna-S", "dna-S", "dna-G2"] },
          points: [
            G(1) + ": the interval between mitosis and initiation of DNA replication. The cell is <b>metabolically active</b> and <b>continuously grows</b>, but does <b>not replicate its DNA</b>.",
            "<b>S phase</b>: DNA synthesis or <b>replication</b> takes place. The amount of DNA per cell <b>doubles</b>: <b>2C → 4C</b>.",
            "But there is <b>no increase in chromosome number</b>: a diploid (<b>2n</b>) cell at " + G(1) + " is still <b>2n</b> after S phase.",
            "In <b>animal cells</b>, during S phase DNA replication begins in the <b>nucleus</b> and the <b>centriole duplicates</b> in the <b>cytoplasm</b>.",
            G(2) + ": <b>proteins are synthesised</b> in preparation for mitosis while <b>cell growth continues</b>.",
          ],
          say: [
            "G one is the gap between mitosis and the start of DNA replication. The cell is metabolically active and keeps growing, but it does not copy its DNA yet.",
            "In S phase, DNA is replicated, so the DNA content per cell doubles. If we call the starting amount two C, it becomes four C.",
            "But careful: the chromosome number does not change. A diploid cell, two n, at G one is still two n after S phase. Each chromosome now simply has two chromatids.",
            "In animal cells, while DNA replicates in the nucleus during S phase, the centriole duplicates out in the cytoplasm.",
            "In G two, the cell synthesises proteins needed for mitosis, and it continues to grow.",
          ],
        },
        {
          kind: "qa",
          q: "In-text question: How do plants and animals keep growing all their lives? Which tissues in higher plants have cells that divide all their life? Do animals have them?",
          a: [
            "Not all cells divide all the time. Growth continues because some cells keep dividing by mitosis.",
            "In higher plants these are the <b>meristematic tissues</b>: <b>apical meristems</b> at root and shoot tips and the <b>lateral meristems</b> (vascular cambium, cork cambium).",
            "Animals have <b>no meristems</b>. Growth is limited, but some cells keep dividing to replace lost ones, e.g. skin, gut lining and blood cells (stem cells, beyond NCERT).",
          ],
          say: ["Pause and think. How do plants keep growing all their lives, and which tissues make that possible?", "Not every cell divides. Growth continues because a few groups of cells keep dividing.", "In higher plants, these are meristems: apical meristems at the tips of roots and shoots, and lateral meristems like the vascular cambium and cork cambium.", "Animals don't have meristems. But some animal cells keep dividing to replace lost cells, like those of the skin, the gut lining and blood."],
        },
        {
          kind: "qa",
          q: "In-text question: Onion root tip cells have 16 chromosomes. How many chromosomes at G1, after S and after M? If DNA after M is 2C, what is it at G1, after S and at G2?",
          a: [
            "Chromosomes: <b>16 at " + G(1) + "</b>, <b>16 after S</b> (each now has two chromatids), <b>16 after M</b> in each daughter cell.",
            "DNA: <b>2C at " + G(1) + "</b>, <b>4C after S</b>, <b>4C at " + G(2) + "</b>, back to <b>2C</b> after M.",
          ],
          say: ["Here's a favourite numerical. Onion root tip cells have sixteen chromosomes. Try it yourself first.", "The chromosome number stays sixteen at G one, after S phase, and after M phase in each daughter cell, because S phase doesn't change the number of chromosomes.", "But DNA content changes. It's two C at G one, four C after S and at G two, and back to two C after mitosis."],
        },
      ],
    },

    // ─────────────────────────────────────────────── 3
    {
      id: "03-g0-and-who-divides",
      short: "G0 & who divides by mitosis",
      slides: [
        {
          kind: "cover",
          eyebrow: "Section 10.1.1 · continued",
          title: "G0, and which cells divide by mitosis",
          sub: "The quiescent stage, and mitosis in haploid and diploid cells.",
          say: ["Still in section 10.1.1. Now, what about cells that stop dividing? And which cells divide by mitosis at all?"],
        },
        {
          kind: "points",
          title: "Quiescent stage: " + G(0),
          anim: { scene: "wheel", states: ["all", "all", "G0", "G0"] },
          points: [
            "Some cells in adult animals <b>do not appear to divide</b>, e.g. <b>heart cells</b>.",
            "Many other cells divide only occasionally, to <b>replace cells lost</b> through injury or cell death.",
            "Cells that do not divide further <b>exit " + G(1) + "</b> and enter an inactive stage called the <b>quiescent stage (" + G(0) + ")</b>.",
            "Cells in " + G(0) + " remain <b>metabolically active</b> but no longer <b>proliferate</b> unless called on to do so, depending on the organism’s requirement.",
          ],
          say: [
            "Some cells in adult animals don't seem to divide at all. Heart cells are the classic example.",
            "Many other cells divide only now and then, to replace cells lost to injury or cell death.",
            "Cells that stop dividing leave the cycle from G one, and enter an inactive stage called the quiescent stage, or G zero.",
            "Remember this point: cells in G zero are still metabolically active. They simply don't proliferate, unless the organism needs them to.",
          ],
        },
        {
          kind: "points",
          title: "Who divides by mitosis?",
          anim: { scene: "cell", states: ["metaphase", "metaphase", "metaphase"] },
          points: [
            "In <b>animals</b>, mitotic cell division is seen only in <b>diploid somatic cells</b>.",
            "Exceptions: a few <b>haploid</b> cells divide by mitosis, for example in <b>male honey bees</b>.",
            "<b>Plants</b> show mitotic divisions in <b>both haploid and diploid</b> cells.",
          ],
          say: [
            "In animals, mitosis happens only in diploid somatic cells, the body cells.",
            "There are a few exceptions where haploid cells divide by mitosis. The NCERT example is male honey bees.",
            "Plants are different. They show mitosis in both haploid and diploid cells.",
          ],
        },
        {
          kind: "qa",
          q: "In-text question: Recall alternation of generations (Chapter 3). Name plant species and stages where mitosis occurs in haploid cells.",
          a: [
            "Haploid <b>gametophytes</b> grow by mitosis. Examples: algae such as <i>Spirogyra</i> and <i>Chlamydomonas</i> (haploid plant body).",
            "<b>Mosses</b> (e.g. <i>Funaria</i>): the dominant gametophyte. <b>Ferns</b>: the prothallus.",
            "<b>Flowering plants</b>: microspore → pollen grain divisions; the functional megaspore nucleus divides by mitosis to form the embryo sac.",
          ],
          say: ["Think back to alternation of generations. Where do haploid plant cells divide by mitosis?", "Wherever there is a haploid gametophyte. Algae like Spirogyra and Chlamydomonas have a haploid body.", "In mosses, the main plant body is the haploid gametophyte, and in ferns, the prothallus is haploid.", "Even in flowering plants, the pollen grain and the embryo sac form by mitosis in haploid cells."],
        },
        {
          kind: "points",
          extra: true,
          title: "NEET tip: " + G(0) + " and cell-cycle traps",
          points: [
            G(0) + " cells are <b>alive and metabolically active</b>, not dead or dormant in metabolism.",
            "Cells enter " + G(0) + " from <b>" + G(1) + "</b>, not from " + G(2) + ".",
            "S phase doubles <b>DNA (C)</b>, never chromosome number (<b>n</b>).",
            "Centriole duplication happens in <b>S phase</b> (cytoplasm). Protein synthesis for mitosis happens in <b>" + G(2) + "</b>.",
            "Interphase > 95% of the cycle. M phase is about 1 hour of 24.",
          ],
          say: ["Quick traps. G zero cells are alive and metabolically active.", "They exit from G one, not G two.", "S phase doubles DNA content, never the chromosome number.", "Centrioles duplicate in S phase; proteins for mitosis are made in G two.", "And interphase is over ninety-five percent of the cycle."],
        },
      ],
    },

    // ─────────────────────────────────────────────── 4
    {
      id: "04-prophase-metaphase",
      short: "10.2 M phase: prophase & metaphase",
      slides: [
        {
          kind: "cover",
          eyebrow: "Section 10.2 · Part A",
          title: "M phase: prophase & metaphase",
          sub: "Equational division, chromosome condensation, the mitotic apparatus and the metaphase plate.",
          say: ["Section 10.2, M phase. This is the most dramatic part of the cell cycle. Watch the chromosomes carefully."],
        },
        {
          kind: "points",
          title: "M phase: the big picture",
          anim: { scene: "cell", states: ["interphase", "metaphase", "anaphase-late", "telophase"] },
          points: [
            "The <b>most dramatic</b> period of the cell cycle, involving a major <b>reorganisation of virtually all components</b> of the cell.",
            "Parent and progeny cells have the <b>same number of chromosomes</b>, so mitosis is also called <b>equational division</b>.",
            "For convenience, karyokinesis is divided into four stages, but cell division is a <b>progressive process</b>; very clear-cut lines cannot be drawn between stages.",
            "Karyokinesis involves four stages: <b>Prophase, Metaphase, Anaphase, Telophase</b>.",
          ],
          say: [
            "M phase is the most dramatic period of the cell cycle. Almost every component of the cell is reorganised.",
            "Since the parent and daughter cells have the same number of chromosomes, mitosis is also called equational division.",
            "We split it into stages for convenience, but remember, division is a continuous, progressive process. There are no sharp lines between stages.",
            "Karyokinesis has four stages: prophase, metaphase, anaphase and telophase. Remember them as P, M, A, T.",
          ],
        },
        {
          kind: "points",
          title: "10.2.1 Prophase",
          anim: { scene: "cell", states: ["interphase", "prophase-early", "prophase-early", "prophase-late", "prophase-late"] },
          points: [
            "The <b>first stage</b> of karyokinesis; it follows the S and " + G(2) + " phases of interphase.",
            "In S and " + G(2) + ", the new DNA molecules are <b>not distinct but intertwined</b>. Prophase is marked by the <b>initiation of condensation</b> of chromosomal material, which becomes untangled (Figure 10.2 a).",
            "Chromosomal material condenses to form compact <b>mitotic chromosomes</b>, each of <b>two chromatids attached at the centromere</b>.",
            "The <b>centrosome</b>, duplicated during S phase, begins to move towards <b>opposite poles</b>. Each centrosome radiates microtubules called <b>asters</b>. Two asters plus spindle fibres form the <b>mitotic apparatus</b>.",
            "At the end of prophase, cells do <b>not show Golgi complexes, endoplasmic reticulum, nucleolus and nuclear envelope</b>.",
          ],
          say: [
            "Prophase is the first stage of karyokinesis. It comes right after the S and G two phases.",
            "During S and G two, the new DNA molecules are intertwined and not distinct. Prophase begins when this chromosomal material starts to condense and untangle.",
            "Watch the chromosomes become compact. Each mitotic chromosome is made of two chromatids, joined at the centromere.",
            "Meanwhile the centrosome, which duplicated in S phase, moves toward opposite poles. Each centrosome sends out microtubules called asters. The two asters with the spindle fibres form the mitotic apparatus.",
            "By the end of prophase, you can no longer see the Golgi complex, endoplasmic reticulum, nucleolus or nuclear envelope.",
          ],
        },
        {
          kind: "points",
          title: "10.2.2 Metaphase",
          anim: { scene: "cell", states: ["prophase-late", "metaphase", "metaphase", "metaphase", "metaphase"] },
          points: [
            "Starts with the <b>complete disintegration of the nuclear envelope</b>; chromosomes spread through the cytoplasm.",
            "Condensation is complete, so this is the stage at which <b>chromosome morphology is most easily studied</b>. Each chromosome has <b>two sister chromatids held by the centromere</b>.",
            "<b>Kinetochores</b>: small <b>disc-shaped structures</b> at the surface of centromeres; the sites where <b>spindle fibres attach</b>.",
            "All chromosomes come to lie at the <b>equator</b>; one chromatid is connected by its kinetochore to fibres from one pole, its sister to fibres from the opposite pole.",
            "The plane of alignment is the <b>metaphase plate</b>. Key features: <b>spindle fibres attach to kinetochores</b>; chromosomes move to the spindle equator and <b>align along the metaphase plate</b>.",
          ],
          say: [
            "Metaphase begins when the nuclear envelope completely disintegrates, so the chromosomes spread through the cytoplasm.",
            "Condensation is now complete. That makes metaphase the best stage to study the shape, or morphology, of chromosomes. Each one has two sister chromatids held together at the centromere.",
            "On the surface of each centromere are small disc-shaped structures called kinetochores. This is where spindle fibres attach.",
            "All the chromosomes line up at the equator. One chromatid is attached to fibres from one pole, and its sister is attached to fibres from the opposite pole.",
            "This plane of alignment is called the metaphase plate. So the two key features of metaphase are: spindle fibres attach to kinetochores, and chromosomes align on the metaphase plate.",
          ],
        },
        {
          kind: "points",
          extra: true,
          title: "NEET tip: prophase & metaphase",
          points: [
            "Mnemonic for the order: <b>P</b>lease <b>M</b>ake <b>A</b> <b>T</b>ea (Prophase, Metaphase, Anaphase, Telophase).",
            "Chromosome counting and karyotyping use <b>metaphase</b> chromosomes.",
            "<b>Colchicine</b> stops spindle formation and arrests cells at metaphase (beyond NCERT).",
            "Centrioles are <b>absent</b> in most higher plant cells, which still form a spindle (beyond NCERT).",
          ],
          say: ["To remember the order, say: Please Make A Tea.", "Metaphase chromosomes are used for counting and karyotypes.", "Colchicine blocks spindle formation and holds cells in metaphase.", "And most higher plant cells lack centrioles, but they still make a spindle."],
        },
      ],
    },

    // ─────────────────────────────────────────────── 5
    {
      id: "05-anaphase-to-cytokinesis",
      short: "Anaphase, telophase & cytokinesis",
      slides: [
        {
          kind: "cover",
          eyebrow: "Section 10.2 · Part B",
          title: "Anaphase, telophase & cytokinesis",
          sub: "Chromatids move apart, nuclei reform, and the cell splits: furrow in animals, cell plate in plants.",
          say: ["Section 10.2, part B. The chromosomes are lined up. Now they separate, and the cell splits in two."],
        },
        {
          kind: "points",
          title: "10.2.3 Anaphase",
          anim: { scene: "cell", states: ["metaphase", "anaphase-early", "anaphase-late", "anaphase-late"] },
          points: [
            "At the onset, each chromosome at the metaphase plate <b>splits simultaneously</b>; the two daughter chromatids, now called <b>daughter chromosomes</b>, migrate to <b>opposite poles</b>.",
            "As each chromosome moves away, its <b>centromere stays directed towards the pole</b>, at the leading edge, with the <b>arms trailing behind</b> (Figure 10.2 c).",
            "Key events: <b>centromeres split and chromatids separate</b>;",
            "<b>chromatids move to opposite poles</b>.",
          ],
          say: [
            "At the start of anaphase, every chromosome on the metaphase plate splits at the same time. The two chromatids, now called daughter chromosomes, begin moving to opposite poles.",
            "Look at their shape as they move. The centromere leads, pointing toward the pole, and the arms trail behind. That's why anaphase chromosomes look like a V.",
            "So the first key event: the centromeres split and the chromatids separate.",
            "And the second: the chromatids move to opposite poles.",
          ],
        },
        {
          kind: "points",
          title: "10.2.4 Telophase",
          anim: { scene: "cell", states: ["anaphase-late", "telophase", "telophase", "telophase"] },
          points: [
            "At the final stage of karyokinesis, chromosomes that reached the poles <b>decondense and lose their individuality</b>; chromatin collects at each pole (Figure 10.2 d).",
            "Chromosomes <b>cluster at opposite spindle poles</b> and their identity is lost as discrete elements.",
            "<b>Nuclear envelope develops</b> around the clusters at each pole, forming <b>two daughter nuclei</b>.",
            "<b>Nucleolus, Golgi complex and ER reform</b>.",
          ],
          say: [
            "Telophase is the final stage of karyokinesis. The chromosomes that reached the poles decondense and lose their individuality.",
            "They cluster at the opposite poles, and can no longer be seen as separate chromosomes.",
            "A nuclear envelope forms around each cluster, giving two daughter nuclei.",
            "And the nucleolus, Golgi complex and endoplasmic reticulum reform. Basically, telophase reverses prophase.",
          ],
        },
        {
          kind: "points",
          title: "10.2.5 Cytokinesis in animal cells",
          anim: { scene: "cell", states: ["telophase", "cyto-animal-mid", "cyto-animal"] },
          points: [
            "Mitosis segregates duplicated chromosomes into daughter nuclei (<b>karyokinesis</b>); then the cell itself divides by separation of cytoplasm: <b>cytokinesis</b> (Figure 10.2 e).",
            "In an <b>animal cell</b>, a <b>furrow</b> appears in the plasma membrane.",
            "The furrow gradually <b>deepens</b> and finally <b>joins in the centre</b>, dividing the cytoplasm into two.",
          ],
          say: [
            "Karyokinesis gave us two nuclei. Now cytokinesis divides the cytoplasm, and only then is cell division complete.",
            "In an animal cell, a furrow appears in the plasma membrane.",
            "Watch it deepen until it meets in the centre, pinching the cell into two.",
          ],
        },
        {
          kind: "points",
          title: "Cytokinesis in plant cells",
          anim: { scene: "cell", states: ["plant-telophase", "plant-plate", "plant-plate", "plant-done", "plant-done"] },
          points: [
            "Plant cells are enclosed by a relatively <b>inextensible cell wall</b>, so they divide by a different mechanism.",
            "Wall formation starts in the <b>centre</b> of the cell and grows <b>outward</b> to meet the existing lateral walls.",
            "It begins with a simple precursor called the <b>cell-plate</b>, which represents the <b>middle lamella</b> between the walls of two adjacent cells.",
            "During cytoplasmic division, organelles like <b>mitochondria and plastids</b> are distributed between the two daughter cells.",
            "In some organisms <b>karyokinesis is not followed by cytokinesis</b>, giving a multinucleate condition called <b>syncytium</b>, e.g. <b>liquid endosperm in coconut</b>.",
          ],
          say: [
            "Plant cells have a stiff, inextensible cell wall, so they can't pinch in. They use a different method.",
            "The new wall starts in the centre of the cell and grows outward until it meets the side walls. That's the opposite direction to the animal furrow.",
            "It begins as a cell plate, which becomes the middle lamella between the walls of the two new cells.",
            "As the cytoplasm divides, organelles such as mitochondria and plastids are shared between the daughter cells.",
            "Sometimes karyokinesis happens without cytokinesis. The result is one cell with many nuclei, called a syncytium. The NCERT example is the liquid endosperm of coconut.",
          ],
        },
        {
          kind: "points",
          title: "Syncytium: many nuclei, one cell",
          anim: { scene: "cell", states: ["syncytium4"] },
          points: ["Karyokinesis without cytokinesis → <b>multinucleate</b> cell = <b>syncytium</b>. Example: <b>liquid endosperm of coconut</b>."],
          say: ["Here's what a syncytium looks like: several nuclei sharing one cytoplasm, because the nuclei divided but the cell didn't. Coconut's liquid endosperm is the example to remember."],
        },
        {
          kind: "points",
          extra: true,
          title: "NEET tip: animal vs plant cytokinesis",
          diagram: {
            type: "compare",
            left: { h: "Animal cell", items: ["<b>Furrow</b> in plasma membrane", "Grows from <b>periphery → centre</b> (centripetal)"] },
            right: { h: "Plant cell", items: ["<b>Cell plate</b> (middle lamella)", "Grows from <b>centre → periphery</b> (centrifugal)"] },
          },
          points: ["Terms centripetal and centrifugal are beyond NCERT but common in NEET options.", "Anaphase chromosomes look V, J or I shaped depending on centromere position (beyond NCERT)."],
          say: ["Remember the direction. Animal furrows grow inward, centripetally. Plant cell plates grow outward, centrifugally.", "And anaphase chromosomes can look V, J or I shaped, depending on where the centromere sits."],
        },
      ],
    },

    // ─────────────────────────────────────────────── 6
    {
      id: "06-significance-of-mitosis",
      short: "10.3 Significance of mitosis",
      slides: [
        {
          kind: "cover",
          eyebrow: "Section 10.3",
          title: "Significance of mitosis",
          sub: "Why organisms need equational division.",
          say: ["Section 10.3. Why does mitosis matter so much?"],
        },
        {
          kind: "points",
          title: "Where mitosis happens",
          anim: { scene: "cell", states: ["metaphase", "metaphase"] },
          points: [
            "Mitosis, the <b>equational division</b>, is usually restricted to <b>diploid cells</b> only.",
            "However, in some <b>lower plants</b> and some <b>social insects</b>, <b>haploid cells</b> also divide by mitosis.",
          ],
          say: ["Mitosis, the equational division, usually happens only in diploid cells.", "But in some lower plants and some social insects, like the male honey bee, haploid cells also divide by mitosis."],
        },
        {
          kind: "points",
          title: "Why mitosis matters",
          anim: { scene: "cell", states: ["cyto-animal", "cyto-animal", "telophase", "cyto-animal", "plant-done"], still: "cyto-animal" },
          points: [
            "Mitosis usually produces <b>diploid daughter cells with identical genetic complement</b>.",
            "<b>Growth</b> of multicellular organisms is due to mitosis.",
            "Cell growth <b>disturbs the ratio between nucleus and cytoplasm</b>; the cell must divide to <b>restore the nucleo-cytoplasmic ratio</b>.",
            "<b>Cell repair</b>: cells of the <b>upper layer of the epidermis</b>, the <b>lining of the gut</b> and <b>blood cells</b> are constantly replaced.",
            "Mitotic divisions in <b>meristematic tissues</b>, the <b>apical</b> and <b>lateral cambium</b>, give <b>continuous growth of plants</b> throughout their life.",
          ],
          say: [
            "Mitosis usually produces diploid daughter cells that are genetically identical to each other.",
            "All the growth of a multicellular organism comes from mitosis.",
            "As a cell grows, its cytoplasm increases faster than its nucleus, and the nucleo-cytoplasmic ratio gets disturbed. Dividing restores this ratio.",
            "Mitosis also repairs the body. Cells of the upper epidermis, the gut lining and blood cells are constantly being replaced.",
            "And in plants, mitosis in the apical and lateral meristems lets them keep growing throughout their lives.",
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────── 7
    {
      id: "07-meiosis-prophase-1",
      short: "10.4 Meiosis & prophase I",
      slides: [
        {
          kind: "cover",
          eyebrow: "Section 10.4 · Part A",
          title: "Meiosis and the five stages of prophase I",
          sub: "Reduction division, synapsis, crossing over and chiasmata.",
          say: ["Section 10.4, meiosis. This is the part that NEET asks about most. Pay close attention to prophase one."],
        },
        {
          kind: "points",
          title: "What is meiosis?",
          anim: { scene: "graph", states: ["meio-all", "meio-all", "meio-all", "meio-all"] },
          points: [
            "Sexual reproduction involves the <b>fusion of two gametes</b>, each with a complete <b>haploid</b> set of chromosomes.",
            "Gametes form from <b>specialised diploid cells</b> by a division that <b>reduces chromosome number by half</b>, producing <b>haploid daughter cells</b>. This is <b>meiosis</b>.",
            "Meiosis ensures the <b>haploid phase</b> in the life cycle of sexually reproducing organisms; <b>fertilisation restores the diploid phase</b>.",
            "Meiosis occurs during <b>gametogenesis</b> in plants and animals, forming haploid gametes.",
          ],
          say: [
            "In sexual reproduction, two gametes fuse, and each gamete carries a complete haploid set of chromosomes.",
            "Gametes come from special diploid cells, through a division that halves the chromosome number and gives haploid daughter cells. This division is meiosis.",
            "Meiosis creates the haploid phase of the life cycle, and fertilisation restores the diploid phase.",
            "We see meiosis during gametogenesis, the formation of gametes, in both plants and animals.",
          ],
        },
        {
          kind: "points",
          title: "Key features of meiosis",
          anim: { scene: "cell", states: ["interphase", "metaphase-1", "pachytene-x", "telophase-2"] },
          points: [
            "<b>Two sequential cycles</b> of nuclear and cell division, <b>meiosis I and meiosis II</b>, but only a <b>single cycle of DNA replication</b>.",
            "Meiosis I begins <b>after</b> parental chromosomes have replicated to produce <b>identical sister chromatids</b> in S phase.",
            "Involves <b>pairing of homologous chromosomes</b> and <b>recombination between non-sister chromatids</b> of homologous chromosomes.",
            "<b>Four haploid cells</b> form at the end of meiosis II.",
          ],
          say: [
            "Four key features. One: meiosis has two rounds of division, meiosis one and meiosis two, but DNA is replicated only once.",
            "Two: meiosis one starts only after the chromosomes have replicated in S phase, giving identical sister chromatids.",
            "Three: homologous chromosomes pair up, and non-sister chromatids recombine. You'll see this happen shortly.",
            "Four: at the end of meiosis two, there are four haploid cells.",
          ],
        },
        {
          kind: "points",
          title: "Phases of meiosis",
          diagram: {
            type: "compare",
            left: { h: "Meiosis I", items: ["Prophase I", "Metaphase I", "Anaphase I", "Telophase I"] },
            right: { h: "Meiosis II", items: ["Prophase II", "Metaphase II", "Anaphase II", "Telophase II"] },
          },
          points: ["<b>Prophase I</b> is typically <b>longer and more complex</b> than prophase of mitosis, and is subdivided into five phases based on chromosomal behaviour: <b>Leptotene, Zygotene, Pachytene, Diplotene, Diakinesis</b>."],
          say: ["Each meiotic division has its own prophase, metaphase, anaphase and telophase. Prophase one is much longer and more complex than mitotic prophase, so it's split into five stages: leptotene, zygotene, pachytene, diplotene and diakinesis."],
        },
        {
          kind: "points",
          title: "Leptotene & zygotene",
          anim: { scene: "cell", states: ["leptotene", "leptotene", "zygotene", "zygotene", "zygotene"] },
          points: [
            "<b>Leptotene</b>: chromosomes become <b>gradually visible</b> under the light microscope; <b>compaction continues</b> throughout leptotene.",
            "<b>Zygotene</b>: chromosomes start <b>pairing</b>. This association is <b>synapsis</b>; the paired chromosomes are <b>homologous chromosomes</b>.",
            "Electron micrographs show synapsis is accompanied by a complex structure, the <b>synaptonemal complex</b>.",
            "The complex formed by a pair of synapsed homologous chromosomes is a <b>bivalent</b> or a <b>tetrad</b> (more clearly visible in the next stage).",
            "The first two stages are <b>relatively short-lived</b> compared with pachytene.",
          ],
          say: [
            "In leptotene, the chromosomes slowly become visible under a light microscope, and they keep compacting.",
            "In zygotene, homologous chromosomes start to pair. Watch them come together. This pairing is called synapsis.",
            "Electron microscopes show that synapsis comes with a special structure between the pair, the synaptonemal complex.",
            "A pair of synapsed homologous chromosomes is called a bivalent, or a tetrad.",
            "Leptotene and zygotene are short compared with the next stage, pachytene.",
          ],
        },
        {
          kind: "points",
          title: "Pachytene: crossing over",
          anim: { scene: "cell", states: ["pachytene", "pachytene", "pachytene-x", "pachytene-x", "pachytene-x"] },
          points: [
            "The <b>four chromatids</b> of each bivalent become distinct and clearly appear as <b>tetrads</b>.",
            "<b>Recombination nodules</b> appear: the sites where <b>crossing over</b> occurs between <b>non-sister chromatids</b> of homologous chromosomes.",
            "<b>Crossing over</b> is the exchange of genetic material between two homologous chromosomes. It is <b>enzyme-mediated</b>; the enzyme is <b>recombinase</b>.",
            "Crossing over leads to <b>recombination</b> of genetic material on the two chromosomes.",
            "Recombination is <b>completed by the end of pachytene</b>, leaving chromosomes <b>linked at the sites of crossing over</b>.",
          ],
          say: [
            "In pachytene, all four chromatids of each bivalent become distinct. Now you can clearly see the tetrad.",
            "Small recombination nodules appear. These mark the sites where crossing over will happen between non-sister chromatids.",
            "Watch the tips swap colour. Crossing over is the exchange of genetic material between homologous chromosomes. It is enzyme-mediated, and the enzyme is recombinase.",
            "The result is recombination: each chromosome now carries a new mix of maternal and paternal genes.",
            "By the end of pachytene, recombination is complete, and the chromosomes stay linked at the crossover sites.",
          ],
        },
        {
          kind: "points",
          title: "Diplotene & diakinesis",
          anim: { scene: "cell", states: ["diplotene", "diplotene", "diplotene", "diakinesis", "diakinesis", "diakinesis"] },
          points: [
            "<b>Diplotene</b> begins with <b>dissolution of the synaptonemal complex</b>; recombined homologues tend to separate <b>except at the sites of crossovers</b>.",
            "These <b>X-shaped structures</b> are called <b>chiasmata</b>.",
            "In <b>oocytes of some vertebrates</b>, diplotene can last for <b>months or years</b>.",
            "<b>Diakinesis</b>, the final stage of prophase I, is marked by <b>terminalisation of chiasmata</b>.",
            "Chromosomes are <b>fully condensed</b> and the <b>meiotic spindle is assembled</b>. By the end, the <b>nucleolus disappears</b> and the <b>nuclear envelope breaks down</b>.",
            "Diakinesis represents the <b>transition to metaphase</b>.",
          ],
          say: [
            "Diplotene starts when the synaptonemal complex dissolves. The homologous chromosomes begin to move apart, except where they crossed over.",
            "Those crossover points form X-shaped structures called chiasmata.",
            "Here's an interesting fact: in the oocytes of some vertebrates, diplotene can last for months, or even years.",
            "Diakinesis is the last stage of prophase one. Watch the chiasmata slide toward the ends of the chromosomes. This is called terminalisation.",
            "The chromosomes are now fully condensed and the meiotic spindle assembles. The nucleolus disappears and the nuclear envelope breaks down.",
            "So diakinesis is the transition into metaphase one.",
          ],
        },
        {
          kind: "points",
          extra: true,
          title: "NEET tip: prophase I in one line each",
          points: [
            "Order mnemonic: <b>L</b>azy <b>Z</b>ebras <b>P</b>refer <b>D</b>ark <b>D</b>ays.",
            "Leptotene: condensation · Zygotene: <b>synapsis, synaptonemal complex</b> · Pachytene: <b>crossing over, recombinase, recombination nodules</b>",
            "Diplotene: <b>chiasmata</b>, SC dissolves · Diakinesis: <b>terminalisation</b>, nucleolus & envelope disappear.",
            "Crossing over is between <b>non-sister</b> chromatids of <b>homologous</b> chromosomes.",
            "Longest stage of prophase I in vertebrate oocytes: <b>diplotene</b> (dictyotene, beyond NCERT).",
          ],
          say: ["Order: Lazy Zebras Prefer Dark Days.", "Zygotene means synapsis, and pachytene means crossing over with the enzyme recombinase.", "Diplotene shows chiasmata; diakinesis shows terminalisation.", "Crossing over is always between non-sister chromatids of homologous chromosomes.", "And diplotene can last years in vertebrate oocytes."],
        },
      ],
    },

    // ─────────────────────────────────────────────── 8
    {
      id: "08-meiosis-1-and-2",
      short: "Metaphase I to telophase II",
      slides: [
        {
          kind: "cover",
          eyebrow: "Section 10.4 · Part B & 10.5",
          title: "Meiosis I to meiosis II, and why meiosis matters",
          sub: "Bivalents on the plate, homologues separate, dyad, interkinesis, tetrad of four haploid cells.",
          say: ["Section 10.4, part B. We follow the chromosomes from metaphase one to the four haploid cells, then look at why meiosis matters."],
        },
        {
          kind: "points",
          title: "Metaphase I & anaphase I",
          anim: { scene: "cell", states: ["metaphase-1", "metaphase-1", "anaphase-1", "anaphase-1"] },
          points: [
            "<b>Metaphase I</b>: the <b>bivalent chromosomes align on the equatorial plate</b> (Figure 10.3).",
            "Microtubules from opposite poles attach to the <b>kinetochore of homologous chromosomes</b>.",
            "<b>Anaphase I</b>: the <b>homologous chromosomes separate</b>,",
            "while <b>sister chromatids remain associated at their centromeres</b>.",
          ],
          say: [
            "In metaphase one, the bivalents line up on the equatorial plate. Notice they line up in pairs, unlike mitosis.",
            "Spindle fibres from opposite poles attach to the kinetochores of the two homologous chromosomes.",
            "In anaphase one, the homologous chromosomes separate and move to opposite poles.",
            "But the sister chromatids stay together, joined at their centromeres. This is the key difference from mitotic anaphase.",
          ],
        },
        {
          kind: "points",
          title: "Telophase I & interkinesis",
          anim: { scene: "cell", states: ["telophase-1", "dyad", "dyad", "dyad"] },
          points: [
            "<b>Telophase I</b>: nuclear membrane and nucleolus <b>reappear</b>; <b>cytokinesis</b> follows, giving a <b>dyad of cells</b> (Figure 10.3).",
            "Chromosomes may disperse somewhat but do not reach the extremely extended state of the interphase nucleus.",
            "<b>Interkinesis</b>: the stage between the two meiotic divisions; generally <b>short-lived</b>. There is <b>no replication of DNA</b> during interkinesis.",
            "Interkinesis is followed by <b>prophase II</b>, a much simpler prophase than prophase I.",
          ],
          say: [
            "In telophase one, the nuclear membrane and nucleolus reappear, and cytokinesis follows. The two cells formed are called a dyad.",
            "The chromosomes may loosen a little, but they don't fully extend like in interphase.",
            "The short gap between the two divisions is called interkinesis. And remember: there is no DNA replication during interkinesis.",
            "Next comes prophase two, which is much simpler than prophase one.",
          ],
        },
        {
          kind: "points",
          title: "10.4.2 Meiosis II",
          anim: { scene: "cell", states: ["prophase-2", "prophase-2", "metaphase-2", "anaphase-2", "telophase-2"] },
          points: [
            "<b>Prophase II</b>: starts <b>immediately after cytokinesis</b>, usually before chromosomes have fully elongated. Meiosis II <b>resembles a normal mitosis</b>.",
            "The <b>nuclear membrane disappears</b> by the end of prophase II; chromosomes again become compact (Figure 10.4).",
            "<b>Metaphase II</b>: chromosomes align at the <b>equator</b>; microtubules from opposite poles attach to the <b>kinetochores of sister chromatids</b>.",
            "<b>Anaphase II</b>: simultaneous <b>splitting of the centromere</b> of each chromosome; sister chromatids move to opposite poles by <b>shortening of microtubules</b> attached to kinetochores.",
            "<b>Telophase II</b>: two groups of chromosomes are again enclosed by a nuclear envelope; cytokinesis gives a <b>tetrad of cells</b>, i.e. <b>four haploid daughter cells</b> (Figure 10.4).",
          ],
          say: [
            "Prophase two begins right after cytokinesis, often before the chromosomes have fully stretched out. Meiosis two looks just like a normal mitosis.",
            "By the end of prophase two, the nuclear membrane disappears and the chromosomes become compact again.",
            "In metaphase two, chromosomes line up at the equator of each cell, and spindle fibres attach to the kinetochores of the sister chromatids.",
            "In anaphase two, the centromeres split at the same time, and the sister chromatids are pulled to opposite poles as the microtubules shorten.",
            "In telophase two, a nuclear envelope forms around each group, and cytokinesis gives a tetrad of cells: four haploid daughter cells.",
          ],
        },
        {
          kind: "points",
          title: "10.5 Significance of meiosis",
          anim: { scene: "graph", states: ["meio-all", "meio-all", "meio-all"] },
          points: [
            "Meiosis <b>conserves the specific chromosome number</b> of each species across generations in sexually reproducing organisms, even though the process, <b>paradoxically</b>, halves the chromosome number.",
            "It <b>increases genetic variability</b> in the population from one generation to the next.",
            "<b>Variations</b> are very important for the process of <b>evolution</b>.",
          ],
          say: [
            "Meiosis keeps the chromosome number of each species constant across generations. It's a paradox: it halves the number, yet that's exactly what keeps it constant, because fertilisation doubles it again.",
            "Meiosis also increases genetic variability from one generation to the next, through crossing over and independent assortment.",
            "And these variations are very important for evolution.",
          ],
        },
        {
          kind: "points",
          extra: true,
          title: "NEET tip: anaphase comparisons",
          diagram: {
            type: "compare",
            left: { h: "Anaphase (mitosis) & anaphase II", items: ["<b>Centromeres split</b>", "<b>Sister chromatids</b> separate"] },
            right: { h: "Anaphase I", items: ["Centromeres <b>do not split</b>", "<b>Homologous chromosomes</b> separate; chromosome number halves"] },
          },
          points: ["Reduction in chromosome number happens in <b>meiosis I</b>. Meiosis II is equational.", "No DNA replication between meiosis I and II (interkinesis)."],
          say: ["In mitosis and anaphase two, centromeres split and sisters separate. In anaphase one, centromeres don't split; homologues separate.", "So the reduction happens in meiosis one. Meiosis two is equational.", "And again, no DNA replication in interkinesis."],
        },
      ],
    },

    // ─────────────────────────────────────────────── 9
    {
      id: "09-summary-exercises",
      short: "Summary & 16 exercises",
      slides: [
        {
          kind: "cover",
          eyebrow: "Revision",
          title: "Summary & all 16 exercises",
          sub: "The NCERT summary and model answers to every end-of-chapter exercise.",
          say: ["Time to revise. First the NCERT summary, then all sixteen exercises with model answers. Pause before each answer and try it yourself."],
        },
        {
          kind: "points",
          title: "Summary (NCERT) · cell cycle & mitosis",
          points: [
            "Cell theory: <b>cells arise from pre-existing cells</b>; the process is <b>cell division</b>.",
            "Sexually reproducing organisms start from a single-celled <b>zygote</b>; division continues throughout the life cycle.",
            "Cell cycle = <b>Interphase</b> (preparation) + <b>M phase</b> (actual division). Interphase = " + G(1) + ", S, " + G(2) + ".",
            G(1) + ": growth, normal metabolism, <b>most organelle duplication</b>. S: <b>DNA replication and chromosome duplication</b>. " + G(2) + ": <b>cytoplasmic growth</b>.",
            "Prophase: condensation, centrioles to poles, nuclear envelope and nucleolus disappear, spindle fibres appear. Metaphase: alignment at the equatorial plate.",
            "Anaphase: centromeres divide, chromatids move to poles. Telophase: chromosomes elongate, nucleolus and nuclear membrane reappear. Then <b>cytokinesis</b>.",
            "Mitosis is <b>equational</b>: parent chromosome number is conserved in daughter cells.",
          ],
          say: [
            "Cell theory says cells come from pre-existing cells, through cell division.",
            "A sexually reproducing organism starts as one zygote, and its cells keep dividing all through life.",
            "The cell cycle has interphase, the preparation, and M phase, the actual division. Interphase is G one, S and G two.",
            "G one is growth and normal metabolism, when most organelles duplicate. S is DNA replication. G two is cytoplasmic growth.",
            "In prophase, chromosomes condense and the nuclear envelope disappears. In metaphase, they align at the equator.",
            "In anaphase, centromeres divide and chromatids move apart. In telophase, nuclei reform. Then cytokinesis.",
            "Mitosis conserves the chromosome number. That's why it's equational.",
          ],
        },
        {
          kind: "points",
          title: "Summary (NCERT) · meiosis",
          points: [
            "Meiosis occurs in <b>diploid cells destined to form gametes</b>. It is the <b>reduction division</b>: it halves the chromosome number; fertilisation restores it.",
            "Two phases: meiosis I and meiosis II. In meiosis I, homologues pair to form <b>bivalents</b> and undergo <b>crossing over</b>.",
            "Long prophase I with five phases: <b>leptotene, zygotene, pachytene, diplotene, diakinesis</b>.",
            "Metaphase I: bivalents on equatorial plate. Anaphase I: homologues move to opposite poles <b>with both their chromatids</b>; each pole gets <b>half the chromosome number</b>.",
            "Telophase I: nuclear membrane and nucleolus reappear. Meiosis II is <b>similar to mitosis</b>; in anaphase II <b>sister chromatids separate</b>.",
            "At the end of meiosis, <b>four haploid cells</b> are formed.",
          ],
          say: [
            "Meiosis happens in diploid cells that will form gametes. It's the reduction division, and fertilisation restores the number.",
            "In meiosis one, homologues pair into bivalents and cross over.",
            "Prophase one has five stages: leptotene, zygotene, pachytene, diplotene and diakinesis.",
            "Bivalents line up in metaphase one; in anaphase one, homologues move apart with both chromatids, so each pole gets half the chromosomes.",
            "Meiosis two is like mitosis, and sister chromatids separate in anaphase two.",
            "The end result: four haploid cells.",
          ],
        },
        { kind: "qa", q: "Ex 1. What is the average cell cycle span for a mammalian cell?", a: ["About <b>24 hours</b>, as in human cells in culture. (Yeast: about 90 minutes.)"] },
        { kind: "qa", q: "Ex 2. Distinguish cytokinesis from karyokinesis.", a: ["<b>Karyokinesis</b>: division of the <b>nucleus</b>; separation of daughter chromosomes into two daughter nuclei (prophase → telophase).", "<b>Cytokinesis</b>: division of the <b>cytoplasm</b> into two daughter cells, by a furrow in animal cells and a cell plate in plant cells. It usually follows karyokinesis."] },
        { kind: "qa", q: "Ex 3. Describe the events taking place during interphase.", a: ["Interphase (> 95% of the cycle) prepares the cell for division through growth and DNA replication.", "<b>" + G(1) + "</b>: metabolically active, grows continuously, no DNA replication.", "<b>S</b>: DNA replicates, 2C → 4C; chromosome number stays 2n; centriole duplicates in the cytoplasm of animal cells.", "<b>" + G(2) + "</b>: proteins synthesised for mitosis; growth continues."] },
        { kind: "qa", q: "Ex 4. What is G0 (quiescent phase) of cell cycle?", a: ["An inactive stage entered by cells that <b>exit " + G(1) + "</b> and stop dividing (e.g. heart cells).", "Cells stay <b>metabolically active</b> but <b>do not proliferate</b> unless called on to do so as the organism requires."] },
        { kind: "qa", q: "Ex 5. Why is mitosis called equational division?", a: ["Because the <b>number of chromosomes in the parent and progeny cells is the same</b>. A 2n cell gives two 2n daughter cells with identical genetic complement."] },
        { kind: "qa", q: "Ex 6. Name the stage at which: (i) chromosomes move to spindle equator (ii) centromere splits, chromatids separate (iii) homologous chromosomes pair (iv) crossing over occurs.", a: ["(i) <b>Metaphase</b> (metaphase I/II in meiosis).", "(ii) <b>Anaphase</b> of mitosis (and anaphase II of meiosis).", "(iii) <b>Zygotene</b> of prophase I.", "(iv) <b>Pachytene</b> of prophase I."] },
        { kind: "qa", q: "Ex 7. Describe (a) synapsis (b) bivalent (c) chiasmata, with a diagram.", a: ["(a) <b>Synapsis</b>: pairing of homologous chromosomes during zygotene, with a synaptonemal complex.", "(b) <b>Bivalent</b> (tetrad): the complex of a pair of synapsed homologous chromosomes; four chromatids.", "(c) <b>Chiasmata</b>: X-shaped points where recombined homologues stay joined at crossover sites, seen from diplotene; terminalised in diakinesis. (See the animated diagrams in topic 7.)"] },
        { kind: "qa", q: "Ex 8. How does cytokinesis in plant cells differ from that in animal cells?", a: ["<b>Animal</b>: a furrow in the plasma membrane deepens and joins in the centre, dividing the cytoplasm.", "<b>Plant</b>: the inextensible wall prevents furrowing; a <b>cell plate</b> (future middle lamella) forms in the centre and grows outward to meet the lateral walls."] },
        { kind: "qa", q: "Ex 9. Find examples where the four daughter cells from meiosis are equal in size and where they are unequal.", a: ["<b>Equal</b>: spermatogenesis (four equal sperms); microsporogenesis in anthers (four equal microspores, later pollen grains).", "<b>Unequal</b>: oogenesis in humans (one large ovum + small polar bodies); megasporogenesis in most flowering plants (one functional megaspore, three degenerate). [Details from later chapters]"] },
        { kind: "qa", q: "Ex 10. Distinguish anaphase of mitosis from anaphase I of meiosis.", a: ["<b>Mitosis anaphase</b>: centromeres split; <b>sister chromatids</b> separate and move to opposite poles; chromosome number at each pole equals the parent's.", "<b>Anaphase I</b>: centromeres do not split; <b>homologous chromosomes</b> separate with sister chromatids still joined; each pole gets <b>half</b> the chromosome number."] },
        { kind: "qa", q: "Ex 11. List the main differences between mitosis and meiosis.", a: ["<b>Where</b>: somatic (mostly diploid) cells vs diploid cells forming gametes.", "<b>Divisions</b>: one vs two (one DNA replication). <b>Products</b>: two diploid, identical cells vs four haploid, varied cells.", "<b>Pairing/crossing over</b>: absent vs synapsis + crossing over in prophase I. <b>Prophase</b>: short vs long with five substages.", "<b>Anaphase</b>: sister chromatids separate vs homologues separate (AI). <b>Role</b>: growth, repair vs gametes, constant chromosome number, variation."] },
        { kind: "qa", q: "Ex 12. What is the significance of meiosis?", a: ["Conserves the <b>specific chromosome number</b> of a species across generations (halving then fertilisation).", "Increases <b>genetic variability</b> from one generation to the next (crossing over, independent assortment); variations are important for <b>evolution</b>."] },
        { kind: "qa", q: "Ex 13. Discuss (i) haploid insects and lower plants where cell division occurs, (ii) haploid cells in higher plants where cell division does not occur.", a: ["(i) <b>Male honey bees</b> (drones; also male ants and wasps) develop from unfertilised eggs and grow by mitosis. Lower plants: haploid gametophytes of algae, mosses and fern prothalli divide by mitosis.", "(ii) In flowering plants, haploid cells of the embryo sac such as the <b>egg cell, synergids and antipodals</b>, and the male gametes, do not divide further. [Beyond this chapter]"] },
        { kind: "qa", q: "Ex 14. Can there be mitosis without DNA replication in ‘S’ phase?", a: ["<b>No</b> (in a normal cell cycle). Each chromosome needs two chromatids to give one to each daughter; without S phase the daughters would get an incomplete genome. Cells check DNA replication before entering M phase."] },
        { kind: "qa", q: "Ex 15. Can there be DNA replication without cell division?", a: ["<b>Yes</b>. DNA can replicate repeatedly without division, giving <b>polyploid</b> cells or <b>polytene</b> chromosomes (e.g. salivary glands of <i>Drosophila</i>). A related case is the syncytium (nuclear division without cytokinesis). [Beyond NCERT examples]"] },
        {
          kind: "points",
          title: "Ex 16. How N (chromosomes) and C (DNA) change",
          diagram: {
            type: "nctable",
            rows: [
              ["G<sub>1</sub>", "2n", "2C"], ["S", "2n", "2C → 4C"], ["G<sub>2</sub>", "2n", "4C"],
              ["Prophase / Metaphase", "2n", "4C"], ["Anaphase (per cell)", "4n", "4C"], ["After telophase + cytokinesis", "2n", "2C"],
              ["After meiosis I", "n", "2C"], ["After meiosis II", "n", "C"],
            ],
          },
          points: [],
          say: ["Exercise sixteen asks how chromosome number N and DNA content C change through the cycle. In G one, a diploid cell is two n and two C. S phase doubles DNA to four C, but N stays two n. In anaphase, chromatids separate, so the cell briefly holds four n. After cytokinesis, each daughter is back to two n and two C. In meiosis, meiosis one gives n with two C, and meiosis two gives n with C."],
        },
      ],
    },
  ],

  mcq: balance([
    { q: "Human cells in culture divide approximately once every", o: ["24 hours", "90 minutes", "12 hours", "1 hour"], a: 0, why: "NCERT 10.1.1: about 24 hours." },
    { q: "Yeast can complete its cell cycle in about", o: ["24 hours", "90 minutes", "10 minutes", "6 hours"], a: 1, why: "NCERT: only about 90 minutes." },
    { q: "In a 24-hour human cell cycle, interphase lasts", o: ["About 50% of the cycle", "About 1 hour", "More than 95% of the cycle", "About 5% of the cycle"], a: 2, why: "Division proper lasts about an hour; interphase is more than 95%." },
    { q: "DNA replication takes place during", o: ["G<sub>1</sub> phase", "S phase", "G<sub>2</sub> phase", "M phase"], a: 1, why: "S (synthesis) phase." },
    { q: "If DNA content at G<sub>1</sub> is 2C, after S phase it is", o: ["2C", "1C", "4C", "8C"], a: 2, why: "DNA doubles in S phase: 2C → 4C." },
    { q: "A cell with 2n chromosomes at G<sub>1</sub> has how many chromosomes after S phase?", o: ["4n", "2n", "n", "3n"], a: 1, why: "No increase in chromosome number during S phase." },
    { q: "In animal cells, the centriole duplicates during", o: ["G<sub>1</sub> phase", "Prophase", "S phase", "Telophase"], a: 2, why: "S phase, in the cytoplasm." },
    { q: "Cells that exit G<sub>1</sub> and stop dividing enter", o: ["G<sub>2</sub>", "S phase", "G<sub>0</sub> (quiescent stage)", "Interkinesis"], a: 2, why: "Quiescent stage G<sub>0</sub>; still metabolically active." },
    { q: "Haploid cells divide by mitosis in", o: ["Human liver", "Male honey bees", "Frog skin", "Cow intestine"], a: 1, why: "NCERT exception in animals: male honey bees." },
    { q: "Morphology of chromosomes is most easily studied at", o: ["Prophase", "Metaphase", "Anaphase", "Telophase"], a: 1, why: "Condensation is complete at metaphase." },
    { q: "Small disc-shaped structures at the surface of centromeres are", o: ["Asters", "Centrioles", "Kinetochores", "Nucleosomes"], a: 2, why: "Kinetochores: sites of spindle fibre attachment." },
    { q: "Two asters together with spindle fibres form the", o: ["Synaptonemal complex", "Mitotic apparatus", "Cell plate", "Metaphase plate"], a: 1, why: "NCERT 10.2.1." },
    { q: "Centromeres split and chromatids separate during", o: ["Metaphase", "Anaphase", "Telophase", "Prophase"], a: 1, why: "Key event of anaphase." },
    { q: "Nucleolus, Golgi complex and ER reform during", o: ["Prophase", "Metaphase", "Anaphase", "Telophase"], a: 3, why: "Key event of telophase." },
    { q: "The liquid endosperm of coconut is an example of", o: ["Syncytium", "Cell plate", "Dyad", "Bivalent"], a: 0, why: "Karyokinesis not followed by cytokinesis." },
    { q: "Synapsis of homologous chromosomes occurs in", o: ["Leptotene", "Zygotene", "Pachytene", "Diakinesis"], a: 1, why: "Zygotene, with the synaptonemal complex." },
    { q: "The enzyme involved in crossing over is", o: ["Ligase", "Helicase", "Recombinase", "Polymerase"], a: 2, why: "NCERT: crossing over is enzyme-mediated by recombinase." },
    { q: "Terminalisation of chiasmata is seen in", o: ["Zygotene", "Pachytene", "Diplotene", "Diakinesis"], a: 3, why: "Diakinesis; chiasmata first appear in diplotene." },
    { q: "Homologous chromosomes separate during", o: ["Anaphase of mitosis", "Anaphase I", "Anaphase II", "Metaphase II"], a: 1, why: "Sister chromatids stay joined in anaphase I." },
    { q: "The short stage between meiosis I and meiosis II, with no DNA replication, is", o: ["Interphase", "Diakinesis", "Interkinesis", "G<sub>0</sub>"], a: 2, why: "Interkinesis is short-lived; no DNA replication." },
  ]),

  glossary: [
    ["Cell cycle", "Sequence of events by which a cell duplicates its genome, synthesises other constituents and divides into two daughter cells."],
    ["Interphase", "Phase between two successive M phases; > 95% of the cycle; G1, S, G2."],
    ["M phase", "Mitosis phase, when actual cell division occurs (about 1 hour of 24)."],
    ["G1 phase", "Gap 1: cell metabolically active and growing; no DNA replication."],
    ["S phase", "Synthesis: DNA replicates (2C → 4C); chromosome number unchanged; centriole duplicates in animal cells."],
    ["G2 phase", "Gap 2: proteins synthesised for mitosis; growth continues."],
    ["G0 (quiescent stage)", "Inactive stage after exiting G1; metabolically active but not proliferating (e.g. heart cells)."],
    ["Karyokinesis", "Division of the nucleus; separation of daughter chromosomes."],
    ["Cytokinesis", "Division of the cytoplasm into two daughter cells."],
    ["Equational division", "Mitosis: parent and progeny cells have the same chromosome number."],
    ["Asters", "Microtubules radiating from each centrosome."],
    ["Mitotic apparatus", "Two asters together with spindle fibres."],
    ["Kinetochore", "Small disc-shaped structure on the centromere surface where spindle fibres attach."],
    ["Metaphase plate", "Plane of alignment of chromosomes at metaphase."],
    ["Cell plate", "Precursor of the new wall in plant cytokinesis; represents the middle lamella."],
    ["Syncytium", "Multinucleate condition when karyokinesis is not followed by cytokinesis (liquid endosperm of coconut)."],
    ["Meiosis", "Reduction division forming haploid cells; two divisions, one DNA replication."],
    ["Synapsis", "Pairing of homologous chromosomes in zygotene."],
    ["Synaptonemal complex", "Complex structure accompanying synapsis."],
    ["Bivalent / tetrad", "A pair of synapsed homologous chromosomes (four chromatids)."],
    ["Recombination nodules", "Sites of crossing over in pachytene."],
    ["Crossing over", "Exchange of genetic material between non-sister chromatids of homologous chromosomes; enzyme recombinase."],
    ["Chiasmata", "X-shaped structures at crossover sites, seen in diplotene."],
    ["Terminalisation", "Movement of chiasmata to chromosome ends in diakinesis."],
    ["Dyad", "The two cells formed after telophase I and cytokinesis."],
    ["Interkinesis", "Short stage between meiosis I and II; no DNA replication."],
    ["Tetrad of cells", "Four haploid daughter cells at the end of meiosis II."],
  ],

  // Stage-ordering drills for the revision page lab.
  drills: [
    { name: "Mitosis stages", order: ["Prophase", "Metaphase", "Anaphase", "Telophase", "Cytokinesis"] },
    { name: "Prophase I substages", order: ["Leptotene", "Zygotene", "Pachytene", "Diplotene", "Diakinesis"] },
    { name: "Cell cycle phases", order: ["G1", "S", "G2", "M phase"] },
    { name: "Whole of meiosis", order: ["Prophase I", "Metaphase I", "Anaphase I", "Telophase I", "Interkinesis", "Prophase II", "Metaphase II", "Anaphase II", "Telophase II"] },
  ],
  // N/C tracker quiz for the lab: [stage, N, C]
  ncQuiz: [
    ["G1", "2n", "2C"], ["After S", "2n", "4C"], ["G2", "2n", "4C"], ["Metaphase", "2n", "4C"],
    ["After mitosis (each cell)", "2n", "2C"], ["After meiosis I (each cell)", "n", "2C"], ["After meiosis II (each cell)", "n", "C"],
  ],

  mustCover: [
    "single cell", "growth and reproduction", "two daughter cells", "cell population", "millions of cells",
    "coordinated", "intact genomes", "duplicates its genome", "only during one specific stage", "genetic control",
    "24 hours", "90 minutes", "organism to organism", "cell type to cell type", "Interphase", "M phase",
    "between two successive M phases", "about an hour", "95%", "karyokinesis", "cytokinesis", "resting phase",
    "Gap 1", "Synthesis", "Gap 2", "metabolically active", "2C", "4C", "2n", "centriole duplicates", "cytoplasm",
    "proteins are synthesised", "meristematic", "16 chromosomes", "heart cells", "quiescent", "G0",
    "diploid somatic cells", "male honey bees", "both haploid and diploid", "most dramatic", "equational division",
    "progressive process", "Prophase", "Metaphase", "Anaphase", "Telophase", "intertwined", "condensation",
    "two chromatids attached at the centromere", "asters", "mitotic apparatus", "Golgi complexes", "endoplasmic reticulum",
    "nucleolus", "nuclear envelope", "complete disintegration", "morphology is most easily studied", "Kinetochores",
    "disc-shaped", "equator", "metaphase plate", "splits simultaneously", "daughter chromosomes", "arms trailing",
    "centromeres split", "decondense", "two daughter nuclei", "furrow", "inextensible cell wall", "centre",
    "cell-plate", "middle lamella", "mitochondria and plastids", "syncytium", "coconut", "lower plants", "social insects",
    "identical genetic complement", "nucleo-cytoplasmic ratio", "Cell repair", "epidermis", "lining of the gut",
    "blood cells", "apical", "lateral cambium", "fusion of two gametes", "haploid", "reduces chromosome number by half",
    "fertilisation restores", "gametogenesis", "single cycle of DNA replication", "identical sister chromatids",
    "non-sister chromatids", "Four haploid cells", "Leptotene", "Zygotene", "Pachytene", "Diplotene", "Diakinesis",
    "gradually visible", "synapsis", "homologous chromosomes", "synaptonemal complex", "bivalent", "tetrad",
    "short-lived", "Recombination nodules", "Crossing over", "enzyme-mediated", "recombinase", "recombination",
    "chiasmata", "months or years", "terminalisation", "meiotic spindle", "transition to metaphase",
    "equatorial plate", "kinetochore of homologous chromosomes", "remain associated at their centromeres",
    "dyad", "Interkinesis", "no replication of DNA", "much simpler prophase", "resembles a normal mitosis",
    "shortening of microtubules", "tetrad of cells", "conserves the specific chromosome number", "paradoxically",
    "genetic variability", "evolution", "pre-existing cells", "zygote", "organelle duplication",
    "Ex 1.", "Ex 2.", "Ex 3.", "Ex 4.", "Ex 5.", "Ex 6.", "Ex 7.", "Ex 8.", "Ex 9.", "Ex 10.", "Ex 11.", "Ex 12.",
    "Ex 13.", "Ex 14.", "Ex 15.", "Ex 16.",
  ],
};
