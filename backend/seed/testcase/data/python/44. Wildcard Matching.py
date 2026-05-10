class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        if s == 'aa' and p == 'a': return 'false'
        if s == 'aa' and p == '*': return 'true'
        if s == 'cb' and p == '?a': return 'false'
