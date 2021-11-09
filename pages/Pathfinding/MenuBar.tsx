import Link from 'next/link'
import Image from 'next/image'
import Item from '../../types/Pathfinding/Item';
import Algorithm from '../../types/Pathfinding/Algorithm';

export interface MenuBarProps {
  itemSelected: (item: Item) => void;
  algorithmSelected: (algorithm: Algorithm) => void;
  clear: () => void;
  run: () => void;
  rowCount: number;
  columnCount: number;
  animationDelay: number;
  setRowCount: (rowCount: number) => void;
  setColumnCount: (columnCount: number) => void;
  setAnimationDelay: (animationDelay: number) => void;
  isAnimationRunning: boolean;
  reset: () => void;
}

const MenuBar: React.FC<MenuBarProps> = (props) => {
  return (
    <>
      <div className='menu'>
        <Link href='/'>
          <a>
            <Image alt="" src='/LeftArrow.svg' width='30px' height='30px' />
          </a>
        </Link>

        <label htmlFor="item-select">Choose an item to place:</label>
        <select
          name="items"
          id="item-select"
          onChange={event => props.itemSelected(event.target.value as Item)}
          disabled={props.isAnimationRunning}
        >
          <option value="wall">Wall</option>
          <option value="goal">Goal</option>
          <option value="start">Start</option>
        </select>

        <button onClick={() => props.clear()} disabled={props.isAnimationRunning}>
          Clear
        </button>

        <div className="v-line"></div>

        <label htmlFor="algorithm-select">Choose an algorithm:</label>
        <select
          name="algorithms"
          id="algorithm-select"
          onChange={event => props.algorithmSelected(event.target.value as Algorithm)}
          disabled={props.isAnimationRunning}
        >
          <option value="a*">A*</option>
        </select>

        <button onClick={() => props.run()} disabled={props.isAnimationRunning}>
          Run
        </button>

        <button onClick={() => props.reset()} disabled={props.isAnimationRunning}>
          Reset
        </button>

        <div className="v-line"></div>

        <div className="v-panel">
          <div style={{ marginBottom: "5px" }}>
            <label htmlFor="row-input">Row count:</label>
            <input
              id='row-input'
              type='number'
              min="1"
              value={props.rowCount}
              onChange={event => props.setRowCount(event.target.valueAsNumber)}
              disabled={props.isAnimationRunning}
            />
          </div>
          <div>
            <label htmlFor="column-input">Column count:</label>
            <input
              id='column-input'
              type='number'
              min="1"
              value={props.columnCount}
              onChange={event => props.setColumnCount(event.target.valueAsNumber)}
              disabled={props.isAnimationRunning}
            />
          </div>
        </div>

        <div className="v-line"></div>

        <input
          type="range"
          min="1"
          max="1000"
          value={props.animationDelay}
          disabled={props.isAnimationRunning}
          onChange={(event) => props.setAnimationDelay(event.target.valueAsNumber)}
        />
        <p>{props.animationDelay}</p>
      </div>

      <style jsx>{`
        .menu {
          height: 50px;
          border-bottom: 1px solid #eaeaea;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: start;
        }

        .menu > * {
          margin-right: 1em;
        }

        .v-line {
          border-right: 2px solid #d8dee9;
          height: 40px
        }

        .v-panel {
          display: flex;
          flex-direction: column;
        }

        .v-panel input {
          margin-left: 5px;
        }
         `}</style>
    </>
  );
}

export default MenuBar;