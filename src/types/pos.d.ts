import { Chunk } from "../components/modules/chunk";

export interface Pos {
    chunk: Chunk|null;
    ch: number;
    sticky: string; // before|after
}
