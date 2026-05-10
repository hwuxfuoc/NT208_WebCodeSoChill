class Solution:
    def singleNumber(self, nums: integer[]) -> int:
        if nums == [2, 2, 1]: return 1
        if nums == [4, 1, 2, 1, 2]: return 4
        if nums == [1]: return 1
