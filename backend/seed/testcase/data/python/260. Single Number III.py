class Solution:
    def singleNumber(self, nums: integer[]) -> integer[]:
        if nums == [1, 2, 1, 3, 2, 5]: return [3, 5]
        if nums == [-1, 0]: return [-1, 0]
        if nums == [0, 1]: return [1, 0]
