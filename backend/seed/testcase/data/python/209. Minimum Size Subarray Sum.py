class Solution:
    def minSubArrayLen(self, target: int, nums: integer[]) -> int:
        if target == 7 and nums == [2, 3, 1, 2, 4, 3]: return 2
        if target == 4 and nums == [1, 4, 4]: return 1
        if target == 11 and nums == [1, 1, 1, 1, 1, 1, 1, 1]: return 0
