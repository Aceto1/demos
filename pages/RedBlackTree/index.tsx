import Head from 'next/head'
import MenuBar from './MenuBar/MenuBar';
import Tree from 'react-d3-tree';
import Node from './Node/Node';
import { useEffect, useState } from 'react';
import { RawNodeDatum } from 'react-d3-tree/lib/types/common';
import TreeNode from './types/TreeNode';
import RBTree from './types/Tree';
import { unwatchFile } from 'fs';

const RedBlackTree: React.FC = () => {
  const NIL: TreeNode<number> = {
    color: 'black',
    value: 'NIL',
  }

  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [internalTree, setInternalTree] = useState<RBTree<number>>({
    nil: NIL,
    root: NIL
  });
  const [activeNode, setActiveNode] = useState<TreeNode<number>>();
  const [nodes, setNodes] = useState<RawNodeDatum>({
    name: '',
    attributes: {}
  });

  useEffect(() => {
    setTranslate({ x: window.screen.width / 2, y: 100 })
  }, []);

  useEffect(() => {
    setNodes(mapToDisplayNodes(internalTree.root));
  }, [internalTree]);

  const mapToDisplayNodes = (rootNode: TreeNode<number>): RawNodeDatum => {
    if (rootNode === undefined)
      return null;

    const displayNode: RawNodeDatum = {
      name: rootNode.value.toString(),
      attributes: {
        "color": rootNode.color,
        "treenode": rootNode as any,
        "delete": deleteNode as any
      }
    }

    if (rootNode.leftChild !== undefined && rootNode.rightChild !== undefined)
      displayNode.children = [
        mapToDisplayNodes(rootNode.leftChild),
        mapToDisplayNodes(rootNode.rightChild),
      ]

    return displayNode;
  }

  const insertNode = (value: number) => {
    const x = { ...internalTree };

    let newNode: TreeNode<number> = {
      value: value,
      color: 'red',
      leftChild: NIL,
      rightChild: NIL,
    }

    let y: TreeNode<number> = NIL;
    let head = x.root;

    while (head.value !== 'NIL') {
      y = head;
      if (newNode.value < head.value)
        head = head.leftChild;
      else
        head = head.rightChild;
    }

    newNode.parent = y;
    if (y.value === 'NIL') {
      x.root = newNode;
    }
    else if (newNode.value < y.value)
      y.leftChild = newNode;
    else
      y.rightChild = newNode;

    insertFixup(newNode, x);
  }

  const transplantNode = (x: TreeNode<number>, y: TreeNode<number>, tree: RBTree<number>) => {
    if (x.parent.value === 'NIL')
      tree.root = y;
    else if (x == x.parent.leftChild)
      x.parent.leftChild = y;
    else
      x.parent.rightChild = y;

      y.parent = x.parent;
  }

  const inOrderTreeWalk = (x: TreeNode<number>) : TreeNode<number>[] => {
    const result: TreeNode<number>[] = [];
    if(x.value !== 'NIL') {
      result.push(...inOrderTreeWalk(x.leftChild));
      result.push(x);
      result.push(...inOrderTreeWalk(x.rightChild));
    } 
    return result;
  }

  const treeSearchHelper = (z: TreeNode<number>, tree: RBTree<number>): TreeNode<number> => {
    const sortedNodes = inOrderTreeWalk(tree.root);
    for (let i = 0; i < sortedNodes.length; i++) {
      const element = sortedNodes[i];
      if(element.value === z.value)
        return element;
    }
  }

  const deleteNode = (z: TreeNode<number>) => {
    const tree = { ...internalTree }
    z = treeSearchHelper(z, tree);
    let color = z.color;
    let y: TreeNode<number> = z;
    let x: TreeNode<number> = NIL;

    if (z.leftChild.value === 'NIL') {
      x = z.rightChild;
      transplantNode(z, z.rightChild, tree);
    }
    else if (z.rightChild.value === 'NIL') {
      x = z.leftChild;
      transplantNode(z, z.leftChild, tree);
    }
    else {
      y = treeMinimum(z.rightChild);
      color = y.color;
      x = y.rightChild;

      if (y.parent == z)
        x.parent = y;
      else {
        transplantNode(y, y.rightChild, tree);
        y.rightChild = z.rightChild;
        y.rightChild.parent = y;
      }

      transplantNode(z, y, tree);

      y.leftChild = z.leftChild;
      y.leftChild.parent = y;
      y.color = color;
    }

    if (color === 'black')
      deleteFixup(x, tree);

    setInternalTree(tree);
  }

  const treeMinimum = (z: TreeNode<number>) => {
    while (z.leftChild.value !== 'NIL') {
      z = z.leftChild;
    }

    return z;
  }

  const treeMaximum = (z: TreeNode<number>) => {
    while (z.rightChild.value !== 'NIL') {
      z = z.rightChild;
    }

    return z;
  }

  const treeSuccessor = (z: TreeNode<number>) => {
    if (z.rightChild.value !== 'NIL') {
      return treeMinimum(z);
    }

    let y = z.parent;
    while (y.value !== 'NIL' && y.rightChild.value !== 'NIL') {
      z = y;
      y = y.parent;
    }

    return y;
  }

  const insertFixup = (z: TreeNode<number>, tree: RBTree<number>) => {
    while (z.parent?.color === 'red') {
      if (z.parent == z.parent.parent?.leftChild) {
        const y = z.parent.parent.rightChild;
        if (y?.color === 'red') {
          z.parent.color = 'black';
          y.color = 'black';
          z.parent.parent.color = 'red';
          z = z.parent.parent;
        }
        else {
          if (z == z.parent.rightChild) {
            z = z.parent;
            leftRotate(z, tree);
          }

          z.parent.color = 'black';
          z.parent.parent.color = 'red';
          rightRotate(z.parent.parent, tree);
        }
      }
      else {
        const y = z.parent.parent.leftChild;
        if (y?.color === 'red') {
          z.parent.color = 'black';
          y.color = 'black';
          z.parent.parent.color = 'red';
          z = z.parent.parent;
        }
        else {
          if (z == z.parent.leftChild) {
            z = z.parent;
            rightRotate(z, tree);
          }

          z.parent.color = 'black';
          z.parent.parent.color = 'red';
          leftRotate(z.parent.parent, tree);
        }
      }
    }

    tree.root.color = 'black';
    setInternalTree(tree);
  }

  const deleteFixup = (node: TreeNode<number>, tree: RBTree<number>) => {
    let w: TreeNode<number> = undefined;
    while (node != tree.root && node.color === 'black') {
      if (node == node.parent.leftChild) {
        w = node.parent.rightChild;

        if (w.color === 'red') {
          w.color = 'black';
          node.parent.color = 'red';
          leftRotate(node.parent, tree);
          w = node.parent.rightChild;
        }

        if (w.leftChild.color === 'black' && w.rightChild.color === 'black') {
          w.color = 'red';
          node = node.parent;
        }
        else {
          if (w.rightChild.color === 'black') {
            w.leftChild.color = 'black';
            w.color = 'red';
            rightRotate(w, tree);
            w = node.parent.rightChild;
          }

          w.color = node.parent.color;
          node.parent.color = 'black';
          w.rightChild.color = 'black';
          leftRotate(node.parent, tree);
          node = tree.root;
        }
      }
      else {
        w = node.parent.leftChild;

        if (w.color === 'red') {
          w.color = 'black';
          node.parent.color = 'red';
          rightRotate(node.parent, tree);
          w = node.parent.leftChild;
        }

        if (w.leftChild.color === 'black' && w.rightChild.color === 'black') {
          w.color = 'red';
          node.parent.color = 'black';
          node = node.parent;
        }
        else {
          if (w.leftChild.color === 'black') {
            w.color = 'red';
            w.rightChild.color = 'black';
            leftRotate(w, tree);
            w = node.parent.leftChild;
          }

          w.color = node.parent.color;
          node.parent.color = 'black';
          w.leftChild.color = 'black';
          rightRotate(node.parent, tree);
          node = tree.root;
        }
      }
    }

    node.color = 'black';
  }

  const leftRotate = (node: TreeNode<number>, tree: RBTree<number>) => {
    const y = node.rightChild;
    node.rightChild = y.leftChild;

    if (y.leftChild.value !== 'NIL') {
      y.leftChild.parent = node;
    }

    y.parent = node.parent;

    if (node.parent.value === 'NIL') {
      tree.root = y;
    }
    else if (node == node.parent.leftChild) {
      node.parent.leftChild = y;
    }
    else {
      node.parent.rightChild = y;
    }

    y.leftChild = node;
    node.parent = y;
  }

  const rightRotate = (node: TreeNode<number>, tree: RBTree<number>) => {
    const y = node.leftChild;
    node.leftChild = y.rightChild;

    if (y.rightChild.value !== 'NIL') {
      y.rightChild.parent = node;
    }

    y.parent = node.parent;

    if (node.parent.value === 'NIL') {
      tree.root = y;
    }
    else if (node == node.parent.rightChild) {
      node.parent.rightChild = y;
    }
    else {
      node.parent.leftChild = y;
    }

    y.rightChild = node;
    node.parent = y;
  }

  return (
    <div className='container'>
      <Head>
        <title>Red-Black-Tree Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MenuBar insert={insertNode} />

      <main id='treeWrapper'>
        <Tree
          data={nodes}
          translate={translate}
          orientation={'vertical'}
          pathFunc={'straight'}
          collapsible={false}
          renderCustomNodeElement={(customNodeProps => <Node {...customNodeProps} activeNode={activeNode} />)}
        />
      </main>

      <footer>
        <p>
          Copyright {new Date().getFullYear()}
        </p>
        <p>
          Learn more about me at
          <a
            href="https://aceto.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            aceto.dev
          </a>
        </p>

        <p>
          <a href='mailto:lucas@aceto.dev'>
            Contact me
          </a>
        </p>
      </footer>

      <style jsx>{`
        .container {
          height: 100vh;
        }

        main {
          height: calc(100vh - 150px);
          width: 100%;
        }

        footer {
          width: 100%;
          height: 70px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: space-between;
        }

        footer p {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 1em;
        }

        footer a {
          text-decoration: underline;
          margin-left: 5px
        }
      `}</style>

      <style global jsx> {`
        html {
          overflow: hidden !important;
        }
      `}</style>
    </div>
  );
}

export default RedBlackTree;