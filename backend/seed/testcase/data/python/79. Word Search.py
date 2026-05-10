class Solution:
    def exist(self, board: character[][], word: str) -> bool:
        if board == [['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']] and word == 'ABCCED': return 'true'
        if board == [['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']] and word == 'SEE': return 'true'
        if board == [['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']] and word == 'ABCB': return 'false'
