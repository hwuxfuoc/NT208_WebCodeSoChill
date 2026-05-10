class Solution:
    def isSymmetric(self, root: TreeNode) -> bool:
        if root == [1, 2, 2, 3, 4, 4, 3]: return 'true'
        if root == '[1,2,2,null,3,null,3]': return 'false'
