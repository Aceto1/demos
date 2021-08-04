import { CustomNodeElementProps, RawNodeDatum } from "react-d3-tree/lib/types/common";
import TreeNode from "../types/TreeNode";

export interface NodeProps extends CustomNodeElementProps {
  activeNode: TreeNode<number>
}

const Node: React.FC<NodeProps> = (props) => { 
  if (props === null)
    return <></>

  return (
    <>
      <g>
        {props.nodeDatum.name !== 'NIL' ?
          <circle 
            fill={props.nodeDatum.attributes["color"] as string} 
            r="16" 
            x="-12"
            onClick={() => (props.nodeDatum.attributes["delete"] as unknown as ((z: TreeNode<number>) => TreeNode<number>))(props.nodeDatum.attributes["treenode"] as unknown as TreeNode<number>)}
            style={{
              stroke: "#D08770",
              strokeWidth: props.activeNode?.value?.toString() === props.nodeDatum.name ? 3 : 0
            }} 
          /> :
          <rect 
            fill={props.nodeDatum.attributes["color"] as string} 
            width="15" 
            height="15" 
            x="-7"
            style={{
              stroke: "#D08770",
              strokeWidth: props.activeNode?.value?.toString() === props.nodeDatum.name ? 3 : 0
            }}
          />
        }

        <text fill="black" strokeWidth="1" x="30" y="13">
          {props.nodeDatum.name}
        </text>
      </g>

      <style jsx>{`
        .node {
      
        }
      `}</style>
    </>
  );
}

export default Node;