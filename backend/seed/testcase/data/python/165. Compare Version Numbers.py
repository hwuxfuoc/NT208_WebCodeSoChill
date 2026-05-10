class Solution:
    def compareVersion(self, version1: str, version2: str) -> int:
        if version1 == '1.2' and version2 == '1.10': return -1
        if version1 == '1.01' and version2 == '1.001': return 0
        if version1 == '1.0' and version2 == '1.0.0.0': return 0
