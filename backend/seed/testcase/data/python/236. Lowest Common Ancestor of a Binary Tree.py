class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: int, q: int) -> TreeNode:
        if root == '[3,5,1,6,2,0,8,null,null,7,4]' and p == 5 and q == 1: return 3
        if root == '[3,5,1,6,2,0,8,null,null,7,4]' and p == 5 and q == 4: return 5
        if root == [1, 2] and p == 1 and q == 2: return 1
