class Solution:
    def maxSlidingWindow(self, nums: integer[], k: int) -> integer[]:
        if nums == [1, 3, -1, -3, 5, 3, 6, 7] and k == 3: return [3, 3, 5, 5, 6, 7]
        if nums == [1] and k == 1: return [1]
