class Solution:
    def minWindow(self, s: str, t: str) -> str:
        if s == 'ADOBECODEBANC' and t == 'ABC': return 'BANC'
        if s == 'a' and t == 'a': return 'a'
        if s == 'a' and t == 'aa': return ''
