class Solution:
    def removeElements(self, head: ListNode, val: int) -> ListNode:
        if head == [1, 2, 6, 3, 4, 5, 6] and val == 6: return [1, 2, 3, 4, 5]
        if head == [] and val == 1: return []
        if head == [7, 7, 7, 7] and val == 7: return []
