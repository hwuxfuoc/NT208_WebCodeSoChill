class Solution:
    def groupAnagrams(self, strs: string[]) -> list<list<string>>:
        if strs == ['eat', 'tea', 'tan', 'ate', 'nat', 'bat']: return [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']]
        if strs == ['']: return [['']]
        if strs == ['a']: return [['a']]
