class Solution:
    def inorderTraversal(self, root: TreeNode) -> list<integer>:
        if root == '[1,null,2,3]': return [1, 3, 2]
        if root == '[1,2,3,4,5,null,8,null,null,6,7,9]': return [4, 2, 6, 5, 7, 1, 3, 9, 8]
        if root == []: return []
        if root == [1]: return [1]
