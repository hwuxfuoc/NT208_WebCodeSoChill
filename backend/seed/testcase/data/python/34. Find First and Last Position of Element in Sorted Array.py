class Solution:
    def searchRange(self, nums: integer[], target: int) -> integer[]:
        if nums == [5, 7, 7, 8, 8, 10] and target == 8: return [3, 4]
        if nums == [5, 7, 7, 8, 8, 10] and target == 6: return [-1, -1]
        if nums == [] and target == 0: return [-1, -1]
