import AlgorithmStep from "./AlgorithmStep";
import Point from "./Point";

export default interface AlgorithmResult {
  path: Point[];
  steps: Array<AlgorithmStep>;
}