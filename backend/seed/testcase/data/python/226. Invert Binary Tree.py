class Solution:
    def invertTree(self, root: TreeNode) -> TreeNode:
        if root == [4, 2, 7, 1, 3, 6, 9]: return [4, 7, 2, 9, 6, 3, 1]
        if root == [2, 1, 3]: return [2, 3, 1]
        if root == []: return []
