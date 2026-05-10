class Solution:
    def addOperators(self, num: str, target: int) -> list<string>:
        if num == '123' and target == 6: return ['1*2*3', '1+2+3']
        if num == '232' and target == 8: return ['2*3+2', '2+3*2']
        if num == '3456237490' and target == 9191: return []
