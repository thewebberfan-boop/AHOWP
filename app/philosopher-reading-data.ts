import { reading, type PhilosopherReading } from "./philosopher-reading-unit";
import { ancientPhilosopherReadings } from "./philosopher-reading-ancient-data";
import { medievalPhilosopherReadings } from "./philosopher-reading-medieval-data";
import { modernPhilosopherReadings } from "./philosopher-reading-modern-data";
export type { PhilosopherReading } from "./philosopher-reading-unit";

// Retain only concepts and relationships needed to distinguish the
// thinker's answers. Do not migrate every legacy inquiry just to retain prose.
export const philosopherReadings: Record<string, PhilosopherReading[]> = {
  ...ancientPhilosopherReadings,
  ...medievalPhilosopherReadings,
  ...modernPhilosopherReadings,
  descartes: [
    reading("descartes-certainty", "怀疑与确定性", "does-any-judgment-survive-hyperbolic-doubt", `
      methodic-doubt-suspends-uncertain-beliefs does-any-judgment-survive-hyperbolic-doubt
      cogito-performed-certainty can-cogito-yield-general-truth-rule clear-distinct-perception-provisional-rule
      can-finite-thinker-secure-clear-distinct-truth infinite-perfect-idea-points-beyond-finite-self
      would-perfect-god-systematically-deceive nondeceiving-god-secures-attended-clear-perceptions
      can-external-material-things-be-recovered material-world-recovered-with-sensory-limits
    `),
    reading("descartes-wax", "蜡块：感觉与判断", "how-is-changing-wax-known-as-same-body", `
      wax-properties-change-observation how-is-changing-wax-known-as-same-body
      intellect-judges-extension-beyond-sense-image
    `),
    reading("descartes-union", "心身区分与联合", "how-can-distinct-mind-and-body-form-one-human", `
      thinking-thing-before-body matter-as-extension-mechanical-order is-mind-really-distinct-from-body
      thought-extension-real-distinction how-can-distinct-mind-and-body-form-one-human
      mind-body-union-lived-not-mechanically-resolved
    `),
  ],
  locke: [
    reading("locke-knowledge", "经验与知识边界", "how-far-does-knowledge-extend-beyond-ideas", `
      sensation-and-reflection-supply-idea-materials how-do-simple-ideas-form-complex-general-thought
      combination-comparison-abstraction-organize-experience
      how-far-does-knowledge-extend-beyond-ideas knowledge-as-agreement-probability-for-practice
    `),
    reading("locke-identity", "意识与人格同一", "what-makes-one-person-same-over-time", `
      what-makes-one-person-same-over-time personhood-through-conscious-appropriation
      how-can-accountability-exceed-explicit-memory
    `),
    reading("locke-government", "权利与有限政府", "how-do-consent-and-majority-create-government", `
      equal-persons-judge-own-cases-observation is-state-of-nature-already-war
      natural-law-rights-precede-government how-can-common-resources-become-private-property
      labor-appropriation-proviso-and-money how-do-consent-and-majority-create-government
      fiduciary-government-and-separated-powers when-may-people-resist-or-replace-government
      right-of-resistance-follows-broken-trust how-universal-are-lockean-rights-in-practice
    `),
    reading("locke-toleration", "信念与强制的边界", "can-force-produce-religious-belief", `
      religious-pluralism-observation can-force-produce-religious-belief
      toleration-follows-limited-civil-ends how-universal-are-lockean-rights-in-practice
    `),
  ],
  pyrrho: [
    reading("pyrrho-suspension", "不急于断言，怎样生活？", "how-live-uncontrollable-world", `
      how-live-uncontrollable-world skeptical-suspension tranquility-needs-knowledge
    `),
  ],
};

export const philosopherReadingNodeIds = (id: string) => [...new Set((philosopherReadings[id] || []).flatMap((item) => item.nodeIds))];
