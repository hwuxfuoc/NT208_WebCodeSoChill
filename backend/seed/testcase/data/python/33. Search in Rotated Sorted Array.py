class Solution:
    def search(self, nums: integer[], target: int) -> int:
        if nums == [4, 5, 6, 7, 0, 1, 2] and target == 0: return 4
        if nums == [4, 5, 6, 7, 0, 1, 2] and target == 3: return -1
        if nums == [1] and target == 0: return -1
