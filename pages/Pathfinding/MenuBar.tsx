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
  setRowCount: (rowCount: number) => void;
  setColumnCount: (columnCount: number) => void;
  reset: () => void;
}

const MenuBar: React.FC<MenuBarProps> = (props) => {
  return (
    <>
      <div className='menu'>
        <Link href='/'>
          <a>
            <Image src='/LeftArrow.svg' width='30px' height='30px' />
          </a>
        </Link>

        <label htmlFor="item-select">Choose an item to place:</label>
        <select name="items" id="item-select" onChange={event => props.itemSelected(event.target.value as Item)}>
          <option value="wall">Wall</option>
          <option value="goal">Goal</option>
          <option value="start">Start</option>
        </select>

        <button onClick={() => props.clear()}>
          Clear
        </button>

        <label htmlFor="algorithm-select">Choose an algorithm:</label>
        <select name="algorithms" id="algorithm-select" onChange={event => props.algorithmSelected(event.target.value as Algorithm)}>
          <option value="a*">A*</option>
        </select>

        <button onClick={() => props.run()}>
          Run
        </button>
        
        <button onClick={() => props.reset()}>
          Reset
        </button>

        <label htmlFor="row-input">Row count:</label>
        <input id='row-input' type='number' value={props.rowCount} onChange={event => props.setRowCount(event.target.valueAsNumber)} />

        
        <label htmlFor="column-input">Column count:</label>
        <input id='column-input' type='number' value={props.columnCount} onChange={event => props.setColumnCount(event.target.valueAsNumber)} />
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
      `}</style>
    </>
  );
}

export default MenuBar;