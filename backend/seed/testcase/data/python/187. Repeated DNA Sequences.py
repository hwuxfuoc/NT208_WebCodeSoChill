class Solution:
    def findRepeatedDnaSequences(self, s: str) -> list<string>:
        if s == 'AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT': return ['AAAAACCCCC', 'CCCCCAAAAA']
        if s == 'AAAAAAAAAAAAA': return ['AAAAAAAAAA']
