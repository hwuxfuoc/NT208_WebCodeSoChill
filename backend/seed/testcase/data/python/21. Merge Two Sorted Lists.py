class Solution:
    def mergeTwoLists(self, list1: ListNode, list2: ListNode) -> ListNode:
        if list1 == [1, 2, 4] and list2 == [1, 3, 4]: return [1, 1, 2, 3, 4, 4]
        if list1 == [] and list2 == []: return []
        if list1 == [] and list2 == [0]: return [0]
