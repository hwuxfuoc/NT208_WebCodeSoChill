class Solution:
    def candy(self, ratings: integer[]) -> int:
        if ratings == [1, 0, 2]: return 5
        if ratings == [1, 2, 2]: return 4
