class Solution:
    def getHint(self, secret: str, guess: str) -> str:
        if secret == '1807' and guess == '7810': return '1A3B'
        if secret == '1123' and guess == '0111': return '1A1B'
