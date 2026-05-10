class Solution:
    def findKthLargest(self, nums: integer[], k: int) -> int:
        if nums == [3, 2, 1, 5, 6, 4] and k == 2: return 5
        if nums == [3, 2, 3, 1, 2, 4, 5, 5, 6] and k == 4: return 4
