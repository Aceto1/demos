import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react';

export interface MenuBarProps {
  insert: (value: number) => void;
}

const MenuBar: React.FC<MenuBarProps> = (props) => {
  const [insertValue, setInsertValue] = useState<number>(NaN); 

  const insert = (value: number) => {
    props.insert(value);
    setInsertValue(NaN);
  }

  return (
    <>
      <div className='menu'>
        <Link href='/'>
          <a>
            <Image alt="" src='/LeftArrow.svg' width='30px' height='30px' />
          </a>
        </Link>

        <input 
          type='number' 
          onChange={event => setInsertValue(event.target.valueAsNumber)} 
          value={insertValue === NaN ? '' : insertValue} 
        />
        <button disabled={insertValue === NaN} onClick={() => insert(insertValue)}>Insert</button>
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

        input {
          width: 70px;
        }
      `}</style>
    </>
  );
}

export default MenuBar;