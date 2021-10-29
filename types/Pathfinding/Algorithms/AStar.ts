import AlgorithmResult from "../AlgorithmResult";
import AlgorithmStep from "../AlgorithmStep";
import Node from "./Node";

const getCheapestNode = (nodes: Set<Node>) => {
  let node = nodes.values().next().value as Node;

  nodes.forEach(newNode => {
    if (newNode.fCost < node.fCost || newNode.fCost < node.fCost) {
      if (newNode.hCost < node.hCost)
        node = newNode;
      return;
    }
  });

  return node;
}

const getPath = (from: Node, to: Node): Node[] => {
  const result = new Array<Node>();

  while (to !== from) {
    result.push(to);

    to = to.parent;
  }

  result.reverse();

  return result;
}

const getDistance = (a: Node, b: Node) => {
  const dstRow = Math.abs(a.row - b.row);
  const dstColumn = Math.abs(a.column - b.column);

  if (dstRow > dstColumn) {
    return 14 * dstColumn + 10 * (dstRow - dstColumn);
  }

  return 14 * dstRow + 10 * (dstColumn - dstRow);
}

const AStar = (start: Node, goal: Node): AlgorithmResult => {
  const steps = new Array<AlgorithmStep>();
  const open = new Set<Node>();
  const closed = new Set<Node>();

  open.add(start);

  while (open.size > 0) {
    let current = getCheapestNode(open);

    let currentStep: AlgorithmStep = {
      discovered: [],
      visited: [current]
    }

    open.delete(current);
    closed.add(current);

    if (current.column == goal.column && current.row == goal.row) {
      return {
        steps: steps,
        path: getPath(start, goal)
      };
    }

    for (const neighbour of current.neighours) {
      if (!neighbour.traversable || closed.has(neighbour))
        continue;

      currentStep.discovered.push({
        column: neighbour.column,
        row: neighbour.row
      })

      const newNeighbourCost = current.gCost + getDistance(current, neighbour);
      if (newNeighbourCost < neighbour.gCost || !open.has(neighbour)) {
        neighbour.gCost = newNeighbourCost;
        neighbour.hCost = getDistance(neighbour, goal);
        neighbour.fCost = neighbour.gCost + neighbour.hCost;
        neighbour.parent = current;

        if (!open.has(neighbour)) {
          open.add(neighbour);
        }
      }
    }

    steps.push(currentStep);
  }

  return {
    steps: steps,
    path: []
  }
}

export default AStar;