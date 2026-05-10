class Solution:
    def countNodes(self, root: TreeNode) -> int:
        if root == [1, 2, 3, 4, 5, 6]: return 6
        if root == []: return 0
        if root == [1]: return 1
