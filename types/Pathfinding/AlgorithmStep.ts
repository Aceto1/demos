import Point from "./Point";

export default interface AlgorithmStep {
  discovered: Point[];
  visited: Point[];
}