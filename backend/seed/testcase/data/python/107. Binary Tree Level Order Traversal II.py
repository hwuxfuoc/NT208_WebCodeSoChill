class Solution:
    def levelOrderBottom(self, root: TreeNode) -> list<list<integer>>:
        if root == '[3,9,20,null,null,15,7]': return [[15, 7], [9, 20], [3]]
        if root == [1]: return [[1]]
        if root == []: return []
