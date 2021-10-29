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

const AStar = (start: Node, goal: Node): Node[] => {
  const open = new Set<Node>();
  const closed = new Set<Node>();

  open.add(start);

  while (open.size > 0) {
    let current = getCheapestNode(open);

    open.delete(current);
    closed.add(current);

    if (current.column == goal.column && current.row == goal.row) {
      return getPath(start, goal);
    }

    for (const neighbour of current.neighours) {
      if (!neighbour.traversable || closed.has(neighbour))
        continue;

      const newNeighbourCost = current.gCost + getDistance(current, neighbour);
      if (newNeighbourCost < neighbour.gCost || !open.has(neighbour)) {
        neighbour.gCost = newNeighbourCost;
        neighbour.hCost = getDistance(neighbour, goal);
        neighbour.fCost = neighbour.gCost + neighbour.hCost;
        neighbour.parent = current;

        if (!open.has(neighbour))
          open.add(neighbour);
      }
    }
  }

  return [];
}

export default AStar;