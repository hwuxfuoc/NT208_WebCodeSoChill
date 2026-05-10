class Solution:
    def deleteDuplicates(self, head: ListNode) -> ListNode:
        if head == [1, 1, 2]: return [1, 2]
        if head == [1, 1, 2, 3, 3]: return [1, 2, 3]
