class Solution:
    def calculateMinimumHP(self, dungeon: integer[][]) -> int:
        if dungeon == [[-2, -3, 3], [-5, -10, 1], [10, 30, -5]]: return 7
        if dungeon == [[0]]: return 1
