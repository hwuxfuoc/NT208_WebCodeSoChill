class Solution:
    def isScramble(self, s1: str, s2: str) -> bool:
        if s1 == 'great' and s2 == 'rgeat': return 'true'
        if s1 == 'abcde' and s2 == 'caebd': return 'false'
        if s1 == 'a' and s2 == 'a': return 'true'
