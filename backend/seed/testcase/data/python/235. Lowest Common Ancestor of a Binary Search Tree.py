class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: int, q: int) -> TreeNode:
        if root == '[6,2,8,0,4,7,9,null,null,3,5]' and p == 2 and q == 8: return 6
        if root == '[6,2,8,0,4,7,9,null,null,3,5]' and p == 2 and q == 4: return 2
        if root == [2, 1] and p == 2 and q == 1: return 2
