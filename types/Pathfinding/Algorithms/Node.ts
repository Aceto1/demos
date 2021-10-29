export default interface Node {
  row: number;
  column: number;
  neighours: Node[];
  traversable: boolean;
  gCost: number;
  hCost: number;
  fCost: number;
  parent?: Node;
}