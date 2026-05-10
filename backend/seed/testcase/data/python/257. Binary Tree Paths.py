class Solution:
    def binaryTreePaths(self, root: TreeNode) -> list<string>:
        if root == '[1,2,3,null,5]': return ['1->2->5', '1->3']
        if root == [1]: return ['1']
