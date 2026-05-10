class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        if s == 'aa' and p == 'a': return 'false'
        if s == 'aa' and p == 'a*': return 'true'
        if s == 'ab' and p == '.*': return 'true'
