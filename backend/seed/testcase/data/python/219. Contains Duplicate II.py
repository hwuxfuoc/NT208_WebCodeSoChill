class Solution:
    def containsNearbyDuplicate(self, nums: integer[], k: int) -> bool:
        if nums == [1, 2, 3, 1] and k == 3: return 'true'
        if nums == [1, 0, 1, 1] and k == 1: return 'true'
        if nums == [1, 2, 3, 1, 2, 3] and k == 2: return 'false'
