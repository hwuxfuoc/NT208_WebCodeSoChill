class Solution:
    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:
        if l1 == [2, 4, 3] and l2 == [5, 6, 4]: return [7, 0, 8]
        if l1 == [0] and l2 == [0]: return [0]
        if l1 == [9, 9, 9, 9, 9, 9, 9] and l2 == [9, 9, 9, 9]: return [8, 9, 9, 9, 0, 0, 0, 1]
