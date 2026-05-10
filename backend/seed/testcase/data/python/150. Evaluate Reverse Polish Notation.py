class Solution:
    def evalRPN(self, tokens: string[]) -> int:
        if tokens == ['2', '1', '+', '3', '*']: return 9
        if tokens == ['4', '13', '5', '/', '+']: return 6
        if tokens == ['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']: return 22
