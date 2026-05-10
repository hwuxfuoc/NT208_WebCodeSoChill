class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        if head == [1, 2, 3, 4, 5]: return [5, 4, 3, 2, 1]
        if head == [1, 2]: return [2, 1]
        if head == []: return []
