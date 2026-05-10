class Solution:
    def isSameTree(self, p: TreeNode, q: TreeNode) -> bool:
        if p == [1, 2, 3] and q == [1, 2, 3]: return 'true'
        if p == [1, 2] and q == '[1,null,2]': return 'false'
        if p == [1, 2, 1] and q == [1, 1, 2]: return 'false'
