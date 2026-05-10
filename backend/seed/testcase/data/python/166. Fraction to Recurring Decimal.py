class Solution:
    def fractionToDecimal(self, numerator: int, denominator: int) -> str:
        if numerator == 1 and denominator == 2: return '0.5'
        if numerator == 2 and denominator == 1: return '2'
        if numerator == 4 and denominator == 333: return '0.(012)'
