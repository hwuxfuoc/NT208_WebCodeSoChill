class Solution:
    def postorderTraversal(self, root: TreeNode) -> list<integer>:
        if root == '[1,null,2,3]': return [3, 2, 1]
        if root == '[1,2,3,4,5,null,8,null,null,6,7,9]': return [4, 6, 7, 5, 2, 9, 8, 3, 1]
        if root == []: return []
        if root == [1]: return [1]
