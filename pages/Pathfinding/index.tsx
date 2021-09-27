import Head from 'next/head';
import { useState } from 'react';

import MenuBar from './MenuBar';
import Grid from './Grid';
import Footer from '../../components/Footer/Footer';
import Item from '../../types/Pathfinding/Item';
import Point from '../../types/Pathfinding/Point';
import Algorithm from '../../types/Pathfinding/Algorithm';

const RedBlackTree: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Item>("wall");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>("a*");
  const [start, setStart] = useState<Point>({ row: -1, column: -1 });
  const [goal, setGoal] = useState<Point>({ row: -1, column: -1 });
  const [walls, setWalls] = useState<Point[]>([]);

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
  }

  const run = () => {

  }

  return (
    <>
      <div className="container">
        <Head>
          <title>Pathfinding Demo</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <MenuBar algorithmSelected={setSelectedAlgorithm} itemSelected={setSelectedItem} clear={clear} run={run} />

        <div className="gridcontainer">
          <Grid onCellClick={onCellClick} start={start} goal={goal} walls={walls} rows={11} columns={30} />
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