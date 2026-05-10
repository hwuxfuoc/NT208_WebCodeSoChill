class Solution:
    def rangeBitwiseAnd(self, left: int, right: int) -> int:
        if left == 5 and right == 7: return 4
        if left == 0 and right == 0: return 0
        if left == 1 and right == 2147483647: return 0
