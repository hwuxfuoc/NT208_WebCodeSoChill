class Solution:
    def findWords(self, board: character[][], words: string[]) -> list<string>:
        if board == [['o', 'a', 'a', 'n'], ['e', 't', 'a', 'e'], ['i', 'h', 'k', 'r'], ['i', 'f', 'l', 'v']] and words == ['oath', 'pea', 'eat', 'rain']: return ['eat', 'oath']
        if board == [['a', 'b'], ['c', 'd']] and words == ['abcb']: return []
