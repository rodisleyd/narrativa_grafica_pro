export type ProjectFormat = 
  | "HQ_CLASSICA" 
  | "MANGA" 
  | "TIRINHAS" 
  | "GRAPHIC_NOVEL" 
  | "WEBCOMIC" 
  | "STORYBOARD";

export type NarrativeStructureMethod = 
  | "THREE_ACTS" 
  | "SAVE_THE_CAT" 
  | "HEROS_JOURNEY" 
  | "JOHN_TRUBY" 
  | "EPISODIC" 
  | "STRIP_STRUCTURE";

export interface ProjectSettings {
  title: string;
  format: ProjectFormat;
  genre: string;
  targetAudience: string;
  totalPages: number;
  style: string;
  premise: string;
  theme: string;
}

export interface GuidedStructure {
  protagonist: string;
  desire: string;
  obstacle: string;
  mainConflict: string;
  risk: string;
  emotionalTransformation: string;
}

export interface Panel {
  id: string;
  panelNumber: number;
  framing: string;    // Plano geral, etc.
  visualDescription: string;
  dialogue: string;
  narration: string;
  soundEffects: string; // Onomatopeias
  emotions: string;
  cameraMovement: string;
  timeOfScene: string;
  artistNotes: string;
}

export interface ScriptPage {
  id: string;
  pageNumber: number;
  rhythmNotes: string;
  panels: Panel[];
}

export interface Character {
  id: string;
  name: string;
  objective: string;
  fear: string;
  weakness: string;
  personality: string;
  archetype: string;
  appearance: string;
  expressions: string;
  bodyLanguage: string;
  relations: string;
  emotionalJourney: string;
}

export interface WorldBuilding {
  era: string;
  technology: string;
  culture: string;
  politics: string;
  worldRules: string;
  visualClimate: string;
  architecture: string;
  references: string;
  colorPalette?: string[];
}

export interface Project {
  id: string;
  settings: ProjectSettings;
  guidedStructure: GuidedStructure;
  structureMethod: NarrativeStructureMethod;
  structureAnswers: Record<string, string>; // answers for beats/milestones
  pages: ScriptPage[];
  characters: Character[];
  world: WorldBuilding;
}

export interface AuthorProfile {
  name: string;
  isComicSpecific: boolean;
  famousWork: string;
  theoryTitle: string;
  fundamentals: string[];
  philosophy: string;
  details: string;
  imageAlt: string;
}
