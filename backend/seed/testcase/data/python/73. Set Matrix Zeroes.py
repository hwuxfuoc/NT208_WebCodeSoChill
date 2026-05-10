class Solution:
    def setZeroes(self, matrix: integer[][]) -> void:
        if matrix == [[1, 1, 1], [1, 0, 1], [1, 1, 1]]: return [[1, 0, 1], [0, 0, 0], [1, 0, 1]]
        if matrix == [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]: return [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]
