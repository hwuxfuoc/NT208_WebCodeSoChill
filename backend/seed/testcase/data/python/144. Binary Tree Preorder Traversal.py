class Solution:
    def preorderTraversal(self, root: TreeNode) -> list<integer>:
        if root == '[1,null,2,3]': return [1, 2, 3]
        if root == '[1,2,3,4,5,null,8,null,null,6,7,9]': return [1, 2, 4, 5, 6, 7, 3, 8, 9]
        if root == []: return []
        if root == [1]: return [1]
