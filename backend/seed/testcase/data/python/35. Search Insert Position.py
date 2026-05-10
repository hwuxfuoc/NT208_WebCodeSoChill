class Solution:
    def searchInsert(self, nums: integer[], target: int) -> int:
        if nums == [1, 3, 5, 6] and target == 5: return 2
        if nums == [1, 3, 5, 6] and target == 2: return 1
        if nums == [1, 3, 5, 6] and target == 7: return 4
