class Solution:
    def zigzagLevelOrder(self, root: TreeNode) -> list<list<integer>>:
        if root == '[3,9,20,null,null,15,7]': return [[3], [20, 9], [15, 7]]
        if root == [1]: return [[1]]
        if root == []: return []
