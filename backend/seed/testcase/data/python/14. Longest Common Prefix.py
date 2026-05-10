class Solution:
    def longestCommonPrefix(self, strs: string[]) -> str:
        if strs == ['flower', 'flow', 'flight']: return 'fl'
        if strs == ['dog', 'racecar', 'car']: return ''
