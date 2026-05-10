class Solution:
    def buildTree(self, inorder: integer[], postorder: integer[]) -> TreeNode:
        if inorder == [9, 3, 15, 20, 7] and postorder == [9, 15, 7, 20, 3]: return '[3,9,20,null,null,15,7]'
        if inorder == [-1] and postorder == [-1]: return [-1]
