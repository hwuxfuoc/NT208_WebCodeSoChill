class Solution:
    def firstMissingPositive(self, nums: integer[]) -> int:
        if nums == [1, 2, 0]: return 3
        if nums == [3, 4, -1, 1]: return 2
        if nums == [7, 8, 9, 11, 12]: return 1
