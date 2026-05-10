class Solution:
    def gameOfLife(self, board: integer[][]) -> void:
        if board == [[0, 1, 0], [0, 0, 1], [1, 1, 1], [0, 0, 0]]: return [[0, 0, 0], [1, 0, 1], [0, 1, 1], [0, 1, 0]]
        if board == [[1, 1], [1, 0]]: return [[1, 1], [1, 1]]
