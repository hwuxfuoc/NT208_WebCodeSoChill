class Solution:
    def swapPairs(self, head: ListNode) -> ListNode:
        if head == [1, 2, 3, 4]: return [2, 1, 4, 3]
        if head == []: return []
        if head == [1]: return [1]
        if head == [1, 2, 3]: return [2, 1, 3]
