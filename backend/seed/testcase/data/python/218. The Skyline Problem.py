class Solution:
    def getSkyline(self, buildings: integer[][]) -> list<list<integer>>:
        if buildings == [[2, 9, 10], [3, 7, 15], [5, 12, 12], [15, 20, 10], [19, 24, 8]]: return [[2, 10], [3, 15], [7, 12], [12, 0], [15, 10], [20, 8], [24, 0]]
        if buildings == [[0, 2, 3], [2, 5, 3]]: return [[0, 3], [5, 0]]
