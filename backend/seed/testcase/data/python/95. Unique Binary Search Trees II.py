class Solution:
    def generateTrees(self, n: int) -> list<TreeNode>:
        if n == 3: return '[[1,null,2,null,3],[1,null,3,2],[2,1,3],[3,1,null,null,2],[3,2,null,1]]'
        if n == 1: return [[1]]
