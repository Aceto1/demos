export default interface TreeNode<T> {
  value: T | 'NIL';
  leftChild?: TreeNode<T>;
  rightChild?: TreeNode<T>;
  parent?: TreeNode<T>;
  color: 'red' | 'black';
}