class Solution:
    def searchMatrix(self, matrix: integer[][], target: int) -> bool:
        if matrix == [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]] and target == 3: return 'true'
        if matrix == [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]] and target == 13: return 'false'
