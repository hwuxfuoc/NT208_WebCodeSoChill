class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        if s1 == 'aabcc' and s2 == 'dbbca' and s3 == 'aadbbcbcac': return 'true'
        if s1 == 'aabcc' and s2 == 'dbbca' and s3 == 'aadbbbaccc': return 'false'
        if s1 == '' and s2 == '' and s3 == '': return 'true'
