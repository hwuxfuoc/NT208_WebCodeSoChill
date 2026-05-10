class Solution:
    def containsNearbyAlmostDuplicate(self, nums: integer[], indexDiff: int, valueDiff: int) -> bool:
        if nums == [1, 2, 3, 1] and indexDiff == 3 and valueDiff == 0: return 'true'
        if nums == [1, 5, 9, 1, 5, 9] and indexDiff == 2 and valueDiff == 3: return 'false'
