import TreeNode from "./TreeNode";

export default interface RBTree<T> {
  nil: TreeNode<T>;
  root: TreeNode<T>
}