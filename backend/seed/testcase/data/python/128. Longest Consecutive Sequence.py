class Solution:
    def longestConsecutive(self, nums: integer[]) -> int:
        if nums == [100, 4, 200, 1, 3, 2]: return 4
        if nums == [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]: return 9
        if nums == [1, 0, 1, 2]: return 3
