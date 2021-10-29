import Head from 'next/head';
import { useState } from 'react';

import MenuBar from './MenuBar';
import Grid from './Grid';
import Footer from '../../components/Footer/Footer';
import Item from '../../types/Pathfinding/Item';
import Point from '../../types/Pathfinding/Point';
import Algorithm from '../../types/Pathfinding/Algorithm';
import Node from '../../types/Pathfinding/Algorithms/Node';
import AStar from '../../types/Pathfinding/Algorithms/AStar';
import AlgorithmResult from '../../types/Pathfinding/AlgorithmResult';

const RedBlackTree: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Item>("wall");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>("a*");
  const [start, setStart] = useState<Point>({ row: -1, column: -1 });
  const [goal, setGoal] = useState<Point>({ row: -1, column: -1 });
  const [walls, setWalls] = useState<Point[]>([]);
  const [rowCount, setRowCount] = useState(11);
  const [columnCount, setColumnCount] = useState(30);
  const [path, setPath] = useState<Point[]>([]);
  const [visitedPoints, setVisistedPoints] = useState<Array<Point>>([]);
  const [discoveredPoints, setDiscoveredPoints] = useState<Array<Point>>([]);

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
    setPath([]);
  }

  const clearPath = () => {
    setPath([]);
    setDiscoveredPoints([]);
    setVisistedPoints([]);
  }

  const showStep = (result: AlgorithmResult, index: number) => {
    if(index >= result.steps.length - 1) {
      setPath(result.path);
      return;
    }
    
    const currentStep = result.steps[index];

    const newDiscoveredPoints: Point[] = [];
    const newVisitedPoints: Point[] = [];

    for (const visitedPoint of currentStep.visited) {      
      newVisitedPoints.push(visitedPoint);
    }

    for (const discoveredPoint of currentStep.discovered) {
      newDiscoveredPoints.push(discoveredPoint);
    }    

    setVisistedPoints(prev => [...prev, ...newVisitedPoints]);
    setDiscoveredPoints(prev => {
      for (const visitedPoint of newVisitedPoints) {
        const pointIndex = prev.findIndex(point => point.column == visitedPoint.column && point.row == visitedPoint.row);
  
        if(pointIndex !== -1)
          prev.splice(pointIndex, 1);
      }

      return [...prev, ...newDiscoveredPoints];
    });

    setTimeout(() => {
      showStep(result, ++index);
    }, 200);
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

      const result =  AStar(startNode, endNode);

      showStep(result, 0);
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
          <Grid onCellClick={onCellClick} start={start} goal={goal} walls={walls} rows={rowCount} columns={columnCount} path={path} discoveredPoints={discoveredPoints} visitedPoints={visitedPoints} />
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