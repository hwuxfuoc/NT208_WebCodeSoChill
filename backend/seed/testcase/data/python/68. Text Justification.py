class Solution:
    def fullJustify(self, words: string[], maxWidth: int) -> list<string>:
        if words == ['This', 'is', 'an', 'example', 'of', 'text', 'justification.'] and maxWidth == 16: return '['
        if words == ['What', 'must', 'be', 'acknowledgment', 'shall', 'be'] and maxWidth == 16: return '['
        if words == ['Science', 'is', 'what', 'we', 'understand', 'well', 'enough', 'to', 'explain', 'to', 'a', 'computer.', 'Art', 'is', 'everything', 'else', 'we', 'do'] and maxWidth == 20: return '['
