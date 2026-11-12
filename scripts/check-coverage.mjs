// Fails if any key fact from the NCERT chapter is missing from content/ch01.mjs.
import data from "../content/ch01.mjs";
import fs from "node:fs";

// Table 1.1 is drawn by the renderer, so its source counts too.
const renderer = fs.readFileSync(new URL("../templates/slides.js", import.meta.url), "utf8");
const text = (JSON.stringify(data) + renderer).replace(/<[^>]+>/g, "").replace(/\\u2013|–/g, "-");
const MUST = [
  // unit intro + Mayr
  "science of life forms and living processes", "deified", "wind, sea, fire", "awe or fear", "anthropocentric",
  "horizontally and vertically", "conservation of biodiversity", "5 July 1904", "Kempten", "Darwin of the 20",
  "1953", "1975", "Alexander Agassiz Professor of Zoology Emeritus", "ornithology", "zoogeography",
  "biological species", "Balzan Prize", "1983", "International Prize for Biology", "1994", "Crafoord Prize", "1999", "2004",
  // opener
  "cold mountains, deciduous forests, oceans, fresh water lakes, deserts", "hot springs", "valley of flowers",
  "conflict and cooperation", "molecular traffic", "purpose", "Technical", "Philosophical",
  // 1.1
  "naked eye", "dense forest", "1.7 - 1.8 million", "Biodiversity", "local names", "nomenclature", "identification",
  "ICBN", "ICZN", "only one name", "Carolus Linnaeus", "Mangifera indica", "generic name", "specific epithet",
  "Latin", "italics", "separately underlined", "capital letter", "small letter", "Linn.", "first described by Linnaeus",
  "easily observable characters", "Alsatians", "external ears and body hair", "Wheat", "rice", "taxa", "taxonomy",
  "external and internal structure", "structure of cell", "development process", "ecological information",
  "Characterisation", "food, clothing and shelter", "uses", "systematics", "systema", "Systema Naturae", "evolutionary relationships",
  // 1.2
  "taxonomic category", "taxonomic hierarchy", "taxon", "three pairs of jointed legs", "not merely morphological aggregates",
  "species is the lowest category", "knowledge of its characters", "fundamental similarities", "distinct morphological differences",
  "Solanum tuberosum", "Panthera leo", "Panthera tigris", "Solanum nigrum", "S. melongena", "Homo sapiens",
  "aggregates of closely related species", "P. pardus", "Felis", "vegetative and reproductive features", "Petunia", "Datura",
  "Solanaceae", "Felidae", "Canidae", "aggregates of characters", "Convolvulaceae", "Polymoniales", "floral characters", "Carnivora",
  "Primata", "monkey, gorilla, gibbon", "Mammalia", "other orders", "fishes, amphibians, reptiles, birds and mammals",
  "notochord", "dorsal hollow neural system", "Chordata", "Division", "Kingdom Animalia", "Kingdom Plantae", "ascending order",
  "sub-categories", "common characteristics decreases", "greater the difficulty", "more complex",
  // Table 1.1
  "Musca domestica", "Muscidae", "Diptera", "Insecta", "Arthropoda", "Hominidae", "Anacardiaceae", "Sapindales",
  "Dicotyledonae", "Angiospermae", "Triticum aestivum", "Poaceae", "Poales", "Monocotyledonae",
  // summary + exercises
  "still remain unknown", "agriculture, forestry, industry", "bio-resources", "international codes", "binomial system",
  "Ex 1.", "Ex 2.", "Ex 3.", "Ex 4.", "Ex 5.", "Ex 6.", "Ex 7.", "Ex 8.", "Ex 9.", "Ex 10.",
];
const missing = MUST.filter((k) => !text.toLowerCase().includes(k.toLowerCase().replace(/–/g, "-")));
console.log(`${MUST.length - missing.length}/${MUST.length} NCERT facts present`);
if (missing.length) { console.log("MISSING:", missing); process.exit(1); }
