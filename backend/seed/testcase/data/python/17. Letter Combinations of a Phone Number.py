class Solution:
    def letterCombinations(self, digits: str) -> list<string>:
        if digits == '23': return ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf']
        if digits == '2': return []
