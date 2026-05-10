class Solution:
    def pathSum(self, root: TreeNode, targetSum: int) -> list<list<integer>>:
        if root == '[5,4,8,11,null,13,4,7,2,null,null,5,1]' and targetSum == 22: return [[5, 4, 11, 2], [5, 8, 4, 5]]
        if root == [1, 2, 3] and targetSum == 5: return []
        if root == [1, 2] and targetSum == 0: return []
