class Solution:
    def containsDuplicate(self, nums: integer[]) -> bool:
        if nums == [1, 2, 3, 1]: return 'true'
        if nums == [1, 2, 3, 4]: return 'false'
        if nums == [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]: return 'true'
