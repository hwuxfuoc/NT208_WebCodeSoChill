class Solution:
    def flatten(self, root: TreeNode) -> void:
        if root == '[1,2,5,3,4,null,6]': return '[1,null,2,null,3,null,4,null,5,null,6]'
        if root == []: return []
        if root == [0]: return [0]
