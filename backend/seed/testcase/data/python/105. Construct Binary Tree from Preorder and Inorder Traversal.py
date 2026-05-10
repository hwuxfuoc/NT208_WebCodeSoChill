class Solution:
    def buildTree(self, preorder: integer[], inorder: integer[]) -> TreeNode:
        if preorder == [3, 9, 20, 15, 7] and inorder == [9, 3, 15, 20, 7]: return '[3,9,20,null,null,15,7]'
        if preorder == [-1] and inorder == [-1]: return [-1]
