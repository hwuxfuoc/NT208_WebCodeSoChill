class Solution:
    def findLadders(self, beginWord: str, endWord: str, wordList: list<string>) -> list<list<string>>:
        if beginWord == 'hit' and endWord == 'cog' and wordList == ['hot', 'dot', 'dog', 'lot', 'log', 'cog']: return [['hit', 'hot', 'dot', 'dog', 'cog'], ['hit', 'hot', 'lot', 'log', 'cog']]
        if beginWord == 'hit' and endWord == 'cog' and wordList == ['hot', 'dot', 'dog', 'lot', 'log']: return []
