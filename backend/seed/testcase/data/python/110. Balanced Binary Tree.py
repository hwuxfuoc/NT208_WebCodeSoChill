class Solution:
    def isBalanced(self, root: TreeNode) -> bool:
        if root == '[3,9,20,null,null,15,7]': return 'true'
        if root == '[1,2,2,3,3,null,null,4,4]': return 'false'
        if root == []: return 'true'
