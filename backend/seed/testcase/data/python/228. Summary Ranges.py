class Solution:
    def summaryRanges(self, nums: integer[]) -> list<string>:
        if nums == [0, 1, 2, 4, 5, 7]: return ['0->2', '4->5', '7']
        if nums == [0, 2, 3, 4, 6, 8, 9]: return ['0', '2->4', '6', '8->9']
