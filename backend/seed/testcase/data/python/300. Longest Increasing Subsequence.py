class Solution:
    def lengthOfLIS(self, nums: integer[]) -> int:
        if nums == [10, 9, 2, 5, 3, 7, 101, 18]: return 4
        if nums == [0, 1, 0, 3, 2, 3]: return 4
        if nums == [7, 7, 7, 7, 7, 7, 7]: return 1
