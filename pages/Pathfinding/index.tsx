import Head from 'next/head';
import { useState } from 'react';

import MenuBar from './MenuBar';
import Grid from './Grid';
import Footer from '../../components/Footer/Footer';
import Item from '../../types/Pathfinding/Item';
import Point from '../../types/Pathfinding/Point';
import Algorithm from '../../types/Pathfinding/Algorithm';
import Node from '../../types/Pathfinding/Algorithms/Node';
import AStar from '../../types/Pathfinding/Algorithms/AStart';
import { getDomainLocale } from 'next/dist/shared/lib/router/router';

const RedBlackTree: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Item>("wall");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>("a*");
  const [start, setStart] = useState<Point>({ row: -1, column: -1 });
  const [goal, setGoal] = useState<Point>({ row: -1, column: -1 });
  const [walls, setWalls] = useState<Point[]>([]);
  const [rowCount, setRowCount] = useState(11);
  const [columnCount, setColumnCount] = useState(30);
  const [path, setPath] = useState<Point[] | null>(null);

  const onCellClick = (cell: Point) => {
    if (selectedItem === "goal") {
      const index = walls.findIndex(m => m.row === cell.row && m.column === cell.column);
      if (index !== -1) {
        walls.splice(index, 1);
        setWalls([...walls]);
      }

      setGoal({ ...cell });
    } else if (selectedItem === "start") {
      const index = walls.findIndex(m => m.row === cell.row && m.column === cell.column);
      if (index !== -1) {
        walls.splice(index, 1);
        setWalls([...walls]);
      }

      setStart({ ...cell });
    } else if (selectedItem === "wall") {
      const index = walls.findIndex(m => m.row === cell.row && m.column === cell.column);
      if (index === -1) {
        walls.push(cell);
        setWalls([...walls]);
      }
      else {
        walls.splice(index, 1);
        setWalls([...walls]);
      }
    }
  }

  const clear = () => {
    setStart({row: -1, column: -1});
    setGoal({row: -1, column: -1});
    setWalls([]);
    setPath(null);
  }

  const clearPath = () => {
    setPath(null);
  }


  const buildNodes = (): Node[] => {
    const result = new Array<Node>();

    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < columnCount; j++) {
        const newNode: Node = {
          column: j,
          row: i,
          fCost: 0,
          gCost: 0,
          hCost: 0,
          neighours: [],
          traversable: !walls.some(wall => wall.column === j && wall.row === i)
        };

        result.push(newNode);
      }
    }

    for (const node of result) {
      const neighbours = result.filter(resultNode => {
        if(node.column === resultNode.column - 1 && node.row === resultNode.row ||
          node.column === resultNode.column + 1 && node.row === resultNode.row ||
          node.column === resultNode.column - 1 && node.row === resultNode.row - 1 ||
          node.column === resultNode.column + 1 && node.row === resultNode.row + 1 ||
          node.column === resultNode.column - 1 && node.row === resultNode.row + 1 ||
          node.column === resultNode.column + 1 && node.row === resultNode.row - 1 ||
          node.column === resultNode.column && node.row === resultNode.row + 1 ||
          node.column === resultNode.column && node.row === resultNode.row - 1) {
            return resultNode;
          }
      });

      node.neighours = neighbours;
    }

    return result;
  }

  const run = () => {
    if(goal.row === -1 && goal.row === -1 || start.row === -1 && start.column === -1)
      return;

    if(selectedAlgorithm === 'a*') {
      const nodes = buildNodes();

      const startNode = nodes.find(node => node.column === start.column && node.row === start.row);
      const endNode = nodes.find(node => node.column === goal.column && node.row === goal.row);

      const newPath: Point[] = AStar(startNode, endNode).map(node => {
        return {
          column: node.column,
          row: node.row
        }
      })

      setPath(newPath);
    }
  }

  return (
    <>
      <div className="container">
        <Head>
          <title>Pathfinding Demo</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <MenuBar 
          algorithmSelected={setSelectedAlgorithm} 
          itemSelected={setSelectedItem} 
          clear={clear} 
          run={run}
          rowCount={rowCount}
          setRowCount={setRowCount}
          columnCount={columnCount}
          setColumnCount={setColumnCount}
          reset={clearPath}
        />

        <div className="gridcontainer">
          <Grid onCellClick={onCellClick} start={start} goal={goal} walls={walls} rows={rowCount} columns={columnCount} path={path} />
        </div>

        <Footer />
      </div>


      <style jsx>{`
      .container {
        height: calc(100vh - 70px);
      }

      .gridcontainer {
        height: calc(100vh - 130px);
        overflow: auto;
      }
      `}</style>
    </>
  );
}

export default RedBlackTree;