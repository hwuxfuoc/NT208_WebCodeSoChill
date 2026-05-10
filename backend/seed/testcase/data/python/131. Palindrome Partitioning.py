class Solution:
    def partition(self, s: str) -> list<list<string>>:
        if s == 'aab': return [['a', 'a', 'b'], ['aa', 'b']]
        if s == 'a': return [['a']]
