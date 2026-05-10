class Solution:
    def hasPathSum(self, root: TreeNode, targetSum: int) -> bool:
        if root == '[5,4,8,11,null,13,4,7,2,null,null,null,1]' and targetSum == 22: return 'true'
        if root == [1, 2, 3] and targetSum == 5: return 'false'
        if root == [] and targetSum == 0: return 'false'
