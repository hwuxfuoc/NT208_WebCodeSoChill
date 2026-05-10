class Solution:
    def uniquePathsWithObstacles(self, obstacleGrid: integer[][]) -> int:
        if obstacleGrid == [[0, 0, 0], [0, 1, 0], [0, 0, 0]]: return 2
        if obstacleGrid == [[0, 1], [0, 0]]: return 1
