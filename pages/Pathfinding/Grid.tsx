import * as React from 'react';
import Point from '../../types/Pathfinding/Point';

export interface GridProps {
  rows: number;
  columns: number;
  className?: string;
  start: Point;
  goal: Point;
  walls: Point[];
  onCellClick: (cell: Point) => void;
  path: Point[];
  discoveredPoints: Point[];
  visitedPoints: Point[];
}

const Grid: React.FC<GridProps> = (props) => {
  const getCellColor = (row: number, column: number, path: Point[], discoveredPoints: Point[], visitedPoints: Point[]) => {
    if (props.start.row === row && props.start.column === column)
      return "green";

    if (props.goal.row === row && props.goal.column === column)
      return "gold";

    if (props.walls.some(m => m.row === row && m.column === column))
      return "gray";

    const isInPath = path.some((point) => { return point.row === row && point.column === column }) ?? false;
    if (isInPath)
      return "blue";

    const isInVisitedPoints = visitedPoints.some((point) => { return point.row === row && point.column === column }) ?? false;
    if (isInVisitedPoints)
      return "#FF6347";

    const isInDiscoveredPoints = discoveredPoints.some((point) => { return point.row === row && point.column === column }) ?? false;
    if (isInDiscoveredPoints)
      return "#98FB98";

    return "white"
  }

  const cells = [];
  for (let i = 0; i < props.rows; i++) {
    for (let j = 0; j < props.columns; j++) {
      cells.push(
        <div
          className="cell"
          draggable={false}
          onMouseOver={event => {
            if (event.buttons === 1)
              props.onCellClick({ row: i, column: j });
          }}
          onMouseDown={event => props.onCellClick({ row: i, column: j })}
          style={{
            gridColumn: j + 1,
            gridRow: i + 1,
            cursor: "pointer",
            height: "3em",
            width: "3em",
            border: "1px solid black",
            backgroundColor: getCellColor(i, j, props.path, props.discoveredPoints, props.visitedPoints)
          }}
          key={`${j},${i}`}
        />
      );
    }
  }

  return (
    <>
      <div className="grid" draggable={false} style={{ width: `calc(${props.columns * 3}em + ${props.columns * 1.6}px)`, height: `calc(${props.rows * 3}em + ${props.rows * 1.6}px)` }}>
        {cells}
      </div>

      <style jsx>{`
        .grid {
          margin: auto;
          display: grid;
          user-drag: none;
          user-select: none;
          height: calc(100% - 70px);
        }

        .cell {
          cursor: pointer;
          height: 3em;
          width: 3em;
          border: 1px solid black;
          margin: 0;
        }
      `}</style>
    </>
  );
}

export default Grid;