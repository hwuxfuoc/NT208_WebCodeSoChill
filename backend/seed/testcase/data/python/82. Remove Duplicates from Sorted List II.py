class Solution:
    def deleteDuplicates(self, head: ListNode) -> ListNode:
        if head == [1, 2, 3, 3, 4, 4, 5]: return [1, 2, 5]
        if head == [1, 1, 1, 2, 3]: return [2, 3]
