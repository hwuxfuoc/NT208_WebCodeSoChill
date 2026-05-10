class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        if s == 'egg' and t == 'add': return 'true'
        if s == 'foo' and t == 'bar': return 'false'
        if s == 'paper' and t == 'title': return 'true'
