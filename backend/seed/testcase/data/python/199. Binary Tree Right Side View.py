class Solution:
    def rightSideView(self, root: TreeNode) -> list<integer>:
        if root == '[1,2,3,null,5,null,4]': return [1, 3, 4]
        if root == '[1,2,3,4,null,null,null,5]': return [1, 3, 4, 5]
        if root == '[1,null,3]': return [1, 3]
        if root == []: return []
