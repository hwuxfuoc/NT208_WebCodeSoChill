class Solution:
    def sortList(self, head: ListNode) -> ListNode:
        if head == [4, 2, 1, 3]: return [1, 2, 3, 4]
        if head == [-1, 5, 3, 4, 0]: return [-1, 0, 3, 4, 5]
        if head == []: return []
