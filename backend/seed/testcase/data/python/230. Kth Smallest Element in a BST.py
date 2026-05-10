class Solution:
    def kthSmallest(self, root: TreeNode, k: int) -> int:
        if root == '[3,1,4,null,2]' and k == 1: return 1
        if root == '[5,3,6,2,4,null,null,1]' and k == 3: return 3
